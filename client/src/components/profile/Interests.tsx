import React from 'react'
import { Box, TextField, Button, Typography, Dialog, DialogContent, InputAdornment, Chip } from '@material-ui/core'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import profileClasses from './styles'

import { User } from '../../reducers/UserReducer'

interface Props {
	setProfile: ((value: React.SetStateAction<User>) => void) | null
	profile: User
	editable: boolean
}

const Interests: React.FC<Props> = (props: Props) => {
	const { setProfile, profile, editable } = props
	const classes = profileClasses()

	const [interestsDialog, setInterestsDialog] = React.useState<boolean>(false)
	const [newInterest, setNewInterest] = React.useState<string>('')

	const newInterestOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const val = (event.target as HTMLInputElement).value
		setNewInterest(val)
	}

	const interestDialogOpen = () => {
		setInterestsDialog(true)
	}
	const interestDialogClose = () => {
		setInterestsDialog(false)
	}

	const removeInterest = (interest: string) => () => {
		if (setProfile) {
			setProfile({
				...profile,
				interests: profile.interests.filter((chip) => chip !== interest),
			})
		}
	}

	const addInterest = () => {
		if (setProfile) {
			let arr = profile.interests
			arr.push(newInterest)
			setProfile({
				...profile,
				interests: arr,
			})
			setNewInterest('')
			interestDialogClose()
		}
	}

	const runFuncOnEnter = (func: () => void) => (e: React.KeyboardEvent) => {
		if (e.keyCode === 13) {
			func()
		}
	}

	return (
		<Box marginBottom='1em'>
			{editable ? (
				<Box>
					<Typography>{'Interests'}:</Typography>
					{profile.interests.map((data) => {
						return <Chip key={data} label={data} className={classes.chip} onDelete={removeInterest(data)} />
					})}
					<Chip
						icon={<AddCircleOutlineIcon />}
						className={classes.chip}
						label={'New'}
						clickable={true}
						onClick={interestDialogOpen}
					/>
				</Box>
			) : (
				<Box textAlign='left'>
					<Typography>{'Interests'}:</Typography>
					{profile.interests.map((data) => {
						return <Chip key={data} label={data} className={classes.chip} variant='outlined' />
					})}
				</Box>
			)}

			<Dialog onClose={interestDialogClose} aria-labelledby='customized-dialog-title' open={interestsDialog}>
				<DialogContent dividers>
					<TextField
						id='outlined-search'
						label='Search field'
						type='search'
						variant='outlined'
						value={newInterest}
						onChange={newInterestOnChange}
						onKeyDown={runFuncOnEnter(addInterest)}
						fullWidth={true}
						autoFocus
						InputProps={{
							startAdornment: <InputAdornment position='start'>#</InputAdornment>,
						}}
					/>
				</DialogContent>

				<Box textAlign='center' m={1}>
					<Button autoFocus variant='outlined' size='small' onClick={addInterest}>
						Add
					</Button>
				</Box>
			</Dialog>
		</Box>
	)
}

export default Interests
