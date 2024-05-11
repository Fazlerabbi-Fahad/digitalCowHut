import { SortOrder } from 'mongoose'
import { paginationHelpers } from '../../../helpers/paginationHelpers'
import { IGenericResponse } from '../../../interfaces/common'
import { IPaginationOptions } from '../../../interfaces/ipagination'
import { usersSearchableFields } from './user.constant'
import { IUser, IUserFilters } from './user.interface'
import { User } from './user.model'

const createUser = async (payload: IUser): Promise<IUser> => {
  const result = await User.create(payload)
  return result
}

const getUsers = async (
  filters: IUserFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IUser[]>> => {
  //extract searchTerm to implement search query
  const { searchTerm, ...filtersData } = filters
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions)

  const andConditions = []

  //search needs $or for searching in specified fields
  if (searchTerm) {
    andConditions.push({
      $or: usersSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    })
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    })
  }

  //Dynamic sort needs field to do sorting
  const sortConditions: { [key: string]: SortOrder } = {}

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {}

  const result = await User.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)

  const total = await User.countDocuments()

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  }
}

const getUserById = async (id: string): Promise<IUser | null> => {
  const result = await User.findById({ _id: id })
  return result
}

const updateUserById = async (
  id: string,
  payload: Partial<IUser>,
): Promise<IUser | null> => {
  const result = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  })
  return result
}

const deleteUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findByIdAndDelete({ _id: id })
  return result
}

export const UserService = {
  createUser,
  getUsers,
  getUserById,
  updateUserById,
  deleteUser,
}
