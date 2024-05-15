import {Router} from 'express'
const router = Router()

// Environment
import { CLIENTS } from '../global/_var.js'

// Controller
import {controller} from '../controllers/clients.controller.js'

// Schemas
import { authRequired } from '../middlewares/validateToken.js'


// Routes
router.get(CLIENTS,controller.getClients)

export default router