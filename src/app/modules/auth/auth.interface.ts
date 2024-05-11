import { IUser } from '../user/user.interface'

export type ILoginUser = {
  phoneNumber: string
  password: string
}

export type ILoginUserResponse = {
  accessToken: string
  refreshToken?: string
}

export type ISignUpUserResponse = {
  accessToken: string
  refreshToken?: string
  user?: IUser
}
export type IRefreshTokenResponse = {
  accessToken: string
}

export type IChangePassword = {
  oldPassword: string
  newPassword: string
}
