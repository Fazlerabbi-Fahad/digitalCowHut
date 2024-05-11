import express from 'express'
import { CowController } from './cow.controller'
import validateRequest from '../../middlewares/validateRequest'
import { CowValidation } from './cow.validation'
import auth from '../../middlewares/auth'
import { ENUM_USER_ROLE } from '../../../enums/user'

const router = express.Router()

router.post(
  '/',
  validateRequest(CowValidation.createCow),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER),
  CowController.createCow,
)
router.patch(
  '/:id',
  validateRequest(CowValidation.updateCow),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER),
  CowController.updateCow,
)
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER),
  CowController.deleteCow,
)
router.get('/:id', CowController.getSingleCow)
router.get('/', CowController.getCows)

export const CowRouter = router
