import { createAccessToken }   from '../libs/jwt.js'
import { pool }   from '../connection/mysql.connect.js'

export class Products {
  static async all() {
    try {
      let msg = {
        status: false,
        msg: "Products not founded",
        code: 404
      }

      const connection = await pool.getConnection()

      let sql = `SELECT 
      sinv.codigo , sinv.descrip , sinv.precio1 as precioBs , sinv.existencia , sinv.ccate,
      detallepr.precio1 as precioUsd,
      catego.ncate
      FROM sinv 
      INNER JOIN detallepr ON sinv.codigo = detallepr.codigo
      INNER JOIN catego ON sinv.ccate = catego.ccate
      WHERE sinv.existencia > 0
      ;`
      let [products] = await connection.execute(sql)
      
      connection.release()

      if(products.length > 0){

        msg = {
          status: true,
          msg: "Products found",
          code: 200,
          products
        } 
      }
  
      return msg
    } catch (error) {
      return error
    }
  }
}

