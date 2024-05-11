import express from 'express'
import { UserRouter } from '../app/modules/user/user.route'
import { CowRouter } from '../app/modules/cow/cow.route'
import { AuthRouter } from '../app/modules/auth/auth.route'
import { OrderRouter } from '../app/modules/orders/order.route'
const router = express.Router()

const modulesRouter = [
  {
    path: '/users',
    route: UserRouter,
  },
  {
    path: '/cows',
    route: CowRouter,
  },
  {
    path: '/orders',
    route: OrderRouter,
  },
  {
    path: '/auth',
    route: AuthRouter,
  },
]

modulesRouter.forEach(route => router.use(route.path, route.route))

export default router
