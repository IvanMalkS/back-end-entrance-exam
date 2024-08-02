const path = require('node:path')
const fs = require('node:fs')
const CAT_IMAGES_DIRECTORY = path.join(
  __dirname,  // eslint-disable-line
  '..',
  'pictures',
  'cat-images'
)
const INITIAL_CACHE_SIZE = 10

class CacheService {
  constructor(maxSize = INITIAL_CACHE_SIZE) {
    this.cache = new Map()
    this.maxSize = maxSize
  }

  get(key) {
    return this.cache.get(key)
  }

  getCurrentCacheSize() {
    return this.cache.size
  }

  getMaxCacheSize() {
    return this.maxSize
  }

  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
    this.cache.set(key, value)
  }

  clear() {
    this.cache.clear()
    return {
      CODE: 'CACHE_CLEARED',
      occupied: this.getCurrentCacheSize(),
    }
  }

  resize(newSize) {
    this.maxSize = newSize
    if (!isNaN(newSize) || newSize <= 0) {
      return {
        CODE: 'ERROR_VALUE',
        message: 'size must be number bigger then 0',
      }
    }
    const keysIterator = this.cache.keys()
    while (this.cache.size > newSize) {
      const firstKey = keysIterator.next().value
      this.cache.delete(firstKey)
    }
    return {
      CODE: 'CACHE_RESIZED',
      newSize: newSize,
    }
  }

  async createCache(codes) {
    const successCodes = []
    const errorCodes = []
    for (const code of codes) {
      const catImagePath = path.join(CAT_IMAGES_DIRECTORY, `cat-${code}.jpeg`)
      try {
        const cat = await fs.promises.readFile(catImagePath)
        this.set(catImagePath, cat)
        successCodes.push(code)
      } catch (err) {  // eslint-disable-line
        errorCodes.push(code)
      }
    }
    return {
      CODE: 'CACHE_CREATED',
      successCodes: successCodes,
      errorCodes: errorCodes,
    }
  }

  getCacheInfo() {
    const maxCacheSize = this.getMaxCacheSize()
    const currentCacheSize = this.getCurrentCacheSize()
    const availableSize = maxCacheSize - currentCacheSize
    return {
      max: maxCacheSize,
      current: currentCacheSize,
      available: availableSize,
    }
  }
}

module.exports = new CacheService()
