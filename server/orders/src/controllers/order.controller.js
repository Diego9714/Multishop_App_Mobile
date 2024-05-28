import { Orders } from '../models/order.model.js'

export const controller = {}

controller.saveOrder = async (req, res) => {
  try {
    let msg = {
      status: false,
      msg: "Unsuccessful synchronization",
      code: 500
    }

    const { order } = req.body

    const filterOrder = Object.keys(order)

    const ordersCompleted = []
    const ordersNotCompleted = []

    if(filterOrder.length > 0){
      const user = await Orders.verify({order})
      
      if(user.code == 200){
        
      }

    }else{

    }

    const processOrder = {completed: ordersCompleted, notCompleted: ordersNotCompleted}

    msg = {
      status: true,
      msg: "Successful synchronization",
      code: 200,
      processOrder
    }

  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
