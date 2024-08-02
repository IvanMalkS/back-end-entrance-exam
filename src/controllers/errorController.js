const CatService = require('./../services/catService')
const AppError = require('../utils/appError')

module.exports = async (err, req, res, next) => {
  try {
    const statusCode = err.statusCode
    const catImage = await CatService.getCatImage(statusCode)
    res.contentType('image/jpeg').status(statusCode).send(catImage)
  } catch (err) {  // eslint-disable-line
    return next(new AppError('Code does not exist', 404))
  }
}
