const CacheService = require("../services/CacheService");
const path = require("node:path");
const fs = require("node:fs");
const CAT_IMAGES_DIRECTORY = path.join(__dirname, '..', 'pictures', 'cat-images');

/**
 * @swagger
 * /api/v1/cache:
 *   get:
 *     summary: Получить информацию о кэше
 *     responses:
 *       200:
 *         description: Информация о кэше
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 available:
 *                   type: number
 *                   description: Доступный размер кэша
 *                 occupied:
 *                   type: number
 *                   description: Занятый размер кэша
 */
exports.getCache = async (req, res) => {
    const cacheSize = await  CacheService.getMaxCacheSize();
    const currentSize = await CacheService.getCurrentCacheSize();
    res.send({
        'available': cacheSize,
        'occupied': currentSize
    });
};

/**
 * @swagger
 * /api/v1/cache:
 *   post:
 *     summary: Создать кэш для изображений котов/кошек
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codes:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Список статус-кодов изображений котов/кошек
 *     responses:
 *       200:
 *         description: Кэш создан успешно
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 CODE:
 *                   type: string
 *                   description: Код операции
 *                 successCodes:
 *                   type: array
 *                   items:
 *                     type: integer
 *                   description: Успешно добавленные статус-коды
 *                 errorCodes:
 *                   type: array
 *                   items:
 *                     type: integer
 *                   description: Статус-коды с ошибками
 */
exports.createCache = async (req, res) => {
    const codes = req.body.codes;
    for (const code of codes) {
        const catImagePath = path.join(CAT_IMAGES_DIRECTORY, `cat-${code}.jpeg`);
        await fs.readFile(catImagePath, (err, data) => {
            CacheService.set(catImagePath)
        });
    }
    res.send({
        'CODE': 'CACHE_CREATED',
    });
}

/**
 * @swagger
 * /api/v1/cache:
 *   put:
 *     summary: Обновить размер кэша
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               size:
 *                 type: number
 *                 description: Новый размер кэша
 *     responses:
 *       200:
 *         description: Размер кэша обновлен успешно
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cacheSize:
 *                   type: number
 *                   description: Новый размер кэша
 */
exports.updateCache = async (req, res) => {
    const { size } = req.body;
    await CacheService.resize(size);
    const cacheSize = await CacheService.getMaxCacheSize();
    res.send({cacheSize});
};

/**
 * @swagger
 * /api/v1/cache/clear:
 *   delete:
 *     summary: Очистить кэш
 *     responses:
 *       200:
 *         description: Кэш очищен успешно
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 CODE:
 *                   type: string
 *                   description: Код операции
 *                 occupied:
 *                   type: number
 *                   description: Занятый размер кэша после очистки
 */
exports.clearCache = async (req, res) => {
    await CacheService.clear();
    const currentSize = await CacheService.getCurrentCacheSize();
    res.send({
        'CODE': 'CACHE_CLEARED',
        'occupied': currentSize
    });
};
