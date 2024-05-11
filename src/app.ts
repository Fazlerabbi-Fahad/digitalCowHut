import express, { Application, NextFunction, Request, Response } from 'express'
import cors from 'cors'
import router from './route'
import httpStatus from 'http-status'
import globalErrorHandler from './app/middlewares/globalErrorHandlers'
import ApiError from './errors/ApiError'

const app: Application = express()

app.use(cors())

//parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1', router)

//testing
app.get('/', (req: Request, res: Response, next: NextFunction) => {
  throw new ApiError(400, 'Ore baba')
})

//error handler
app.use(globalErrorHandler)

//handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  })
  next()
})

export default app
