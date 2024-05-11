import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import auth from '../../middlewares/auth'
import { ENUM_USER_ROLE } from '../../../enums/user'
import { OrderValidation } from './order.validation'
import { OrderController } from './order.controller'

const router = express.Router()

router.post(
  '/',
  validateRequest(OrderValidation.createOrder),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER),
  OrderController.createOrder,
)
router.get('/', OrderController.getOrders)

export const OrderRouter = router
