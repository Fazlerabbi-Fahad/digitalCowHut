import { SortOrder } from 'mongoose'
import { paginationHelpers } from '../../../helpers/paginationHelpers'
import { IGenericResponse } from '../../../interfaces/common'
import { IPaginationOptions } from '../../../interfaces/ipagination'
import { IOrder, IOrdersFilters } from './order.interface'
import { Order } from './order.model'
import { ordersSearchableFields } from './order.constant'

const createOrder = async (payload: IOrder): Promise<IOrder> => {
  const result = (await (await Order.create(payload)).populate('cow')).populate(
    'buyer',
  )
  return result
}

const getOrders = async (
  filters: IOrdersFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IOrder[]>> => {
  const { searchTerm, ...filtersData } = filters
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions)

  const andConditions = []

  if (searchTerm) {
    andConditions.push({
      $or: ordersSearchableFields.map(field => ({
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

  const result = await Order.find(whereConditions)
    .populate('cow')
    .populate('buyer')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)

  const total = await Order.countDocuments()

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  }
}

export const OrderService = {
  createOrder,
  getOrders,
}
