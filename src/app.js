import cors from 'cors'
import express from 'express'
import { router as forecastRouter } from './routes/forecast.js'
import { router as swaggerRouter } from './routes/swagger.js'

const port = 3001

const app = express()

const corsOptions = {
    origin: 'http://localhost:3000',
    optionSuccessStatus: 200,
}

// TODO: add tests

app.use(cors(corsOptions), swaggerRouter, forecastRouter)

app.listen(port, () =>
    console.log(`The Simple Weather API is listening at: http://localhost:${port}`)
)
