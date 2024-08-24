import { Products } from '../models/product.model.js'

export const controller = {}

controller.getProducts = async (req, res) => {
  try {
    const products = await Products.all()
    res.status(products.code).json(products)

  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

controller.getCategory = async (req, res) => {
  try {
    const categories = await Products.categories()
    res.status(categories.code).json(categories)

  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

controller.getBrands = async (req, res) => {
  try {
    const brands = await Products.brands()
    res.status(brands.code).json(brands)

  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

controller.getCurrency = async (req, res) => {
  try {
    const currency = await Products.currency()
    res.status(currency.code).json(currency)

  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

controller.getCompany = async (req, res) => {
  try {
    const company = await Products.company()
    res.status(company.code).json(company)

  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

controller.getOrders = async (req, res) => {
  try {
    const { cod_ven } = req.params

    if (!cod_ven || cod_ven.length === 0) {
      return res.status(400).json({
        status: false,
        msg: "No seller provided",
        code: 400
      })
    }

    const orders = await Products.orders(cod_ven)

    res.status(orders.code).json(orders)

  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

controller.getPayments = async (req, res) => {
  try {
    const { cod_ven } = req.params

    if (!cod_ven || cod_ven.length === 0) {
      return res.status(400).json({
        status: false,
        msg: "No seller provided",
        code: 400
      })
    }

    const payments = await Products.payments(cod_ven)

    res.status(payments.code).json(payments)

  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

controller.getVisits = async (req, res) => {
  try {
    const { cod_ven } = req.params

    if (!cod_ven || cod_ven.length === 0) {
      return res.status(400).json({
        status: false,
        msg: "No seller provided",
        code: 400
      })
    }

    const visits = await Products.visits(cod_ven)

    res.status(visits.code).json(visits)

  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}