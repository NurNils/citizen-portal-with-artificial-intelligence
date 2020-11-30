/**********************
 *
 * File: index.js
 *
 * Main file to start REST API
 * Website: https://nodejs.org
 *
 * @author NurNils
 * @copyright Copyright (c) 2021
 *
 **********************/
obj = {
  prettier: 'example',
  hello: 'world',
}; 
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const router = express.Router();
const https = require('https');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

// Loads environment file
const dotenv = require('dotenv');
dotenv.config();

// Models
const USER = require('./models/user');

/**********************
 * Config / Preperation
 **********************/
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

/** Origins */
app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Content-Type', 'application/json');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

/**********************
 * Authentication
 **********************/
authenticate = (req, res, next) => {
  // Checks if token cookie were provided
  if (req.cookies.token) {
    // Verifies JWT token
    jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(403).json({ status: 'error', message: 'Failed to authenticate token' });
      } else {
        // Loads user data from database
        USER.get(decoded._id, (err, user) => {
          if (!err && user) {
            // Sets loaded user to req
            req.user = user;
            next();
          } else {
            res.status(403).json({
              status: 'error',
              message: 'Failed to load user. Please contact server administrator.',
            });
          }
        });
      }
    });
  } else {
    res.status(403).json({ status: 'error', message: 'No token were provided' });
  }
};

/**********************
 * Routes
 **********************/
app.use('/article', require('./routes/article'));
app.use('/company', require('./routes/company'));
app.use('/corona', require('./routes/corona'));
app.use('/image', require('./routes/image'));
app.use('/search', require('./routes/neural-network'));
app.use('/training', require('./routes/training'));
app.use('/user', require('./routes/user'));

/**********************
 * Init server & connect to db
 **********************/
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const production = process.env.PRODUCTION === 'true';
if (production) {
  mongoose.connect(
    `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOSTNAME}:${process.env.DB_PORT}/${process.env.DB_DATABASE}?authSource=admin`
  );
  https
    .createServer(
      {
        // key: fs.readFileSync('/etc/letsencrypt/live/.../privkey.pem'),
        // cert: fs.readFileSync('/etc/letsencrypt/live/.../fullchain.pem'),
      },
      app
    )
    .listen(process.env.PORT, () => {
      console.log(`Server is running in production mode on port ${process.env.PORT}...`);
    });
} else {
  mongoose.connect(
    `mongodb://${process.env.DB_HOSTNAME}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`
  );
  app.listen(process.env.PORT, () => {
    console.log(`Server is running in development mode on port ${process.env.PORT}...`);
  });
}
