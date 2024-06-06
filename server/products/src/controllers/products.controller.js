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
