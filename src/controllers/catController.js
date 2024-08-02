const path = require("node:path");
const CatService = require('./../services/catService')
const AppError = require("../utils/appError");
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
 *         description: Изображение кота/кошки
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 */
exports.getCat = async (req, res, next) => {
    const statusCode = parseInt(req.params.code);
    try {
        const catImage = await CatService.getCatImage(statusCode);
        res
            .contentType('image/jpeg')
            .send(catImage)
    } catch (err) {
        return next(new AppError('Code does not exist', 404));
    }
}

