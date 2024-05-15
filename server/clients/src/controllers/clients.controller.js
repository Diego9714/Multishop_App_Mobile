import { Clients } from '../models/client.model.js'

export const controller = {}

controller.getClients = async (req, res) => {
  try {
    const { cod_ven } = req.user
    
    const clients = await Clients.all(cod_ven)
    res.status(clients.code).json(clients)

  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
