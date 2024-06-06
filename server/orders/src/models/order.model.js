import { pool }   from '../connection/mysql.connect.js'

export class Orders {
  static async saveOrder(order) {
    try {
      let msg = {
        status: false,
        msg: "This order already exists",
        code: 400
      }

      for( const info of order){

        const connection = await pool.getConnection()

        let sql = 'INSERT INTO preorder (cod_cli, cod_ven, fecha, tip_doc) VALUES (? , ? , ? , ?) ;'
        let [order] = await connection.execute(sql,[cod_cli, cod_ven, fecha, tip_doc])

        const id_order = order.insertId

        for (const pedido of grupoPedido) {
          const saveArt = `INSERT INTO loatdpedidos (idpedido, codart, canart, preart, monimp, poriva, subtota, fecped, adddat) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
          await connection.execute(saveArt, [idpedido, pedido.codart, pedido.cantidad, pedido.preve1, pedido.iva, pedido.monimp, pedido.factura, fecped, adddat])
        }

        msg = {
          code: 200,
          status: true,
          msg: 'The Order registered successfully'
        }
      }

      // const connection = await pool.getConnection()

      // let sql = 'SELECT ced_ven FROM diariov WHERE user_vend = ?;'
      // let [user] = await connection.execute(sql,[username])
      
      // connection.release()

      // if(user) {        
      //   let isMatch = await bcrypt.compare(password, user[0].pass_vend)

      //   let userToken = {
      //     cod_ven : user[0].cod_ven,
      //     user_ven : user[0].user_ven,
      //     nom_ven : user[0].nom_ven,
      //     ced_ven : user[0].ced_ven
      //   }
        
      //   let tokenUser

      //   if(isMatch){
          
      //     tokenUser = await createAccessToken(userToken)

      //     msg = {
      //       status: true,
      //       msg: "User Found",
      //       code: 200,
      //       tokenUser
      //     } 
      //   }
      // }
  
      return msg
    } catch (error) {
      return error
    }
  }
}

