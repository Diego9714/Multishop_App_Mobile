import {Router} from 'express'
const router = Router()

// Environment
import { PRODUCTS } from '../global/_var.js'

// Controller
import {controller} from '../controllers/products.controller.js'

// Schemas
import { authRequired } from '../middlewares/validateToken.js'


// Routes
router.get(PRODUCTS , authRequired , controller.getProducts)

export default router