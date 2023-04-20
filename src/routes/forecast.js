import { Router } from 'express'
import { buildResponseError } from '../util.js'
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

const validateForecastRequest = (request, response, next) => {
    if (!request.query.zip) {
        // invalid
        next(buildResponseError('Zip is required!', 400))
    } else if (
        request.query.zip.length > 5 ||
        request.query.zip.length < 5 ||
        parseInt(request.query.zip) != request.query.zip
    ) {
        // invalid
        next(buildResponseError('Invalid zip!', 400))
    } else if (
        request.query.units &&
        request.query.units !== 'us' &&
        request.query.units !== 'si'
    ) {
        // invalid
        next(buildResponseError('Unsupported units provided! Please use us or si.', 400))
    } else {
        // valid
        next()
    }
}

// Configure endpoint

router.get('/forecast', validateForecastRequest, async (request, response, next) => {
    const zip = request.query.zip
    const units = request.query.units || 'us'
    forecastService
        .getForecast(zip, units)
        .then((forecast) => response.json(forecast))
        .catch((e) => next(e))
})
