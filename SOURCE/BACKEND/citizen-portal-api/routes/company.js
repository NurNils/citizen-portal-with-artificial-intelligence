/**********************
 *
 * File: company.js
 *
 * Company routes
 *
 * @author NurNils
 * @copyright Copyright (c) 2021
 *
 **********************/
const express = require('express');
const router = express.Router();
const COMPANY = require('../models/company');

router.get(`/`, authenticate, (req, res) => {
  COMPANY.getByUserId(req.user._id, (err, companies) => {
    if (!err && companies) {
      COMPANY.getAllCount((err, total) => {
        if (!err && Number.isInteger(total)) {
          res.status(200).send({ status: 'success', data: { companies, overview: { total } } });
        } else {
          console.log('err', total);
          res.status(409).send({ status: 'error', message: 'Unable to load company count data' });
        }
      });
    } else {
      res.status(404).send({ status: 'error', message: 'Unable to load company data' });
    }
  });
});

router.get(`/:id`, authenticate, (req, res) => {
  COMPANY.getByIdAndUserId(req.params.id, req.user._id, (err, company) => {
    if (!err && company) {
      res.status(200).send({ status: 'success', data: { company } });
    } else {
      res.status(404).send({ status: 'error', message: 'Unable to load company data' });
    }
  });
});

router.get(`/:id/duplicate`, authenticate, (req, res) => {
  COMPANY.duplicateByIdAndUserId(req.params.id, (err, company) => {
    if (!err && company) {
      res.status(200).send({ status: 'success', data: { company } });
    } else {
      res.status(404).send({ status: 'error', message: 'Unable to duplicate company data' });
    }
  });
});

router.put(`/:id`, authenticate, (req, res) => {
  COMPANY.updateOne(req.params.id, req.user._id, req.body, { new: true }, (err, company) => {
    if (!err && company) {
      res.status(200).send({ status: 'success', data: { company } });
    } else {
      res.status(409).send({ status: 'error', message: 'Unable to add company data' });
    }
  });
});

router.post(`/`, authenticate, (req, res) => {
  req.body.userId = req.user._id;
  COMPANY.add(req.body, (err, company) => {
    if (!err && company) {
      res.status(200).send({ status: 'success', data: { company } });
    } else {
      res.status(409).send({ status: 'error', message: 'Unable to add company data' });
    }
  });
});

module.exports = router;
