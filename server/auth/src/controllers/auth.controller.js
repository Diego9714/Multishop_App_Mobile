import { Users } from '../models/user.model.js'

export const controller = {}

controller.login = async (req, res) => {
  try {
    const { username, password } = req.body

    const filterKeys = Object.keys(req.body)
  
    if (filterKeys.length < 2 || !username || !password) {
      
      return res.status(400).json({ error: "Todos los campos deben tener información" })

    }else{
      const user = await Users.search(username , password)
      if(user.code == 200){
        res.cookie('token', user.tokenUser)
        res.json(user)
      }else{
        return res.status(500).json([[user.msg.msg]])
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error.message })
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