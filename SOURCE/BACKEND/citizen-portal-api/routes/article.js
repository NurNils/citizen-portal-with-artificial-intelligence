/**********************
 *
 * File: article.js
 *
 * Article routes
 *
 * @author NurNils
 * @copyright Copyright (c) 2021
 *
 **********************/
const express = require('express');
const router = express.Router();
const ARTICLE = require('../models/article');

router.get(`/`, authenticate, (req, res) => {
  ARTICLE.getByUserId(req.user._id, (err, article) => {
    if (!err && article) {
      ARTICLE.getAllCount((err, total) => {
        if (!err && total) {
          res.status(200).send({ status: 'success', data: { article, overview: { total } } });
        } else {
          res.status(409).send({ status: 'error', message: 'Unable to load article count data' });
        }
      });
    } else {
      res.status(404).send({ status: 'error', message: 'Unable to load article data' });
    }
  });
});

router.get(`/:id`, authenticate, (req, res) => {
  ARTICLE.getByIdAndUserId(req.params.id, req.user._id, (err, article) => {
    if (!err && article) {
      res.status(200).send({ status: 'success', data: { article } });
    } else {
      res.status(404).send({ status: 'error', message: 'Unable to load article data' });
    }
  });
});

router.get(`/:key/key`, (req, res) => {
  ARTICLE.getByKey(req.params.key, (err, article) => {
    if (!err && article) {
      res.status(200).send({ status: 'success', data: { article } });
    } else {
      res.status(404).send({ status: 'error', message: 'Unable to load article data' });
    }
  });
});

router.get(`/:id/duplicate`, authenticate, (req, res) => {
  ARTICLE.duplicateByIdAndUserId(req.params.id, (err, article) => {
    if (!err && article) {
      res.status(200).send({ status: 'success', data: { article } });
    } else {
      res.status(404).send({ status: 'error', message: 'Unable to duplicate article data' });
    }
  });
});

router.put(`/:id`, authenticate, (req, res) => {
  ARTICLE.updateOne(req.params.id, req.user._id, req.body, { new: true }, (err, article) => {
    if (!err && article) {
      res.status(200).send({ status: 'success', data: { article } });
    } else {
      res.status(409).send({ status: 'error', message: 'Unable to add article data' });
    }
  });
});

router.post(`/`, authenticate, (req, res) => {
  req.body.userId = req.user._id;
  ARTICLE.add(req.body, (err, article) => {
    if (!err && article) {
      res.status(200).send({ status: 'success', data: { article } });
    } else {
      res.status(409).send({ status: 'error', message: 'Unable to add article data' });
    }
  });
});

router.delete(`/:id`, authenticate, (req, res) => {
  ARTICLE.delete(req.params.id, req.user._id, (err, article) => {
    if (!err && article) {
      res.status(200).send({ status: 'success', data: null });
    } else {
      res.status(404).send({ status: 'error', message: 'Unable to delete article data' });
    }
  });
});

module.exports = router;
