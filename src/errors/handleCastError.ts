import { IGenericErrorMessage } from '../interfaces/error'
import { CastError } from 'mongoose'

const handleCastError = (error: CastError) => {
  const errors: IGenericErrorMessage[] = [
    {
      path: error?.path,
      message: 'Invalid Id',
    },
  ]

  const statusCode = 400

  return {
    statusCode,
    message: 'Validation Error',
    errorMessages: errors,
  }
}

export default handleCastError
