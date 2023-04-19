import axios from 'axios'

/**
 * Client to reach out to the national weather service.
 * Ex. URLs:
 *  - https://api.weather.gov/points/37.9924,-84.3752
 *  - https://api.weather.gov/gridpoints/LMK/99,70/forecast
 */

export default function weatherClientFactory() {
    const client = {}

    const options = {
        headers: {
            'User-Agent': '(freddy.f@live.com)',
        },
    }

    const hostname = 'api.weather.gov'

    client.getGridPoints = async function (lat, long) {
        const url = `https://${hostname}/points/${lat},${long}`
        const response = await axios.get(url, options)
        const properties = response.data.properties
        return {
            gridId: properties.gridId,
            gridX: properties.gridX,
            gridY: properties.gridY,
        }
    }

    client.getForecast = async function (gridPoints) {
        const url = `https://${hostname}/gridpoints/${gridPoints.gridId}/${gridPoints.gridX},${gridPoints.gridY}`
        const response = await axios.get(url, options)
        return response.data
    }

    return client
}
