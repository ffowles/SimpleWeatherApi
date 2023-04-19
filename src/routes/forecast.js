import { Router } from "express";
import { getForecast } from "../forecast/forecast.service.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - finished
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         title:
 *           type: string
 *           description: The title of your book
 *         author:
 *           type: string
 *           description: The book author
 *         finished:
 *           type: boolean
 *           description: Whether you have finished reading the book
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the book was added
 *       example:
 *         id: d5fE_asz
 *         title: The New Turing Omnibus
 *         author: Alexander K. Dewdney
 *         finished: false
 *         createdAt: 2020-03-10T04:05:06.157Z
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
 *     responses:
 *       200:
 *         description: The list of the books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */

export const router = Router();

const zipToLatLong = {
  40509: "37.9924° N, 84.3752° W",
};

const validateForecastRequest = (request, response, next) => {
  if (!request.query.zip) {
    // invalid
    const error = new Error("Zip is required!");
    error.status = 400;
    error.stack = false;
    next(error);
  } else {
    // valid
    next();
  }
};
router.get("/forecast", validateForecastRequest, (request, response) =>
  response.json(getForecast(request.query.zip))
);
