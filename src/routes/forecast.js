import { Router } from 'express'
import forecastServiceFactory from '../forecast/forecast.service.js'

/**
 * @swagger
 * components:
 *   schemas:
 *     Forecast:
 *       type: object
 *       required:
 *         - hour
 *         - icon
 *         - shortDescription
 *         - temperature
 *         - temperatureUnit
 *         - windSpeed
 *         - windDirection
 *       properties:
 *         hour:
 *           type: string
 *           format: date
 *           description: A date string indicating the hour the forecast is for
 *         icon:
 *           type: string
 *           description: URL to a webhosted icon representing the weather
 *         shortDescription:
 *           type: string
 *           description: Short description of the weather
 *         temperature:
 *           type: number
 *           description: Expected temperature
 *         temperatureUnit:
 *           type: string
 *           description: Unit of measure for the temperature
 *         windSpeed:
 *           type: string
 *           description: Expected windspeed (includes the UOM)
 *         windDirection:
 *           type: string
 *           description: Expected wind direction
 *       example:
 *         hour: 2023-04-19T20:00:00-04:00
 *         icon: https://api.weather.gov/icons/land/night/few,0?size=small
 *         shortDescription: Mostly Clear
 *         temperature: 74
 *         windSpeed: 7 mph
 *         windDirection: SW
 */

/**
 * @swagger
 * tags:
 *   name: Forecast
 *   description: A simple weather forecast API
 * /forecast:
 *   get:
 *     summary: Provide a weather forecast for the provided zip code
 *     tags: [Forecast]
 *     parameters:
 *       - in: query
 *         name: zip
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: units
 *         schema:
 *           type: string
 *         required: false
 *         description: Use 'us' for imperial and 'si' for metric
 *     responses:
 *       200:
 *         description: A list of forecasts for the given zip code
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Forecast'
 */

export const router = Router()

const forecastService = forecastServiceFactory()

const zipToLatLong = {
    40509: '37.9924° N, 84.3752° W',
}

const buildError = (message, status) => {
    const error = new Error(message)
    error.status = status
    error.stack = false
    return error
}

const validateForecastRequest = (request, response, next) => {
    if (!request.query.zip) {
        // invalid
        next(buildError('Zip is required!', 400))
    } else if (!zipToLatLong[request.query.zip]) {
        // invalid
        next(buildError('Provided zip is invalid or unsupported!', 404))
    } else if (
        request.query.units &&
        request.query.units !== 'us' &&
        request.query.units !== 'si'
    ) {
        // invalid
        next(buildError('Unsupported units provided! Please use us or si.', 400))
    } else {
        // valid
        next()
    }
}

// Configure endpoint

router.get('/forecast', validateForecastRequest, async (request, response) => {
    const zip = request.query.zip
    const units = request.query.units || 'us'
    const forecast = await forecastService.getForecast(zip, units)
    response.json(forecast)
})
