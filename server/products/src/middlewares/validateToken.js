import jwt        from "jsonwebtoken"
import { KEY }    from '../global/_var.js'

export const authRequired = (req,res,next) => {
  try {
    const {token} = req.cookies
    
    if(!token){
      return res.status(401).json({message: "No hay un token, autorizacion denegada"})
    }

    jwt.verify(token, KEY , (err, user) => {
    
      if(err) return res.status(403).json({message: "Token no valido"})

      req.user = user

      next()
    
    })

  } catch (error) {
    return res.status(500).json({message: error.message});
  }
}
