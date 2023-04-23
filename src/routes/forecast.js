import { Router } from 'express'
import forecastServiceFactory from '../forecast/forecast.service.js'
import { buildResponseError } from '../util.js'

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
 *   description: A simple weather forecast API.
 * /forecast:
 *   get:
 *     summary: Provide a weather forecast for the provided zip code
 *     tags: [Forecast]
 *     parameters:
 *       - in: query
 *         name: zip
 *         schema:
 *           type: string
 *         description: Zip code for the forecast. This is required if lat & long are not provided.
 *       - in: query
 *         name: lat
 *         schema:
 *           type: string
 *         description: Latitude for the forecast. This is required if zip is not provided.
 *       - in: query
 *         name: long
 *         schema:
 *           type: string
 *         description: Longitude for the forecast. This is required if zip is not provided.
 *       - in: query
 *         name: units
 *         schema:
 *           type: string
 *           default: us
 *         required: false
 *         description: Use 'us' for imperial and 'si' for metric.
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
    if (!request.query.zip && (!request.query.lat || !request.query.long)) {
        // invalid
        next(buildResponseError('A zip or coordinates are required!', 400))
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
    const coordinates = { lat: request.query.lat, long: request.query.long }
    const units = request.query.units || 'us' // default to 'us' if units are not provided
    forecastService
        .getForecast(zip, coordinates, units)
        .then((forecast) => response.json(forecast))
        .catch((e) => next(e))
})
