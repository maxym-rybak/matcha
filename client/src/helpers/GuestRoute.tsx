import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { isUser } from './getJwt'
import PrimaryAppBar from '../components/layout/PrimaryAppBar'

interface Props {
	path: string
	component: React.FC | React.ComponentType
}
const GuestRoute: React.FC<Props> = (props: Props) => {
	return isUser() ? (
		<Redirect to='/profile' />
	) : (
		<div>
			<PrimaryAppBar />
			<Route path={props.path} component={props.component} />
		</div>
	)
}

export default GuestRoute
