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

        // Obtener los límites de la firma
        const bounds = this.getBoundsFromCoordinates(coordinates);
        
        // Calcular el desplazamiento para centrar la firma
        const offsetX = (width - (bounds.maxX - bounds.minX)) / 2 - bounds.minX;
        const offsetY = (height - (bounds.maxY - bounds.minY)) / 2 - bounds.minY;

        // Iniciar el dibujo de la firma
        ctx.beginPath()

        // Procesar las coordenadas y dibujar la ruta
        this.drawPathFromCoordinates(ctx, coordinates, offsetX, offsetY)

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
  static drawPathFromCoordinates(ctx, svgPath, offsetX, offsetY) {
    const pathInstructions = svgPath.match(/[A-Za-z][^A-Za-z]*/g) // Divide las instrucciones SVG
    pathInstructions.forEach(instruction => {
      const type = instruction[0] // El tipo de instrucción (M, L, etc.)
      const coords = instruction.slice(1).trim().split(/[ ,]+/).map(Number) // Las coordenadas

      if (type === 'M') {
        // Movimiento a la primera coordenada
        ctx.moveTo(coords[0] + offsetX, coords[1] + offsetY)
      } else if (type === 'L') {
        // Dibuja líneas hacia las coordenadas
        for (let i = 0; i < coords.length; i += 2) {
          ctx.lineTo(coords[i] + offsetX, coords[i + 1] + offsetY)
        }
      }
      // Aquí puedes agregar más tipos de instrucciones SVG si es necesario
    })
  }

  // Función para obtener los límites de la firma
  static getBoundsFromCoordinates(svgPath) {
    const pathInstructions = svgPath.match(/[A-Za-z][^A-Za-z]*/g); // Divide las instrucciones SVG
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    pathInstructions.forEach(instruction => {
      const type = instruction[0]; // El tipo de instrucción (M, L, etc.)
      const coords = instruction.slice(1).trim().split(/[ ,]+/).map(Number); // Las coordenadas

      if (type === 'M' || type === 'L') {
        for (let i = 0; i < coords.length; i += 2) {
          const x = coords[i];
          const y = coords[i + 1];

          // Actualizar los límites
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
    });

    return { minX, minY, maxX, maxY };
  }
}
