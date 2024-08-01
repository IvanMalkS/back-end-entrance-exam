const path = require("node:path");
const fs = require("node:fs");
const CacheService = require("../services/CacheService");
const AppError = require("../utils/appError");
const CAT_IMAGES_DIRECTORY = path.join(__dirname, '..', 'pictures', 'cat-images');

/**
 * @swagger
 * /api/v1/{code}:
 *   get:
 *     summary: Изображение кота/кошки по статус-коду
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: integer
 *         description: Статус-код изображения кота/кошки
 *     responses:
 *       200:
 *         description: Изображение кошки
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 */
exports.getCat = async (req, res, next) => {
    const statusCode = parseInt(req.params.code);
    const catImagePath = path.join(CAT_IMAGES_DIRECTORY, `cat-${statusCode}.jpeg`);

    // Проверка кэша
    const cachedImage = CacheService.get(catImagePath);
    if (cachedImage) {
        // Отправка изображения из кэша
        res.contentType('image/jpeg');
        return res.send(cachedImage);
    }

    fs.readFile(catImagePath, (err, data) => {
        if (err) {
            return next(new AppError('Code does not exist', 404));
        }

        // Сохранение изображения в кэше
        CacheService.set(catImagePath, data);

        // Отправка изображения
        res.contentType('image/jpeg');
        return res.send(data);
    });
}

