import weatherClientFactory from './weather.client.js'
import geocodeClientFactory from './geocode.client.js'
import { buildResponseError } from '../util.js'

const geocodeClient = geocodeClientFactory()

const weatherClient = weatherClientFactory()

export default function forecastServiceFactory() {
    const service = {}

    service.getForecast = async function (zip, units) {
        const coordinates = await geocodeClient.getCoordinates(zip)
        if (!coordinates) {
            const message = `Unable to determine coordinates for zip: ${zip}`
            throw buildResponseError(message, 404)
        }
        const gridPoints = await weatherClient.getGridPoints(coordinates)
        if (!gridPoints) {
            const message = `Unable to determine grid points for coordinates: ${coordinates}`
            throw buildResponseError(message, 404)
        }
        const weatherForecast = await weatherClient.getForecast(gridPoints, units)
        if (!weatherForecast) {
            const message = `Unable to determine forecast gridPoints: ${gridPoints}`
            throw buildResponseError(message, 404)
        }
        return formatWeatherForecast(weatherForecast)
    }

    function formatWeatherForecast(weatherForecast) {
        return weatherForecast.periods.map((period) => ({
            hour: period.startTime,
            icon: period.icon,
            shortDescription: period.shortForecast,
            temperature: period.temperature,
            temperatureUnit: period.temperatureUnit,
            windSpeed: period.windSpeed,
            windDirection: period.windDirection,
        }))
    }

    return service
}
