import { Users } from '../models/user.model.js'

export const controller = {}

controller.login = async (req, res) => {
  try {
    const { username, password, parsedDbCredentials } = req.body
    
    const filterKeys = Object.keys(req.body)
  
    if (filterKeys.length < 2 || !username || !password) {
      
      return res.status(400).json({ error: "Todos los campos deben tener información" })

    }else{
      const dbConfig = {
        host: parsedDbCredentials.host,
        user: parsedDbCredentials.username,
        password: parsedDbCredentials.password,
        database: parsedDbCredentials.database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      };

      // const dbConfig = {
      //   host: "localhost",
      //   user: "root",
      //   password: '',
      //   database: "multishop1",
      //   waitForConnections: true,
      //   connectionLimit: 10,
      //   queueLimit: 0,
      // };

      const user = await Users.search(username , password, dbConfig)
      console.log(user)

      if(user.code == 200){
        res.cookie('token', user.tokenUser)
        res.json(user)
      }else{
        return res.status(500).json(user)
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error })
  }
}

controller.logout = async (req, res) => {
  try {    
    res.cookie('token', '' , {
      expires : new Date(0)
    })
    res.sendStatus(200)
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}