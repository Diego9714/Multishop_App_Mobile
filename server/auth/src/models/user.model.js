import { createAccessToken } from '../libs/jwt.js'
import mysql                 from "mysql2/promise"

export class Users {
  static async search(username , password, dbConfig) {
    try {
      let msg = {
        status: false,
        msg: "User not found",
        code: 404
      }

      const pool = mysql.createPool(dbConfig)
      const connection = await pool.getConnection()

      let sql = `SELECT cod_ven , user_vend , AES_DECRYPT(pass_vend, '321ytiruces_drowssap987') AS pass_vend , existenceStatus , nom_ven , ced_ven, typeSearch FROM svend WHERE user_vend = ?;`
      let [user] = await connection.execute(sql,[username.toUpperCase()])

      connection.release()

      if(user.length > 0) {
        let decryptedPassword = user[0].pass_vend.toString()
        let isMatch = decryptedPassword === password.toUpperCase()

        console.log(isMatch)
        
        if(isMatch){

          let userToken = {
            cod_ven : user[0].cod_ven,
            user_ven : user[0].user_vend,
            nom_ven : user[0].nom_ven,
            ced_ven : user[0].ced_ven,
            prodExistence: user[0].existenceStatus,
            typeSearch: user[0].typeSearch
          }
          
          let tokenUser = await createAccessToken(userToken)

          msg = {
            status: true,
            msg: "User Found",
            code: 200,
            tokenUser
          } 
        }else{
          msg = {
            status: false,
            msg: "Incorrect password",
            code: 401
          };
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

