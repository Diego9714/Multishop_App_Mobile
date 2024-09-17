import {Router} from 'express'
const router = Router()
// Environment
import { PRODUCTS , CATEGORY , BRANDS , CURRENCY, COMPANY, ORDERS , PAYMENTS , VISITS } from '../global/_var.js'
// Controller
import {controller} from '../controllers/products.controller.js'

// Routes
router.post(PRODUCTS , controller.getProducts)
router.post(CATEGORY , controller.getCategory)
router.post(BRANDS   , controller.getBrands)
router.post(CURRENCY , controller.getCurrency)
router.post(COMPANY  , controller.getCompany)
router.post(ORDERS   , controller.getOrders)
router.post(PAYMENTS , controller.getPayments)
router.post(VISITS   , controller.getVisits)


export default router