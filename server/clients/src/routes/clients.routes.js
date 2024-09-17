import {Router} from 'express'
const router = Router()

// Environment
import { CLIENTS } from '../global/_var.js'

// Controller
import {controller} from '../controllers/clients.controller.js'

// Routes
router.post(CLIENTS,controller.getClients)

export default router