import {Router} from 'express'
const router = Router()

// Environment
import { REGISTER_ORDER } from '../global/_var.js'

// Controller
import {controller} from '../controllers/order.controller.js'

// Routes
router.post(REGISTER_ORDER, controller.saveOrder)

export default router