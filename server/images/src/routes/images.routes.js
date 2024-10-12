import {Router} from 'express'
const router = Router()

// Environment
import { REBUILD } from '../global/_var.js'

// Controller
import {controller} from '../controllers/images.controller.js'

// Routes
router.get(REBUILD,controller.getImage)

export default router