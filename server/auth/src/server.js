import { PORT } from './global/_var.js'

// Dependencies
import express            from 'express'
import cookieParser       from 'cookie-parser'
import cors               from 'cors'
import morgan             from 'morgan'

// Routes
import authRouter from './routes/auth.routes.js'

const app = express()

// Middlewares
app.use(morgan('dev'))
app.use(cookieParser())
app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.listen(PORT, ()=>{
  console.log(`Server is running on port ${PORT}`)
})

// Use Routes
app.use("/api", authRouter)