const path = require("node:path");
const fs = require("node:fs").promises; // Используем promises для асинхронных операций
const CacheService = require("../services/CacheService");
const AppError = require("../utils/appError");
const CAT_IMAGES_DIRECTORY = path.join(__dirname, '..', 'pictures', 'cat-images');

class CatService {
    constructor() {
    }

    async getCatImage(code) {
        const catImagePath = path.join(CAT_IMAGES_DIRECTORY, `cat-${code}.jpeg`);

        const cachedImage = CacheService.get(catImagePath);

        if (cachedImage) {
            return cachedImage;
        }

        const data = await fs.readFile(catImagePath);

        CacheService.set(catImagePath, data);

        return CacheService.get(catImagePath);
    }
}

module.exports = new CatService();