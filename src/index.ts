import express, { Request, Response, Express } from 'express'
import dotenv from 'dotenv'
import db from './db/index'

// Load environment variables
dotenv.config()
const port = process.env.PORT || 3000

// Initialize express app
const app: Express = express()

// Express inbuilt body parser to read json data and urlencoded to read url encoded data
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

db.connect().then(() => {
  console.log('Connected to MongoDB')
  app.listen(port, () => console.log(`Server listening on port ${port}...`))
}).catch((error) => {
  console.log('Error connecting to MongoDB', error)
})


