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

    if (!order || order.length === 0) {
      return res.status(400).json({
        status: false,
        msg: "No orders provided",
        code: 400
      })
    }

    const result = await Orders.saveOrder(order)

    const processOrder = {
      completed: result.completed,
      notCompleted: result.notCompleted
    }

    msg = {
      status: true,
      msg: "Successful synchronization",
      code: 200,
      processOrder
    }

    return res.status(200).json(msg)
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

controller.saveVisit = async (req, res) => {
  try {
    let msg = {
      status: false,
      msg: "Unsuccessful synchronization",
      code: 500
    }

    const { visits } = req.body

    if (!visits || visits.length === 0) {
      return res.status(400).json({
        status: false,
        msg: "No visits provided",
        code: 400
      })
    }

    const result = await Orders.saveVisits(visits)
    console.log(result)

    const processVisits = {
      completed: result.completed,
      notCompleted: result.notCompleted
    }

    msg = {
      status: true,
      msg: "Successful synchronization",
      code: 200,
      processVisits
    }

    return res.status(200).json(msg)
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

