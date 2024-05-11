import { Model } from 'mongoose'

export type role = 'seller' | 'buyer'

export type IUser = {
  phoneNumber: string
  role: role
  password: string
  name: {
    firstName: string
    lastName: string
  }
  address: string
  budget: number
  income: number
}

export type IUserMethods = {
  isUserExist(id: string): Promise<Partial<IUser> | null>
}

export type UserModel = Model<IUser, Record<string, unknown>, IUserMethods>

export type IUserFilters = {
  searchTerm?: string
  firstName?: string
  lastName?: string
  address?: string
  phone?: string
  role?: string
  budget?: number
  income?: number
}
