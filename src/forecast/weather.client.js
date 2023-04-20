import axios from 'axios'

/**
 * Client to reach out to the national weather service.
 * Ex. URLs:
 *  - https://api.weather.gov/points/37.9924,-84.3752
 *  - https://api.weather.gov/gridpoints/LMK/99,70/forecast
 */

const hostname = 'api.weather.gov'

const options = {
    headers: {
        'User-Agent': '(freddy.f@live.com)',
    },
}

export default function weatherClientFactory() {
    const client = {}

    client.getGridPoints = async function (coordinates) {
        const url = `https://${hostname}/points/${coordinates.lat},${coordinates.long}`
        return axios
            .get(url, options)
            .then((response) => {
                const properties = response.data.properties
                return {
                    gridId: properties.gridId,
                    gridX: properties.gridX,
                    gridY: properties.gridY,
                }
            })
            .catch((e) => console.error(e))
    }

    client.getForecast = async function (gridPoints, units) {
        const url = `https://${hostname}/gridpoints/${gridPoints.gridId}/${gridPoints.gridX},${gridPoints.gridY}/forecast/hourly`
        const optionsWithUnits = {
            ...options,
            params: {
                units,
            },
        }
        return axios
            .get(url, optionsWithUnits)
            .then((response) => response.data.properties)
            .catch((e) => console.error(e))
    }

    return client
}
