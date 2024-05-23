import { Orders } from '../models/order.model.js'

export const controller = {}

controller.saveOrder = async (req, res) => {
  try {
    const { username, password } = req.body

    const filterKeys = Object.keys(req.body)
  
    if (filterKeys.length < 2 || !username || !password) {
      
      return res.status(400).json({ error: "Todos los campos deben tener información" })

    }else{
      const user = await Orders.search(username , password)
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
