import { buildResponseError } from '../util.js'
import geocodeClientFactory from './geocode.client.js'
import weatherClientFactory from './weather.client.js'

const geocodeClient = geocodeClientFactory()

const weatherClient = weatherClientFactory()

export default function forecastServiceFactory() {
    const service = {}

    /**
     * Use the clients to determine the forecast for the given zip and format the data.
     *
     * @param {*} zip
     * @param {*} units
     * @returns Array of forecast data
     */
    service.getForecast = async function (zip, coordinates, units) {
        if (!coordinates.lat || !coordinates.long) {
            // Get lat / long
            coordinates = await geocodeClient.getCoordinates(zip)
            if (!coordinates) {
                const message = `Unable to determine coordinates for zip: ${zip}`
                throw buildResponseError(message, 404)
            }
        }
        // Use lat / long to determine the grid points the weather client requires
        const gridPoints = await weatherClient.getGridPoints(coordinates)
        if (!gridPoints) {
            const message = `Unable to determine grid points for coordinates: ${coordinates}`
            throw buildResponseError(message, 404)
        }
        // Use the grid points to find the hourly forecast
        const weatherForecast = await weatherClient.getForecast(gridPoints, units)
        if (!weatherForecast) {
            const message = `Unable to determine forecast gridPoints: ${gridPoints}`
            throw buildResponseError(message, 404)
        }
        // Map the weather client response data to the format required by the SimpleWeatherApp
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
