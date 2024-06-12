import { pool }   from '../connection/mysql.connect.js'

export class Orders {
  static async saveOrder(order) {
    try {
      let orderCompleted = []
      let orderNotCompleted = []
  
      for (const info of order) {
        const { id_scli, cod_cli, cod_ven, totalUsd, totalBs, tip_doc, fecha, products } = info
  
        const connection = await pool.getConnection()
  
        const existingOrder = `SELECT id_order FROM preorder WHERE cod_cli = ? AND cod_ven = ? AND amountUsd = ? AND amountBs = ? AND tip_doc = ?;`
        const [checkOrder] = await connection.execute(existingOrder, [cod_cli, cod_ven, totalUsd.toFixed(2), totalBs.toFixed(2), tip_doc])
  
        if (checkOrder.length > 0) {
          orderNotCompleted.push(info)
        } else {
          let sql = 'INSERT INTO preorder (id_scli, cod_cli, cod_ven, amountUsd, amountBs, tip_doc, date_created) VALUES (?, ?, ?, ?, ?, ?, ?);'
          let [order] = await connection.execute(sql, [id_scli, cod_cli, cod_ven, totalUsd, totalBs, tip_doc, fecha])
  
          const id_order = order.insertId
  
          for (const prod of products) {
            const { codigo, cantidad, descrip, existencia, precioBs, precioUsd } = prod
  
            const saveProd = `INSERT INTO prodorder (id_order, codigo, descrip, quantity, priceUsd, priceBs, date_created) VALUES (?, ?, ?, ?, ?, ?, ?)`
            await connection.execute(saveProd, [id_order, codigo, descrip, cantidad, precioUsd, precioBs, fecha])
          }
  
          orderCompleted.push(info)
        }
  
        connection.release();
      }
  
      return {
        code: 200,
        status: true,
        msg: 'Orders processed',
        completed: orderCompleted,
        notCompleted: orderNotCompleted
      }
    } catch (error) {
      return error
    }
  }

  static async saveVisits(visits) {
    try {
      let visitsCompleted = []
      let visitsNotCompleted = []
  
      for (const info of visits) {
        const { id_scli, cod_cli, nom_cli, cod_ven, fecha } = info
  
        const connection = await pool.getConnection()
  
        const existingVisit = `SELECT id_visit FROM visits WHERE id_scli = ? AND cod_cli = ? AND cod_ven = ? AND date_created = ?;`
        const [checkVisit] = await connection.execute(existingVisit, [id_scli, cod_cli, cod_ven, fecha])

        if (checkVisit.length > 0) {
          visitsNotCompleted.push(info)
        } else {
          let sql = 'INSERT INTO visits (cod_ven, id_scli, cod_cli, nom_cli, date_created) VALUES (?, ?, ?, ?, ?);'
          await connection.execute(sql, [cod_ven, id_scli, cod_cli, nom_cli, fecha])
  
          visitsCompleted.push(info)
        }
  
        connection.release()
      }
  
      return {
        code: 200,
        status: true,
        msg: 'Visits processed',
        completed: visitsCompleted,
        notCompleted: visitsNotCompleted
      }
    } catch (error) {
      return error
    }
  }
}

