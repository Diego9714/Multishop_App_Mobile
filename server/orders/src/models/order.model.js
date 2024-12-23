import mysql                      from "mysql2/promise"
import {parseISO, parse, format } from 'date-fns'

export class Orders {
  static async saveOrder(order, dbConfig) {
    try {
      let ordersCompleted = []
      let ordersNotCompleted = []
  
      const pool = mysql.createPool(dbConfig)
      const connection = await pool.getConnection()
  
      for (const info of order) {
        const { id_order, id_scli, cod_cli, nom_cli, cod_ven, totalUsd, totalBs, tipfac, fecha, products, prodExistence, ubicacion } = info
  
        // Convertir la fecha desde 'DD/MM/YYYY' a un objeto Date
        const dateObj = parse(fecha, 'dd/MM/yyyy', new Date());

        // Formatear la fecha a 'YYYY-MM-DD'
        const formattedFecha = format(dateObj, 'yyyy-MM-dd');

        let ubication_visit = `Latitud: ${ubicacion.lat} - Longitud: ${ubicacion.lon}`

        const existingOrder = `SELECT id_order FROM preorder WHERE cod_order = ? AND id_scli = ? AND cod_ven = ? AND cod_cli = ? AND amountUsd = ? AND date_created = ?;`
        const [checkOrder] = await connection.execute(existingOrder, [id_order ,id_scli, cod_ven, cod_cli, totalUsd, formattedFecha])
  
        if (checkOrder.length > 0) {
          ordersCompleted.push(info)
        } else {

          const existingVisit = `SELECT id_visit FROM visits WHERE id_scli = ? AND cod_cli = ? AND cod_ven = ? AND date_created = ?;`
          const [checkVisit] = await connection.execute(existingVisit, [id_scli, cod_cli, cod_ven, formattedFecha])

          if (checkVisit.length <= 0) {
            // Registramos la visita
            let sqlVisit = 'INSERT INTO visits (cod_visit, cod_ven, id_scli, cod_cli, nom_cli, type_visit, ubication_visit, date_created) VALUES (?, ?, ?, ?, ?, ?, ?, ?);'
            await connection.execute(sqlVisit, [id_order, cod_ven, id_scli, cod_cli, nom_cli, 2, ubication_visit, formattedFecha])
          }

          // Registramos la visita
          let sqlVisit = `UPDATE visits SET type_visit = ?, ubication_visit = ? WHERE id_scli = ? AND cod_cli = ? AND cod_ven = ? AND date_created = ?;`;
          await connection.execute(sqlVisit, [2, ubication_visit, id_scli, cod_cli, cod_ven, formattedFecha]);

          // Registramos el pedido
          let sqlOrder = 'INSERT INTO preorder (cod_order, id_scli, cod_cli, cod_ven, amountUsd, amountBs, tip_doc, date_created) VALUES (?, ?, ?, ?, ?, ?, ?, ?);'
          let [orderResult] = await connection.execute(sqlOrder, [id_order ,id_scli, cod_cli, cod_ven, totalUsd, totalBs, tipfac, formattedFecha])
  
          const id_orderr = orderResult.insertId
  
          let allProductsAvailable = true
  
          if(prodExistence == 0){
            // Verificamos la existencia de los productos
            for (const prod of products) {
              const { codigo, quantity, descrip, priceUsd, priceBs } = prod
    
              // Guardamos el producto en el pedido
              const saveProd = `INSERT INTO prodorder (id_order, cod_order, cod_cli, cod_ven, codigo, descrip, quantity, priceUsd, priceBs, date_created) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
              await connection.execute(saveProd, [id_orderr, id_order, cod_cli, cod_ven, codigo, descrip, quantity, priceUsd, priceBs, formattedFecha])
            }
          }else{
            // Verificamos la existencia de los productos
            for (const prod of products) {
              const { codigo, quantity, descrip, priceUsd, priceBs } = prod
    
              // Buscar el producto y verificar su existencia
              const productQuery = `SELECT existencia FROM sinv WHERE codigo = ?;`
              const [product] = await connection.execute(productQuery, [codigo])

              if (product.length > 0) {
                let currentExistence = product[0].existencia
    
                // Ajusta la existencia a 0 si la cantidad solicitada es mayor que la existencia actual
                if (currentExistence < quantity) {
                  quantity = currentExistence
                  currentExistence = 0
                } else {
                  currentExistence -= quantity
                }
    
                // Guardamos el producto en el pedido
                const saveProd = `INSERT INTO prodorder (id_order, cod_order, cod_cli, cod_ven, codigo, descrip, quantity, priceUsd, priceBs, date_created) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
                await connection.execute(saveProd, [id_orderr, id_order, cod_cli, cod_ven, codigo, descrip, quantity, priceUsd, priceBs, formattedFecha])
    
                // Actualizamos la existencia del producto
                const updateExistence = `UPDATE sinv SET existencia = ? WHERE codigo = ?;`
                await connection.execute(updateExistence, [currentExistence, codigo])
              } else {
                allProductsAvailable = false
                ordersNotCompleted.push(info)
                break
              }
            }
          }
  
          if (allProductsAvailable) {
            ordersCompleted.push(info)
          }
        }
      }
  
      connection.release()
  
      return {
        code: 200,
        status: true,
        msg: 'Orders processed',
        completed: ordersCompleted,
        notCompleted: ordersNotCompleted
      }
    } catch (error) {
      return error
    }
  }
  
  static async saveVisits(visits, dbConfig) {
    try {
      let visitsCompleted = []
      let visitsNotCompleted = []
  
      for (const info of visits) {
        const { id_visit ,id_scli, cod_cli, nom_cli, cod_ven, fecha, ubicacion } = info
  
        // Convertir la fecha desde 'DD/MM/YYYY' a un objeto Date
        const dateObj = parse(fecha, 'dd/MM/yyyy', new Date());

        // Formatear la fecha a 'YYYY-MM-DD'
        const formattedFecha = format(dateObj, 'yyyy-MM-dd');

        let ubication_visit = `Latitud: ${ubicacion.lat} - Longitud: ${ubicacion.lon}`

        const pool = mysql.createPool(dbConfig)
        const connection = await pool.getConnection()
  
        const existingVisit = `SELECT id_visit FROM visits WHERE id_scli = ? AND cod_cli = ? AND cod_ven = ? AND date_created = ?;`
        const [checkVisit] = await connection.execute(existingVisit, [id_scli, cod_cli, cod_ven, formattedFecha])

        if (checkVisit.length > 0) {
          visitsCompleted.push(info)
        } else {
          let sql = 'INSERT INTO visits (cod_visit, cod_ven, id_scli, cod_cli, nom_cli, type_visit, ubication_visit, date_created) VALUES (?, ?, ?, ?, ?, ?, ?, ?);'
          await connection.execute(sql, [id_visit, cod_ven, id_scli, cod_cli, nom_cli, 1, ubication_visit , formattedFecha])
  
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

  static async savePass(payments, dbConfig) {
    try {
      let passCompleted = []
      let passNotCompleted = []
  
      for (const info of payments) {
        const { id_pass, id_scli, cod_cli, nom_cli, cod_ven, amount, tipoPago, tasaPago, fecha } = info

        // Convertir la fecha desde 'DD/MM/YYYY' a un objeto Date
        const dateObj = parse(fecha, 'dd/MM/yyyy', new Date());

        // Formatear la fecha a 'YYYY-MM-DD'
        const formattedFecha = format(dateObj, 'yyyy-MM-dd');

        const pool = mysql.createPool(dbConfig)
        const connection = await pool.getConnection()
  
        const existingPass = `SELECT id_pass FROM pass WHERE id_scli = ? AND identifier = ? AND cod_ven = ? AND date_created = ?;`
        const [checkPass] = await connection.execute(existingPass, [id_scli, id_pass, cod_ven, formattedFecha])

        if (checkPass.length > 0) {
          passCompleted.push(info)
        } else {
          let sql = 'INSERT INTO pass (identifier, id_scli, cod_cli, nom_cli, cod_ven, amount, currency_type, currency_rate, date_created) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
          await connection.execute(sql, [id_pass, id_scli, cod_cli, nom_cli, cod_ven, amount, tipoPago, tasaPago, formattedFecha])
  
          passCompleted.push(info)
        }
  
        connection.release()
      }
  
      return {
        code: 200,
        status: true,
        msg: 'Pass processed',
        completed: passCompleted,
        notCompleted: passNotCompleted
      }
    } catch (error) {
      return error
    }
  }

  static async saveSignatures(signatures, dbConfig) {
    try {
      let signCompleted = []
      let signNotCompleted = []

      for (const info of signatures) {
        const { id_signature,id_scli, cod_cli, nom_cli, cod_ven, img_signature, cod_payments, fecha } = info

        const dateSignatureObj = parse(fecha, 'dd/MM/yyyy', new Date())
        const formattedSignatureDate = format(dateSignatureObj, 'yyyy-MM-dd')

        const pool = mysql.createPool(dbConfig)
        const connection = await pool.getConnection()

        const existingSignature = `SELECT id_signature FROM signature WHERE id_signature = ?;`
        const [checkSignature] = await connection.execute(existingSignature, [id_signature])

        // Convertir cod_payments a una cadena separada por comas (si no lo es ya)
        let firmas = Array.isArray(cod_payments) ? cod_payments.join(',') : cod_payments;
        let imgFirma = Array.isArray(img_signature) ? img_signature.join(',') : img_signature;

        if (checkSignature.length > 0) {
          signCompleted.push(info)
        }

        let sqlSignature = `INSERT INTO signature (cod_signature, id_scli, cod_cli, nom_cli, cod_ven, img_signature, cod_payments, date_created) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        await connection.execute(sqlSignature, [id_signature, id_scli, cod_cli, nom_cli, cod_ven, imgFirma, firmas, formattedSignatureDate])
  
        signCompleted.push(info)

        connection.release()

      }
  
      return {
        code: 200,
        status: true,
        msg: 'Singature processed',
        completed: signCompleted,
        notCompleted: signNotCompleted
      }
    } catch (error) {
      return error
    }
  }
}

