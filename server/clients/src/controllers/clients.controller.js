import { Clients } from '../models/client.model.js'

export const controller = {}

controller.getClients = async (req, res) => {
  try {
    const { cod_ven } = req.params
    const { parsedDbCredentials } = req.body

    // const dbConfig = {
    //   host: 'localhost',
    //   user: 'root',
    //   password: '',
    //   database: 'multishop1',
    //   waitForConnections: true,
    //   connectionLimit: 10,
    //   queueLimit: 0,
    // };

    const dbConfig = {
      host: parsedDbCredentials.host,
      user: parsedDbCredentials.username,
      password: parsedDbCredentials.password,
      database: parsedDbCredentials.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };

    const clients = await Clients.all(cod_ven, dbConfig)
    res.status(clients.code).json(clients)

  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
