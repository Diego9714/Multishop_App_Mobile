import mysql from "mysql2/promise"

export class Clients {
  static async all(cod_ven, dbConfig) {
    try {
      let msg = {
        status: false,
        msg: "Clients not founded",
        code: 404
      }

      const pool = mysql.createPool(dbConfig)
      const connection = await pool.getConnection()

      let sql = 'SELECT id_scli , cod_ven , cod_cli , nom_cli , rif_cli , dir1_cli , tel_cli FROM scli WHERE cod_ven = ?;'
      let [clients] = await connection.execute(sql, [cod_ven])

      connection.release()

      if(clients.length > 0){
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

