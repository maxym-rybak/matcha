import { Request } from 'express'
import jwt from 'jsonwebtoken'
import { User, PublicProfile, userModel } from '../models/User'
import { InterestModel } from '../models/Interest'
import { LookingForModel } from '../models/LookingFor'
import { Heart, heartModel } from '../models/Heart'
import ResManager, { ResInfo } from '../util/ResManager'
import { imageModel } from '../models/Image'

import knex from 'knex'
import { knexConfig } from '../config'
let db = knex(knexConfig)

const interestModel = new InterestModel()
const lookingForModel = new LookingForModel()

export default class UserActions {
	static async getInterests(userId: number): Promise<string[]> {
		const interests = await userModel.getInterests(userId)
		let names: string[] = []
		interests.forEach((element) => {
			names.push(element.name)
		})
		return names
	}

	static async getLookingFor(userId: number): Promise<string[]> {
		const interests = await userModel.getLookingFor(userId)
		let names: string[] = []
		interests.forEach((element) => {
			names.push(element.name)
		})
		return names
	}

	static async setInterests(userId: number, interestsList: [string]): Promise<void | ResInfo> {
		try {
			await interestModel.delete({ userId: userId })
			await userModel.setInterests(userId, interestsList)
		} catch (err) {
			return ResManager.serverError()
		}
	}

	static async setLookingFor(userId: number, interestsList: [string]): Promise<void | ResInfo> {
		try {
			await lookingForModel.delete({ userId: userId })
			await userModel.setLookingFor(userId, interestsList)
		} catch (err) {
			return ResManager.serverError()
		}
	}

	static async getUserFromCookeis(req: Request): Promise<[User, null] | [null, ResInfo]> {
		const token = req.cookies['jwt']
		const decoded = jwt.decode(token)
		let user

		if (decoded && typeof decoded !== 'string') {
			try {
				user = await userModel.getOne(Number(decoded.id))
				if (!user || user instanceof Error) {
					return [null, new ResInfo(422, ResManager.error('No such user'))]
				}
			} finally {
				if (userModel.isInstance(user)) {
					return [user, null]
				} else {
					return [null, ResManager.serverError()]
				}
			}
		}
		return [null, ResManager.serverError()]
	}

	static async getUserById(id: number): Promise<[User, null] | [null, ResInfo]> {
		let user
		try {
			user = await userModel.getOne(id)
		} finally {
			if (user && userModel.isInstance(user)) {
				return [user, null]
			} else {
				return [null, ResManager.serverError()]
			}
		}
	}

	static async getUserByUsername(username: string): Promise<[User, null] | [null, ResInfo]> {
		let user
		try {
			user = (await userModel.getWhere({ username: username }))[0]
		} finally {
			if (user && userModel.isInstance(user)) {
				return [user, null]
			} else {
				return [null, ResManager.serverError()]
			}
		}
	}

	static async getUserFromRequest(req: Request): Promise<[User, null] | [null, ResInfo]> {
		let user: [User, null] | [null, ResInfo]
		if (req.params.username && req.params.username !== 'undefined') {
			user = await UserActions.getUserByUsername(req.params.username)
		} else {
			user = await UserActions.getUserFromCookeis(req)
		}
		return user
	}

	static async getProfileData(user: User, currentUserId: number): Promise<PublicProfile> {
		// const userAccessibleData = userModel.fillAccessibleColumns({ ...user })
		const interests = await UserActions.getInterests(Number(user.id))
		const lookingFor = await UserActions.getLookingFor(Number(user.id))
		let avatar
		if (user.avatar) {
			const image = await imageModel.getWhere({ id: user.avatar })
			if (image.length > 0) {
				const normal = `${process.env.API_SERVER}/public/uploads/normal/${image[0].image}`
				const thumbnail = `${process.env.API_SERVER}/public/uploads/thumbnail/${image[0].image}`
				avatar = {
					normal: normal,
					thumbnail: thumbnail,
				}
			}
		}
		let heartIsGiven: boolean = false
		if (currentUserId) {
			const hearts = await heartModel.getWhere({ from: currentUserId, to: user.id })
			heartIsGiven = hearts.length > 0 ? true : false
		}
		const allUserHearts = await heartModel.getWhere({ to: user.id })
		const age = this.calculateAge(user.birth)
		const profile: PublicProfile = {
			...user,
			interests: interests,
			lookingFor: lookingFor,
			avatar: avatar,
			heartIsGiven: heartIsGiven,
			heartsNumber: allUserHearts.length,
			age: age,
		}
		return profile
	}

	static calculateAge(birthday: Date) {
		var ageDifMs = Date.now() - birthday.getTime()
		var ageDate = new Date(ageDifMs) // miliseconds from epoch
		return Math.abs(ageDate.getUTCFullYear() - 1970)
	}

	static async search(req: Request, user: User) {
		const lookingfor = req.query.lookingfor ? req.query.lookingfor : ''
		const interest = req.query.interest ? req.query.interest : ''
		const distance = Number(req.query.distance) ? Number(req.query.distance) * 1000 : 100000000
		const page = req.query.page ? req.query.page : 1
		const limit = page ? `limit ${18 * (page - 1)}, ${18}` : ''

		const results = await db.raw(
			`SELECT distinct user.*, 
			(ST_Distance_Sphere(point(${user.lon}, ${user.lat}),
			point(user.lon, user.lat), 6371000)) as distance  FROM user
			left join lookingFor lF on user.id = lF.userId
			left join interest i on user.id = i.userId
			where (ST_Distance_Sphere(point(${user.lon}, ${user.lat}), point(user.lon, user.lat), 6371000)) <= ${distance}
			and lF.name like '${lookingfor}%'
			and i.name like '${interest}%'
			${limit}
			`,
		)
		let users: any[] = []
		for (const elem of results[0]) {
			const profile = await this.getProfileData(elem, user.id)
			users.push(profile)
		}
		return users
	}
}
