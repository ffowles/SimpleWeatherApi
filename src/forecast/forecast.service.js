import weatherClientFactory from './weather.client.js'

export default function forecastServiceFactory() {
    const service = {}

    const weatherClient = weatherClientFactory()

    service.getForecast = async function (zip, units) {
        const coordinates = 'test' // await getCoordinates(zip);
        const gridPoints = await weatherClient.getGridPoints(37.9924, -84.3752)
        const weatherForecast = await weatherClient.getForecast(gridPoints, units)
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
