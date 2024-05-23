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
