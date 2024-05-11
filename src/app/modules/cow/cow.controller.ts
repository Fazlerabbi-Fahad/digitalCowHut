import { Request, Response } from 'express'
import catchAsync from '../../../shared/catchAsync'
import { CowService } from './cow.service'
import sendResponse from '../../../shared/sendResponse'
import { ICow } from './cow.interface'
import httpStatus from 'http-status'
import { paginationFields } from '../../../constant/paginations'
import { cowsFilterableFields } from './cow.constant'
import pick from '../../../shared/pick'

const createCow = catchAsync(async (req: Request, res: Response) => {
  const data = req.body
  const result = await CowService.createCow(data)

  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow created successfully',
    data: result,
  })
})

const getCows = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, cowsFilterableFields)
  const paginationOptions = pick(req.query, paginationFields)
  const result = await CowService.getCows(filters, paginationOptions)

  sendResponse<ICow[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow fetched successfully',
    meta: result.meta,
    data: result.data,
  })
})

const getSingleCow = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const result = await CowService.getSingleCow(id)

  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow fetched successfully',
    data: result,
  })
})

const updateCow = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const data = req.body
  const result = await CowService.updateCow(id, data)

  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow updated successfully',
    data: result,
  })
})

const deleteCow = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const result = await CowService.deleteCow(id)

  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow deleted successfully',
    data: result,
  })
})

export const CowController = {
  createCow,
  getCows,
  getSingleCow,
  updateCow,
  deleteCow,
}
