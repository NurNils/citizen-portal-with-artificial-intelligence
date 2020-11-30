/**********************
 *
 * File: authenticate.js
 *
 * Authentication for user with bcrypt encryption and JWT
 * GitHub: https://github.com/BrainJS/brain.js
 *
 * @author NurNils
 * @copyright Copyright (c) 2021
 *
 **********************/
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const USER = require('../models/user');
const production = process.env.PRODUCTION === 'true';

/**********************
 * Authentication
 **********************/
router.get(`/`, authenticate, (req, res) => {
  const data = {
    username: req.user.username,
    email: req.user.email,
    rank: req.user.rank,
  };
  res.status(200).send({ status: 'success', data });
});

router.post(`/register`, (req, res) => {
  const data = req.body;
  if (data && data.username && data.email && data.password) {
    const username = data.username.trim().toLowerCase();
    const email = data.email.trim().toLowerCase();
    // Encryption of password with 10 salt rounds
    const password = bcrypt.hashSync(data.password, 10);

    USER.add({ username, email, password }, (err, user) => {
      if (!err && user) {
        const authToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
          expiresIn: 86400000, // Expires in 1 day
        });
        res.cookie('token', authToken, {
          maxAge: 86400000,
          httpOnly: true,
          secure: production,
        });
        res.status(200).send({
          status: 'success',
          data: {
            email: user.email,
            username: user.username,
            rank: user.rank,
          },
        });
      } else {
        res.status(409).send({ status: 'error', message: 'Failed to add user' });
      }
    });
  } else {
    res.status(400).send({ status: 'error', message: 'You provided wrong data' });
  }
});

router.put(`/`, authenticate, (req, res) => {
  if (req.body.username && req.body.password) {
    // Change username
    res.status(200).send({ status: 'success', data: {} });
  } else if (req.body.email && req.body.password) {
    // Change email
    res.status(200).send({ status: 'success', data: {} });
  } else if (req.body.password1 && req.body.password2) {
    // Change password
    res.status(200).send({ status: 'success', data: {} });
  } else {
    res.status(400).send({ status: 'error', message: 'You provided invalid data' });
  }
});

router.post(`/login`, (req, res) => {
  const data = req.body;
  if (data && data.usernameOrEmail && data.password) {
    const usernameOrEmail = data.usernameOrEmail;
    const password = data.password;

    USER.getByEmailUsernamePassword(usernameOrEmail, async (err, user) => {
      if (!err && user) {
        // Checks if passwords matches
        if (await bcrypt.compare(password, user.password)) {
          const authToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '86400000', // expires in 24 hours
          });
          res.cookie('token', authToken, {
            maxAge: 86400000,
            httpOnly: true,
            secure: production, 
          });
          res.status(200).send({
            status: 'success',
            data: {
              email: user.email,
              username: user.username,
              rank: user.rank,
            },
          });
        } else { 
          res.status(401).send({ status: 'error', message: 'login-messages.error' });
        } 
      } else {
        res.status(401).send({ status: 'error', message: 'login-messages.error' });
      }
    });
  } else {
    res.status(400).send({ status: 'error', message: 'You provided wrong data' });
  }
});

router.get(`/logout`, (req, res) => {
  res.clearCookie(`authToken`);
  res.status(200).send({ status: 'success', message: 'Logout successful' });
});

module.exports = router;
