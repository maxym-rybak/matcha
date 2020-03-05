import React from 'react'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import ButtonBase from '@material-ui/core/ButtonBase'
import Typography from '@material-ui/core/Typography'
import { Box, Container } from '@material-ui/core'

import styles from '../../styles'

import image from './av1.jpg'
import image1 from './av2.jpg'
import image2 from './av3.jpg'

// const useStyles = makeStyles(createStyles(styles))

const images = [
	{
		url: image,
		title: 'User',
		width: '33.3%',
	},
	{
		url: image1,
		title: 'User',
		width: '33.3%',
	},
	{
		url: image2,
		title: 'User',
		width: '33.3%',
	},
	{
		url: image2,
		title: 'User',
		width: '33.3%',
	},
	{
		url: image2,
		title: 'User',
		width: '33.3%',
	},
]

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			display: 'flex',
			flexWrap: 'wrap',
			width: '100%',
		},
		image: {
			position: 'relative',
			height: 200,
			border: '4px double #946556',
			[theme.breakpoints.down('xs')]: {
				width: '100% !important', // Overrides inline-style
				height: 100,
			},
			'&:hover, &$focusVisible': {
				zIndex: 1,
				'& $imageBackdrop': {
					opacity: 0.15,
				},
				'& $imageMarked': {
					opacity: 0,
				},
			},
		},
		focusVisible: {},
		imageButton: {
			position: 'absolute',
			// left: 0,
			right: 0,
			top: 0,
			bottom: 0,
			display: 'flex',
			// alignItems: 'center',
			// justifyContent: 'center',
			color: theme.palette.common.white,
		},
		imageSrc: {
			position: 'absolute',
			left: 0,
			right: 0,
			top: 0,
			bottom: 0,
			backgroundSize: 'cover',
			backgroundPosition: 'center 40%',
		},
		imageBackdrop: {
			position: 'absolute',
			left: 0,
			right: 0,
			top: 0,
			bottom: 0,
			backgroundColor: theme.palette.common.black,
			opacity: 0.4,
			transition: theme.transitions.create('opacity'),
		},
		imageTitle: {
			position: 'relative',
			padding: `${theme.spacing(2)}px ${theme.spacing(4)}px ${theme.spacing(1) + 6}px`,
		},
		// imageMarked: {
		// 	height: 3,
		// 	width: 18,
		// 	backgroundColor: theme.palette.common.white,
		// 	position: 'absolute',
		// 	bottom: -2,
		// 	left: 'calc(50% - 9px)',
		// 	transition: theme.transitions.create('opacity'),
		// },
	}),
)

const Search: React.FC = () => {
	const classes = useStyles()

	return (
		<Container>
			<Box className={classes.root}>
				{images.map((image, idx) => (
					<ButtonBase
						focusRipple
						key={idx}
						className={classes.image}
						focusVisibleClassName={classes.focusVisible}
						style={{
							width: image.width,
						}}>
						<span
							className={classes.imageSrc}
							style={{
								backgroundImage: `url(${image.url})`,
							}}
						/>
						<span className={classes.imageBackdrop} />
						<span className={classes.imageButton}>
							<Typography
								component='span'
								variant='subtitle1'
								color='inherit'
								className={classes.imageTitle}>
								{image.title}
								{/* <span className={classes.imageMarked} /> */}
							</Typography>
						</span>
					</ButtonBase>
				))}
			</Box>
		</Container>
	)
}

export default Search
