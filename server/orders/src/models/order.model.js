import { pool }   from '../connection/mysql.connect.js'

export class Orders {
  static async saveOrder(order) {
    let orderCompleted = [];
    let orderNotCompleted = [];
    let orderExist = [];
  
    for (const info of order) {
      const { id_order, id_scli, cod_cli, cod_ven, totalUsd, totalBs, tipfac, fecha, products } = info;
  
      const connection = await pool.getConnection();
  
      try {
        await connection.beginTransaction();
  
        // Convertir la fecha a un objeto Date
        const dateObj = new Date(fecha);
        const day = dateObj.getDate().toString().padStart(2, '0');
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Sumar 1 al mes, ya que en JavaScript los meses van de 0 a 11
        const year = dateObj.getFullYear();
        const formattedFecha = `${day}-${month}-${year}`;
  
        const existingOrder = `SELECT id_order FROM preorder WHERE identifier = ?;`
        const [checkOrder] = await connection.execute(existingOrder, [id_order]);
 
        console.log(checkOrder)

        if (checkOrder.length > 0) {
          orderExist.push(info);
        } else {
          let sql = 'INSERT INTO preorder (identifier, id_scli, cod_cli, cod_ven, amountUsd, amountBs, tip_doc, date_created) VALUES (?, ?, ?, ?, ?, ?, ?, ?);'
          let [orderResult] = await connection.execute(sql, [id_order, id_scli, cod_cli, cod_ven, totalUsd, totalBs, tipfac, formattedFecha]);
  
          const id_orderr = orderResult.insertId;
  
          for (const prod of products) {
            const { codigo, quantity, descrip, existencia, priceUsd, priceBs } = prod;
  
            console.log(id_orderr, codigo, descrip, quantity, priceUsd, priceBs, formattedFecha)

            const saveProd = `INSERT INTO prodorder (id_order, codigo, descrip, quantity, priceUsd, priceBs, date_created) VALUES (?, ?, ?, ?, ?, ?, ?);`
            await connection.execute(saveProd, [id_orderr, codigo, descrip, quantity, priceUsd, priceBs, formattedFecha]);
          }
  
          await connection.commit();
          orderCompleted.push(info);
        }
      } catch (error) {
        await connection.rollback();
        orderNotCompleted.push(info);
        console.error(`Failed to process order with id: ${id_order}`, error);
      } finally {
        connection.release();
      }
    }
  
    return {
      code: 200,
      status: true,
      msg: 'Orders processed',
      completed: orderCompleted,
      notCompleted: orderNotCompleted,
      exist: orderExist
    };
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

