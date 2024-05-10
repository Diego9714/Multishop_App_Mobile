import { createAccessToken }   from '../libs/jwt.js'
import { pool }   from '../connection/mysql.connect.js'

export class Clients {
  static async search(username , password) {
    try {
      let msg = {
        status: false,
        msg: "User not found",
        code: 500
      }

      const connection = await pool.getConnection()

      let sql = 'SELECT cod_ven , user_vend , pass_vend , nom_ven , ced_ven FROM svend WHERE user_vend = ?;'
      let [user] = await connection.execute(sql,[username])
      
      connection.release()

      
      if(user) {        
        let isMatch = await bcrypt.compare(password, user[0].pass_vend)

        let userToken = {
          id_ven : user[0].cod_ven,
          user_ven : user[0].user_ven,
          nom_ven : user[0].nom_ven,
          ced_ven : user[0].ced_ven
        }
        
        let tokenUser

        if(isMatch){
          
          tokenUser = await createAccessToken(userToken)

          msg = {
            status: true,
            msg: "User Found",
            code: 200,
            tokenUser
          } 
        }
      }
  
      return msg
    } catch (error) {
      return error
    }
  }

  static async all(cod_ven) {
    try {
      let msg = {
        status: false,
        msg: "Clients not founded",
        code: 404
      }

      const connection = await pool.getConnection()

      let sql = 'SELECT cod_ven , cod_cli , nom_cli , rif_cli , dir1_cli , tel_cli FROM scli WHERE cod_ven = ?;'
      let [clients] = await connection.execute(sql, [cod_ven])
      
      connection.release()

      if(clients.length > 0){
        
        let clientsToken = {
          cod_ven : clients[0].cod_ven,
          cod_cli : clients[0].cod_cli,
          nom_cli : clients[0].nom_cli,
          rif_cli : clients[0].rif_cli,
          dir1_cli : clients[0].dir1_cli,
          tel_cli : clients[0].tel_cli
        }
        
        let tokenClient = await createAccessToken(clientsToken)

        msg = {
          status: true,
          msg: "clients found",
          code: 200,
          clients
        } 
      }
  
      return msg
    } catch (error) {
      return error
    }
  }
}

