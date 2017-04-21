'use strict';

/**
 * Build in modules
 */
const fs = require('fs');
const path = require('path');

/**
 * Third part modules
 */
const config = require('config');
const express = require('express');
const fsExtra = require('fs-extra');
const readdirP = require('readdir-p');
const router = express.Router();

router.post('/', function (req, res, next) {
    let body = null;
    try {
        body = typeof req.body !== 'object' ? JSON.parse(req.body) : req.body;
    } catch (err) {
        return res.status(400).json({
            status: 'error',
            message: 'incorrect JSON format',
            data: {}
        });
    }

    const _path = body.path;
    if (!_path) {
        return res.status(400).json({
            status: 'error',
            message: 'missing "path" parameter',
            data: {}
        });
    }

    const dataDir = config.get('dataDir');
    const realPath = path.resolve(dataDir, _path.slice(1));
    fsExtra.mkdirpSync(realPath);
    return res.status(200).json({
        status: 'success',
        message: 'create dir success',
        data: {
            path: _path,
            name: path.basename(_path),
            type: 'dir',
            children: readdirP.loopSync(realPath, {
                rootPath: dataDir
            })
        }
    });
});

router.get('/', function (req, res, next) {
    const dataDir = config.get('dataDir');
    const tree = readdirP.loopSync(dataDir, {
        rootPath: dataDir
    });
    return res.status(200).json(tree.children);
});

router.put('/:path', function (req, res, next) {
    let body = null;
    try {
        body = typeof req.body !== 'object' ? JSON.parse(req.body) : req.body;
    } catch (err) {
        return res.status(400).json({
            status: 'error',
            message: 'incorrect JSON format',
            data: {}
        });
    }

    const name = body.name;
    if (!name) {
        return res.status(400).json({
            status: 'error',
            message: 'missing "name" parameter',
            data: {}
        });
    }

    const _path = req.params.path;
    const dataDir = config.get('dataDir');
    const realPath = path.resolve(dataDir, _path.slice(1));
    const targetPath = path.resolve(realPath, `../${name}`);
    if (!fs.existsSync(realPath)) {
        return res.status(400).json({
            status: 'error',
            message: 'original directory did not exist',
            data: {}
        });
    }
    if (fs.existsSync(targetPath)) {
        return res.status(400).json({
            status: 'error',
            message: 'target directory already exist',
            data: {}
        });
    }

    fsExtra.moveSync(realPath, targetPath);
    return res.status(200).json({
        status: 'success',
        message: 'rename directory success',
        data: {
            path: path.resolve(_path, `../${name}`),
            name: name,
            type: 'dir',
            children: readdirP.loopSync(targetPath, {
                rootPath: targetPath
            })
        }
    });
});

router.delete('/:path', function (req, res, next) {
    const _path = req.params.path;
    const dataDir = config.get('dataDir');
    const realPath = path.resolve(dataDir, _path.slice(1));

    if (!fs.existsSync(realPath)) {
        return res.status(400).json({
            status: 'error',
            message: 'directory not exists',
            data: {}
        });
    }

    fsExtra.removeSync(realPath);
    return res.status(200).json({
        status: 'success',
        message: 'delete directory success',
        data: {}
    });
});

module.exports = router;
