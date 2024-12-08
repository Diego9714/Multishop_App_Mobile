import { Products } from '../models/product.model.js'

export const controller = {}

controller.getProducts = async (req, res) => {
  try {
    const { parsedDbCredentials } = req.body

    const dbConfig = {
      host: parsedDbCredentials.host,
      user: parsedDbCredentials.username,
      password: parsedDbCredentials.password,
      database: parsedDbCredentials.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };

    const products = await Products.all(dbConfig)
    res.status(products.code).json(products)

  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

controller.getCategory = async (req, res) => {
  try {
    const { parsedDbCredentials } = req.body

    const dbConfig = {
      host: parsedDbCredentials.host,
      user: parsedDbCredentials.username,
      password: parsedDbCredentials.password,
      database: parsedDbCredentials.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    }

    const categories = await Products.categories(dbConfig)
    res.status(categories.code).json(categories)

  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

controller.getBrands = async (req, res) => {
  try {
    const { parsedDbCredentials } = req.body

    const dbConfig = {
      host: parsedDbCredentials.host,
      user: parsedDbCredentials.username,
      password: parsedDbCredentials.password,
      database: parsedDbCredentials.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    }

    const brands = await Products.brands(dbConfig)
    res.status(brands.code).json(brands)

  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

controller.getCurrency = async (req, res) => {
  try {
    const { parsedDbCredentials } = req.body

    const dbConfig = {
      host: parsedDbCredentials.host,
      user: parsedDbCredentials.username,
      password: parsedDbCredentials.password,
      database: parsedDbCredentials.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    }

    const currency = await Products.currency(dbConfig)
    res.status(currency.code).json(currency)

  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

controller.getCompany = async (req, res) => {
  try {
    const { parsedDbCredentials } = req.body

    const dbConfig = {
      host: parsedDbCredentials.host,
      user: parsedDbCredentials.username,
      password: parsedDbCredentials.password,
      database: parsedDbCredentials.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    }

    const company = await Products.company(dbConfig)

    console.log(company)

    res.status(company.code).json(company)

  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

controller.getOrders = async (req, res) => {
  try {
    const { cod_ven } = req.params
    const { parsedDbCredentials } = req.body

    const dbConfig = {
      host: parsedDbCredentials.host,
      user: parsedDbCredentials.username,
      password: parsedDbCredentials.password,
      database: parsedDbCredentials.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    }

    if (!cod_ven || cod_ven.length === 0) {
      return res.status(400).json({
        status: false,
        msg: "No seller provided",
        code: 400
      })
    }

    const orders = await Products.orders(cod_ven, dbConfig)

    res.status(orders.code).json(orders)

  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

controller.getPayments = async (req, res) => {
  try {
    const { cod_ven } = req.params
    const { parsedDbCredentials } = req.body

    const dbConfig = {
      host: parsedDbCredentials.host,
      user: parsedDbCredentials.username,
      password: parsedDbCredentials.password,
      database: parsedDbCredentials.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    }

    console.log(cod_ven, parsedDbCredentials.password)

    if (!cod_ven || cod_ven.length === 0) {
      return res.status(400).json({
        status: false,
        msg: "No seller provided",
        code: 400
      })
    }

    const payments = await Products.payments(cod_ven, dbConfig)

    res.status(payments.code).json(payments)

  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
controller.getVisits = async (req, res) => {
  try {
    const { cod_ven } = req.params
    const { parsedDbCredentials } = req.body

    const dbConfig = {
      host: parsedDbCredentials.host,
      user: parsedDbCredentials.username,
      password: parsedDbCredentials.password,
      database: parsedDbCredentials.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    }

    if (!cod_ven || cod_ven.length === 0) {
      return res.status(400).json({
        status: false,
        msg: "No seller provided",
        code: 400
      })
    }

    const visits = await Products.visits(cod_ven, dbConfig)
    res.status(visits.code).json(visits)

  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}