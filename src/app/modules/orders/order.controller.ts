import { Request, Response } from 'express'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import httpStatus from 'http-status'
import { paginationFields } from '../../../constant/paginations'
import pick from '../../../shared/pick'
import { IOrder } from './order.interface'
import { OrderService } from './order.service'
import { ordersFilterableFields } from './order.constant'

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const data = req.body
  const result = await OrderService.createOrder(data)

  sendResponse<IOrder>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order created successfully',
    data: result,
  })
})

const getOrders = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ordersFilterableFields)
  const paginationOptions = pick(req.query, paginationFields)
  const result = await OrderService.getOrders(filters, paginationOptions)

  sendResponse<IOrder[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order fetched successfully',
    meta: result.meta,
    data: result.data,
  })
})

export const OrderController = {
  createOrder,
  getOrders,
}
