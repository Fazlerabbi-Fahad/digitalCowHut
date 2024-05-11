import { User } from '../user/user.model'
import ApiError from '../../../errors/ApiError'
import httpStatus from 'http-status'
import { jwtHelpers } from '../../../helpers/jwtHelpers'
import {
  IChangePassword,
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
  ISignUpUserResponse,
} from './auth.interface'
import config from '../../../config'
import { JwtPayload, Secret } from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { IUser } from '../user/user.interface'

const signUpUser = async (payload: IUser): Promise<ISignUpUserResponse> => {
  const { phoneNumber } = payload
  const existingUser = await User.findOne({ phoneNumber })

  if (existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already exists')
  }
  const result = await User.create(payload)

  try {
    const accessToken = jwtHelpers.createToken(
      { userNumber: result.phoneNumber, role: result.role },
      config.jwt.secret as Secret,
      config.jwt.expiresIn as string,
    )

    const refreshToken = jwtHelpers.createToken(
      { userNumber: result.phoneNumber, role: result.role },
      config.jwt.refreshSecret as Secret,
      config.jwt.refreshExpiresIn as string,
    )

    return {
      accessToken,
      refreshToken,
      user: result,
    }
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Could not create user',
    )
  }
}

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { phoneNumber } = payload

  const isUserExist = await User.findOne({ phoneNumber })

  //check user exist
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
  }

  //create jwt
  const { phoneNumber: userId, role } = isUserExist
  const accessToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.secret as Secret,
    config.jwt.expiresIn as string,
  )

  const refreshToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.refreshSecret as Secret,
    config.jwt.refreshExpiresIn as string,
  )

  return { accessToken, refreshToken }
}

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  let verifiedToken = null
  try {
    verifiedToken = jwtHelpers.verifiedToken(
      token,
      config.jwt.refreshExpiresIn as Secret,
    )
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid refresh token')
  }

  const { phoneNumber } = verifiedToken

  const isUserExist = await User.findOne({ phoneNumber })

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
  }

  const newAccessToken = jwtHelpers.createToken(
    {
      phoneNumber: isUserExist.phoneNumber,
      role: isUserExist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expiresIn as string,
  )

  return {
    accessToken: newAccessToken,
  }
}

const changePassword = async (
  user: JwtPayload | null,
  payload: IChangePassword,
): Promise<void> => {
  const { newPassword } = payload

  const newHashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds),
  )

  const query = { phoneNumber: user?.phoneNumber }
  const updatedData = {
    password: newHashedPassword,
    passwordChangedAt: new Date(),
  }

  await User.findOneAndUpdate(query, updatedData)
}

export const AuthService = {
  signUpUser,
  loginUser,
  refreshToken,
  changePassword,
}
