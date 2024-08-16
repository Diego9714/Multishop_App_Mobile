import { createAccessToken }   from '../libs/jwt.js'
import { pool }   from '../connection/mysql.connect.js'
// import bcrypt     from "bcrypt"

export class Users {
  static async search(username , password) {
    try {
      let msg = {
        status: false,
        msg: "User not found",
        code: 500
      }

      const connection = await pool.getConnection()

      let sql = 'SELECT cod_ven , user_vend , pass_vend , existenceStatus , nom_ven , ced_ven FROM svend WHERE user_vend = ?;'
      let [user] = await connection.execute(sql,[username.toUpperCase()])
      
      connection.release()

      if(user) {
        let pass = password.toUpperCase()

        let decryptedPassword = pass.toString('utf8');
        let isMatch = decryptedPassword === password.toUpperCase();        
        // let isMatch = await bcrypt.compare(password, user[0].pass_vend)

        let userToken = {
          cod_ven : user[0].cod_ven,
          user_ven : user[0].user_vend,
          nom_ven : user[0].nom_ven,
          ced_ven : user[0].ced_ven,
          prodExistence: user[0].existenceStatus
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

  static async searchProfile(user) {
    try {
      let msg = {
        status: false,
        msg: "Usuario no encontrado",
        code: 404
      }

      const connection = await pool.getConnection()

      let sql = 'SELECT username , email , createdAt , updatedAt FROM users WHERE id_user = ?;'
      let [search] = await connection.execute(sql,[user])
    
      connection.release()

      if(search){

        let idUser      = user
        let username    = search[0].username
        let email       = search[0].email
        let createdAt   = search[0].createdAt
        let updatedAt   = search[0].updatedAt

        msg = {
          status: true,
          msg: "Usuario encontrado",
          code: 200,
          idUser,
          username,
          email,
          createdAt,
          updatedAt
        } 
      }
  
      return msg
    } catch (error) {
      return error
    }
  }
}

