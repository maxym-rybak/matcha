import express, { Application, Request, Response, NextFunction } from 'express'
import "./config/env"
import bodyParser from 'body-parser'
import morgan from 'morgan'
import users from './routes/users'

const app: Application = express()

// Middleware
// if(process.env.NODE_ENV == 'development'){
    app.use(morgan('dev'))
// }
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.send("Hello world")
})

app.use('/api/users', users);

app.listen(5000, () => {
    console.log('Server is running')
})