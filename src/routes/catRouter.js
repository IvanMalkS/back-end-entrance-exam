const express = require('express');
const router = express.Router({ mergeParams: true });
const catController = require('../controllers/catController');

router.route('/:code')
    .get(catController.getCat)

module.exports = router;