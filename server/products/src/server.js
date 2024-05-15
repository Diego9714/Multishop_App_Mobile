import { PORT } from './global/_var.js'

// Dependencies
import express            from 'express'
import cookieParser       from 'cookie-parser'
import cors               from 'cors'
import morgan             from 'morgan'
import bodyParser from 'body-parser'

// Routes
import productRouter from './routes/products.routes.js'

const app = express()

// Middlewares
app.use(morgan('dev'))
app.use(cookieParser())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(PORT, ()=>{
  console.log(`Server is running on port ${PORT}`)
})

// Use Routes
app.use("/api", productRouter)