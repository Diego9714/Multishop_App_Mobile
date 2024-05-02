import {Router} from 'express'
const router = Router()

// Environment
import { LOGIN , LOGOUT } from '../global/_var.js'

// Controller
import {controller} from '../controllers/auth.controller.js'

// Schemas
import { validateSchema } from '../middlewares/validator.middlewares.js'
import { loginSchema } from '../schemas/auth.schema.js'

// Routes
router.post(LOGIN, validateSchema(loginSchema), controller.login)
router.post(LOGOUT, controller.logout)

export default router