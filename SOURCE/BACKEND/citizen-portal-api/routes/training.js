/**********************
 *
 * File: training.js
 *
 * Training routes
 *
 * @author NurNils
 * @copyright Copyright (c) 2021
 *
 **********************/
const express = require('express');
const router = express.Router();
const TRAINING = require('../models/training');

router.get(`/`, authenticate, (req, res) => {
  TRAINING.getByUserId(req.user._id, (err, training) => {
    if (!err && training) {
      TRAINING.getAllCount((err, total) => {
        if (!err && total) {
          const categories = ['corona', 'kfz'];
          res
            .status(200)
            .send({ status: 'success', data: { training, overview: { total, categories } } });
        } else {
          res.status(409).send({ status: 'error', message: 'Unable to load training count data' });
        }
      });
    } else {
      res.status(409).send({ status: 'error', message: 'Unable to load training data' });
    }
  });
});

router.post(`/`, authenticate, (req, res) => {
  req.body.userId = req.user._id;
  req.body.trained = false;
  TRAINING.add(req.body, (err, training) => {
    if (!err && training) {
      res.status(200).send({ status: 'success', data: training });
    } else {
      res.status(409).send({ status: 'error', message: 'Unable to add training data' });
    }
  });
});

module.exports = router;
