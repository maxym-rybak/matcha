const express = require('express')
// const path = require('path')
const logger = require('morgan')
// const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

class Server {
  constructor ({ port, host, controllers, middlewares, errorMiddleware }) {

    __logger.info('Server start initialization...')
    return start({ port, host, controllers, middlewares, errorMiddleware })
  }
}

function start ({ port, host, controllers, middlewares, errorMiddleware }) {
  return new Promise(async (resolve, reject) => {
    const app = express()

    if (process.env.NODE_ENV !== 'production') app.use(logger('dev'))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))
    // app.use(cookieParser())

    /**
     * middlewares initialization
     */
    // for (const middleware of middlewares) {
    //   try {
    //     await middleware.init()
    //     app.use(middleware.handler())
    //   } catch (e) {
    //     return reject(e)
    //   }
    // }

    /**
     * controllers initialization
     */
    // for (const item of controllers) {
    //   try {
    //     await item.init()
    //     app.use(item.router)
    //   } catch (e) {
    //     return reject(e)
    //   }
    // }

    /**
     * error handler
     */
    // try {
    //   await errorMiddleware.init()
    //   app.use(errorMiddleware.handler())
    // } catch (e) {
    //   return reject(`Default error middleware failed. ${e}`)
    // }

    /**
     * Not found route handler
     */
    app.use((req, res) => {
      res.status(404).json({ message: 'Route not found' })
    })

    process.on('unhandledRejection', (reason, promise) => {
      __logger.error('unhandledRejection', reason)
    })

    process.on('rejectionHandled', promise => {
      __logger.warn('rejectionHandled', promise)
    })

    process.on('multipleResolves', (type, promise, reason) => {
      __logger.error('multipleResolves', { type, promise, reason })
    })

    process.on('uncaughtException', error => {
      __logger.fatal('uncaughtException', error.stack)
      process.exit(1)
    })

    return app.listen(port, host, () => resolve({ port, host }))
  })
}

module.exports = Server
