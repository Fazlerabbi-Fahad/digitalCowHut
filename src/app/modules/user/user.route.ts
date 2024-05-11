import express from 'express'
import { UserController } from './user.controller'
import validateRequest from '../../middlewares/validateRequest'
import { UserValidation } from './user.validation'
import auth from '../../middlewares/auth'
import { ENUM_USER_ROLE } from '../../../enums/user'

const router = express.Router()

router.post(
  '/',
  validateRequest(UserValidation.createUser),
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  UserController.createUser,
)

router.get('/:id', UserController.getUserById)
router.patch(
  '/:id',
  validateRequest(UserValidation.updateUser),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER),
  UserController.updateUserById,
)
router.get('/', UserController.getUsers)

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER),
  UserController.deleteUser,
)
export const UserRouter = router
