const express = require('express');
const router = express.Router({ mergeParams: true });
const cacheController = require('../controllers/cacheController');

router.route('/')
    .get(cacheController.getCache)
    .post(cacheController.createCache)
    .put(cacheController.updateCache)
    .delete(cacheController.clearCache)

module.exports = router;