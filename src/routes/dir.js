'use strict';

/**
 * Third part modules
 */
const express = require('express');
const router = express.Router();

/**
 * Custom modules
 */
const dirController = require('../controllers/dir');

router.post('/', dirController.createDir);
router.get('/', dirController.retrieveDirs);
router.put('/:path', dirController.updateDir);
router.delete('/:path', dirController.deleteDir);

module.exports = router;
