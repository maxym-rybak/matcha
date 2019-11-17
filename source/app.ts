import express, { Application, Request, Response, NextFunction } from 'express'
import "./config/env"
import bodyParser from 'body-parser'
import morgan from 'morgan'
import users from './routes/users'
import auth from './routes/auth'

import cookieParser from 'cookie-parser'

const app: Application = express()

app.use(cookieParser());


// Middleware
// if(process.env.NODE_ENV == 'development'){
    app.use(morgan('dev'))
// }
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

// app.use('/public', express.static(__dirname + '/public'));
app.use('/api/user', users);
app.use('/api/auth', auth);

app.listen(5000, () => {
    console.log('Server is running')
})