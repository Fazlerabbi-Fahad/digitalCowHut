import { SortOrder } from 'mongoose'
import { paginationHelpers } from '../../../helpers/paginationHelpers'
import { IGenericResponse } from '../../../interfaces/common'
import { IPaginationOptions } from '../../../interfaces/ipagination'
import { ICow, ICowsFilters } from './cow.interface'
import { Cow } from './cow.model'
import { cowSearchableFields } from './cow.constant'

const createCow = async (payload: ICow): Promise<ICow> => {
  const result = (await Cow.create(payload)).populate('seller')
  return result
}

const getCows = async (
  filters: ICowsFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<ICow[]>> => {
  const { searchTerm, ...filtersData } = filters
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions)

  const andConditions = []

  if (searchTerm) {
    andConditions.push({
      $or: cowSearchableFields.map(field => ({
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

  const sortConditions: { [key: string]: SortOrder } = {}

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {}

  const result = await Cow.find(whereConditions)
    .populate('seller')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)

  const total = await Cow.countDocuments()

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  }
}

const getSingleCow = async (id: string): Promise<ICow | null> => {
  const result = await Cow.findById({ _id: id }).populate('seller')
  return result
}

const updateCow = async (
  id: string,
  payload: Partial<ICow>,
): Promise<ICow | null> => {
  const result = await Cow.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  }).populate('seller')
  return result
}

const deleteCow = async (id: string): Promise<ICow | null> => {
  const result = await Cow.findOneAndDelete({ _id: id }).populate('seller')
  return result
}

export const CowService = {
  createCow,
  getCows,
  getSingleCow,
  updateCow,
  deleteCow,
}
