const express = require('express')
const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')
const app = express()
const catRouter = require('./src/routes/catRouter')
const cacheRouter = require('./src/routes/cacheRouter')
const globalErrorHandler = require('./src/controllers/errorController')
const AppError = require('./src/utils/appError')
const PORT = process.env.PORT || 3000  // eslint-disable-line

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'REST API HTTP-CAT',
      version: '1.0.0',
      description:
        'Это копия популярного апи http-cat с управлением кеширования запросов.',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: `Локальный сервер, использующий порт ${PORT}`,
      },
    ],
  },
  apis: ['./app.js', './src/controllers/*'],
}

const specs = swaggerJsdoc(options)

app.use(express.json())
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(specs))

app.use('/api/v1/cache', cacheRouter)
app.use('/api/v1/', catRouter)

app.all('*', (req, res, next) => {
  next(new AppError('Page does not exist', 404))
})

app.use(globalErrorHandler)

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`)
})
