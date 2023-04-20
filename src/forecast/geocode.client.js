import { Client } from '@googlemaps/google-maps-services-js'
import dotenv from 'dotenv'

dotenv.config()

const key = process.env.GOOGLE_API_KEY

const googleMapsClient = new Client({})

export default function geocodeClientFactory() {
    const client = {}

    client.getCoordinates = async function (zip) {
        const options = {
            params: {
                address: zip,
                key,
            },
            timeout: 1000,
        }
        return googleMapsClient
            .geocode(options)
            .then((response) => {
                if (response.data.status === 'OK') {
                    const result = response.data.results[0]
                    const lat = result.geometry.location.lat
                    const long = result.geometry.location.lng
                    return { lat, long }
                }
            })
            .catch((e) => console.error(e))
    }

    return client
}
