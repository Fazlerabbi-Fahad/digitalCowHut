import catchAsync from '../../../shared/catchAsync'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { AuthService } from './auth.service'
import config from '../../../config'
import sendResponse from '../../../shared/sendResponse'
import httpStatus from 'http-status'
import {
  ILoginUserResponse,
  IRefreshTokenResponse,
  ISignUpUserResponse,
} from './auth.interface'

const signUpUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body
    const result = await AuthService.signUpUser(data)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { refreshToken, ...others } = result

    const cookieOptions = {
      secure: config.env === 'production',
      httpOnly: true,
    }

    res.cookie('refreshToken', refreshToken, cookieOptions)

    if ('refreshToken' in result) {
      delete result.refreshToken
    }

    sendResponse<ISignUpUserResponse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User created successfully!',
      data: result,
    })
    next()
  },
)

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body
  const result = await AuthService.loginUser(loginData)
  const { refreshToken, ...others } = result

  //Set refresh token into cookie

  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  }
  res.cookie('refreshToken', refreshToken, cookieOptions)

  // delete result.refreshToken

  if ('refreshToken' in result) {
    delete result.refreshToken
  }

  sendResponse<ILoginUserResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully!',
    data: others,
  })
})

const refreshToken: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies

    const result = await AuthService.refreshToken(refreshToken)

    const cookieOptions = {
      secure: config.env === 'production',
      httpOnly: true,
    }
    res.cookie('refreshToken', refreshToken, cookieOptions)

    if ('refreshToken' in result) {
      delete result.refreshToken
    }

    sendResponse<IRefreshTokenResponse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Refresh token set in Successfully',
      data: result,
    })
  },
)

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const user = req.user
  const { ...passwordData } = req.body

  await AuthService.changePassword(user, passwordData)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Password changed successfully !',
  })
})

export const AuthController = {
  signUpUser,
  loginUser,
  refreshToken,
  changePassword,
}
