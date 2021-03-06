import express, { Application, Request, Response, NextFunction } from 'express'
import './config/env'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import users from './routes/user'
import auth from './routes/auth'
import image from './routes/image'
import heart from './routes/heart'
import search from './routes/search'
import chat from './routes/chat'
import message from './routes/message'
import ResManager from './util/ResManager'
import cookieParser from 'cookie-parser'

const app: Application = express()

app.use(cookieParser())

// Middleware
// if(process.env.NODE_ENV == 'development'){
app.use(morgan('dev'))
// }
// app.use(function(req: Request, res: Response, next: NextFunction) {
//   if (req.headers.origin) {
//     res.header('Access-Control-Allow-Origin', '*')
//     res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization')
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE')
//     if (req.method === 'OPTIONS') return res.sendStatus(200)
//   }
//   next()
// })

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(function (error: Error, req: Request, res: Response, next: NextFunction) {
	//Catch json error
	res.json(ResManager.error('JSON parsing error'))
})

app.use('/api/public', express.static(__dirname.slice(0, __dirname.length - 4) + 'public'))

import { chatServer } from './util/ChatServer'
chatServer

app.use('/api/message', message)
app.use('/api/chat', chat)
app.use('/api/search', search)
app.use('/api/user', users)
app.use('/api/auth', auth)
app.use('/api/image', image)
app.use('/api/heart', heart)

app.listen(process.env.APP_PORT, () => {
	console.log(`Server is running on port ${process.env.APP_PORT}`)
})
