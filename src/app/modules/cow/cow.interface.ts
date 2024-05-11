import { Model, Types } from 'mongoose'
import { IUser } from '../user/user.interface'

export type location =
  | 'Dhaka'
  | 'Chattogram'
  | 'Barishal'
  | 'Rajshahi'
  | 'Sylhet'
  | 'Comilla'
  | 'Rangpur'
  | 'Mymensingh'

export type breed =
  | 'Brahman'
  | 'Nellore'
  | 'Sahiwal'
  | 'Gir'
  | 'Indigenous'
  | 'Tharparkar'
  | 'Kankrej'

export type category = 'Dairy' | 'Beef' | 'DualPurpose'

export type label = 'for sale' | 'sold out'

export type ICow = {
  name: string
  age: number
  price: number
  location: location
  breed: breed
  weight: number
  label: label
  category: category
  seller: Types.ObjectId | IUser
}

export type CowModel = Model<ICow, Record<string, unknown>>

export type ICowsFilters = {
  searchTerm?: string
  name?: string
  age?: number
  location?: string
  price?: number
  breed?: string
  weight?: number
  label?: string
  category?: string
}
