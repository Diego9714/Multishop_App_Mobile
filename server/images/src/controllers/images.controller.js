import { Images } from '../models/image.model.js'

export const controller = {}

controller.getImage = async (req, res) => {
  try {
    const { parsedDbCredentials, cod_signature } = req.body

    const dbConfig = {
      host: parsedDbCredentials.host,
      user: parsedDbCredentials.username,
      password: parsedDbCredentials.password,
      database: parsedDbCredentials.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    }

    // Llamar al método rebuild para generar y devolver la imagen
    await Images.rebuild(cod_signature, dbConfig, res)

  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
