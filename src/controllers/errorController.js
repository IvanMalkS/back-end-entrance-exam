const AppError = require('./../utils/appError');
const path = require("node:path");
const CacheService = require("../services/cacheService");
const fs = require("node:fs");
const CAT_IMAGES_DIRECTORY =  path.join(__dirname, '..', 'pictures', 'cat-images')

module.exports = (err, req, res, next) => {
    const statusCode = err.statusCode;
    const catImagePath = path.join(CAT_IMAGES_DIRECTORY, `cat-${statusCode}.jpeg`);

    // Проверка кэша
    const cachedImage = CacheService.get(catImagePath);
    if (cachedImage) {
        // Отправка изображения из кэша
        res.contentType('image/jpeg');
        return res.status(statusCode).send(cachedImage);
    }

    fs.readFile(catImagePath, (err, data) => {
        if (err) {
            return next(new AppError('Code does not exist', 404));
        }

        // Сохранение изображения в кэше
        CacheService.set(catImagePath, data);

        // Отправка изображения
        res.contentType('image/jpeg');
        res.status(statusCode).send(data);
    });
};