import { NextFunction, Request, Response } from 'express'
import { UserService } from './user.service'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { IUser } from './user.interface'
import httpStatus from 'http-status'
import pick from '../../../shared/pick'
import { usersFilterableFields } from './user.constant'
import { paginationFields } from '../../../constant/paginations'

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body
    const result = await UserService.createUser(data)

    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User created successfully!',
      data: result,
    })
    next()
  },
)

const getUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, usersFilterableFields)
  const paginationOptions = pick(req.query, paginationFields)

  const result = await UserService.getUsers(filters, paginationOptions)

  sendResponse<IUser[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User fetched successfully',
    meta: result.meta,
    data: result.data,
  })
})

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const result = await UserService.getUserById(id)

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User fetched successfully',
    data: result,
  })
})

const updateUserById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const data = req.body
  const result = await UserService.updateUserById(id, data)

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully',
    data: result,
  })
})

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const result = await UserService.deleteUser(id)

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully',
    data: result,
  })
})

export const UserController = {
  createUser,
  getUsers,
  getUserById,
  updateUserById,
  deleteUser,
}
