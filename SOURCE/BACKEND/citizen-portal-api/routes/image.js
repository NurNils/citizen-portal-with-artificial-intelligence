/**********************
 *
 * File: image.js
 *
 * Routes for the image gallery stored in database
 *
 * @author NurNils
 * @copyright Copyright (c) 2021
 *
 **********************/
const express = require('express');
const router = express.Router();
const FILE = require('../models/file');
const fs = require('fs');

/**********************
 * Image Routes
 **********************/
router.get(`/`, authenticate, (req, res) => {
  FILE.getImages((err, images) => {
    if (!err && images) {
      res.status(200).send({ status: 'success', data: { images } });
    } else {
      res.status(404).send({ status: 'error', message: 'Images not found' });
    }
  });
});

router.get(`/:id`, (req, res) => {
  FILE.getFileById(req.params.id, (err, file) => {
    if (!err && file) {
      const fileBuffer = Buffer.from(file.base64.split(',')[1], 'base64');
      res.writeHead(200, { 'Content-Type': file.type, 'Content-Length': fileBuffer.length });
      res.end(fileBuffer);
    } else {
      res.writeHead(200, { 'Content-Type': 'image/jpeg' });
      res.end(fs.readFileSync(`./assets/images/image-not-found.jpg`), 'binary');
    }
  });
});

router.post(`/`, authenticate, (req, res) => {
  const file = req.body;
  if (file && file.base64 && file.name && file.size && file.type) {
    if (process.env.FILES_IMAGE.split(',').includes(file.type)) {
      file.size = Buffer.from(file.base64.split(',')[1], 'base64').length;

      FILE.addFile(file, (err, image) => {
        if (!err && image) {
          image.base64 = null;
          res.status(200).send({ status: 'success', data: image });
        } else {
          res.status(409).send({ status: 'error', message: 'Unable to add image' });
        }
      });
    } else {
      res.status(400).send({ status: 'error', message: 'File type is not allowed' });
    }
  } else {
    res.status(400).send({ status: 'error', message: 'No file were uploaded' });
  }
});

router.delete(`/:id`, authenticate, (req, res) => {
  FILE.deleteFile(req.params.id, (err, image) => {
    if (!err && image) {
      res.status(200).send({ status: 'success', data: image });
    } else {
      res.status(409).send({ status: 'error', message: 'Unable to delete image' });
    }
  });
});

module.exports = router;
