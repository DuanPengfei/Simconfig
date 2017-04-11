'use strict';

/**
 * Third part modules
 */
const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
    return res.status(200).send('Simconfig');
});

module.exports = router;
