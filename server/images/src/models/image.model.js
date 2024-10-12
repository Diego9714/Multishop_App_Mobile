import mysql from "mysql2/promise"
import { createCanvas } from 'canvas'

export class Images {
  static async rebuild(cod_signature, dbConfig, res) {
    try {
      // Crear la conexión a la base de datos
      const pool = mysql.createPool(dbConfig)
      const connection = await pool.getConnection()

      // Consulta para obtener las coordenadas de la firma
      let sql = 'SELECT img_signature FROM signature WHERE cod_signature = ?;'
      let [results] = await connection.execute(sql, [cod_signature])

      connection.release()

      // Verifica si se encontró la firma
      if (results.length > 0) {
        const coordinates = results[0].img_signature // Coordenadas SVG desde la base de datos

        // Crear un lienzo
        const width = 300
        const height = 400
        const canvas = createCanvas(width, height)
        const ctx = canvas.getContext('2d')

        // Rellenar el fondo con un color blanco
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, width, height)

        // Iniciar el dibujo de la firma
        ctx.beginPath()

        // Procesar las coordenadas y dibujar la ruta
        this.drawPathFromCoordinates(ctx, coordinates)

        // Terminar el dibujo
        ctx.stroke()

        // Convertir el lienzo a un buffer de PNG
        const buffer = canvas.toBuffer('image/png')

        // Enviar la imagen como respuesta HTTP
        res.setHeader('Content-Type', 'image/png')
        res.status(200).send(buffer)
      } else {
        // Si no se encuentra la firma, enviar un error 404
        res.status(404).json({
          status: false,
          msg: "Signature not found",
          code: 404
        })
      }

    } catch (error) {
      res.status(500).json({ status: false, msg: error.message, code: 500 })
    }
  }

  // Función para procesar las coordenadas y dibujar la ruta en el lienzo
  static drawPathFromCoordinates(ctx, svgPath) {
    const pathInstructions = svgPath.match(/[A-Za-z][^A-Za-z]*/g) // Divide las instrucciones SVG
    pathInstructions.forEach(instruction => {
      const type = instruction[0] // El tipo de instrucción (M, L, etc.)
      const coords = instruction.slice(1).trim().split(/[ ,]+/).map(Number) // Las coordenadas

      if (type === 'M') {
        // Movimiento a la primera coordenada
        ctx.moveTo(coords[0], coords[1])
      } else if (type === 'L') {
        // Dibuja líneas hacia las coordenadas
        for (let i = 0; i < coords.length; i += 2) {
          ctx.lineTo(coords[i], coords[i + 1])
        }
      }
      // Aquí puedes agregar más tipos de instrucciones SVG si es necesario
    })
  }
}
