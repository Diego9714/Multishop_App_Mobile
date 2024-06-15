import {Router} from 'express'
const router = Router()

// Environment
import { PRODUCTS , CATEGORY , BRANDS , IVA} from '../global/_var.js'

// Controller
import {controller} from '../controllers/products.controller.js'

// Schemas
import { authRequired } from '../middlewares/validateToken.js'

// Routes
router.get(PRODUCTS , controller.getProducts)
router.get(CATEGORY , controller.getCategory)
router.get(BRANDS , controller.getBrands)
// router.get(IVA , controller.getIva)


export default router