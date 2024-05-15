import jwt        from "jsonwebtoken"
import { KEY }    from '../global/_var.js'

export const createAccessToken = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload , 
      KEY, 
      { algorithm: "HS256"}, 
      (err , token) => {
        if (err) reject(err)
        resolve(token)
      }
    )
  })
}