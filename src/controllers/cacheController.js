const CacheService = require("../services/CacheService");

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
 *                 max:
 *                   type: number
 *                   description: Максимальный размер кеша
 *                 current:
 *                   type: number
 *                   description: Занятый размер кэша
 *                 available:
 *                   type: number
 *                   description: Доступный размер кэша
 *
 */
exports.getCache = async (req, res) => {
    const info = CacheService.getCacheInfo();
    res.send(info)
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
    const codes = req.body.codes
    const info = await CacheService.createCache(codes);
    res.send(info)
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
 *                size:
 *                   type: number
 *                   description: Новый размер кэша
 */
exports.updateCache = async (req, res) => {
    const { size } = req.body;
    const info = CacheService.resize(size);
    res.send(info);
};

/**
 * @swagger
 * /api/v1/cache:
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
    const info = CacheService.clear();
    res.send(info);
};
