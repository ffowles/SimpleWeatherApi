import express from 'express'
import { router as forecastRouter } from './routes/forecast.js'
import { router as swaggerRouter } from './routes/swagger.js'

const port = 3000

const app = express()

app.use(swaggerRouter, forecastRouter)

app.listen(port, () =>
    console.log(`The Simple Weather API is listening at: http://localhost:${port}`)
)
