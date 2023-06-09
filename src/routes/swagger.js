import { Router } from 'express'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import pkgJson from '../../package.json' assert { type: 'json' }

/**
 * Configure API documentation endpoint. The documentation details will be provided at each endpoint definition.
 */

export const router = Router()

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: pkgJson.name,
            version: pkgJson.version,
            description: pkgJson.description,
            contact: {
                name: pkgJson.author,
            },
        },
        servers: [
            {
                url: 'http://localhost:3001',
            },
        ],
    },
    apis: ['./src/routes/*.js'],
}

const specs = swaggerJSDoc(options)

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

router.get('/', (request, response) => response.redirect('/api-docs'))
