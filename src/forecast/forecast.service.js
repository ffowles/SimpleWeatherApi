import weatherClientFactory from './weather.client.js'

export default function forecastServiceFactory() {
    const service = {}

    const weatherClient = weatherClientFactory()

    service.getForecast = async function (zip) {
        const coordinates = 'test' // await getCoordinates(zip);
        const gridPoints = await weatherClient.getGridPoints(37.9924, -84.3752)
        const forecast = await weatherClient.getForecast(gridPoints)
        console.log(forecast)
        return forecast
    }

    return service
}
