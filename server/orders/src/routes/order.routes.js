import {Router} from 'express'
const router = Router()

// Environment
import { REGISTER_ORDER , REGISTER_VISIT } from '../global/_var.js'

// Controller
import {controller} from '../controllers/order.controller.js'

// Routes
router.post(REGISTER_ORDER, controller.saveOrder)
router.post(REGISTER_VISIT, controller.saveVisit)

export default router