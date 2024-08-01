let INITIAL_CACHE_SIZE = 3;

class CacheService {
    constructor(maxSize = INITIAL_CACHE_SIZE) {
        this.cache = new Map();
        this.maxSize = maxSize;
    }

    get(key) {
        return this.cache.get(key);
    }

    getCurrentCacheSize() {
        return this.cache.size;
    }

    getMaxCacheSize() {
        return this.maxSize;
    }

    set(key, value) {
        if (this.cache.size >= this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, value);
    }

    clear() {
        this.cache.clear();
    }

    resize(newSize) {
        this.maxSize = newSize;
        while (this.cache.size > newSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
    }
}

module.exports = new CacheService();
