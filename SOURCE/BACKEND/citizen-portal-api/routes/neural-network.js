/**********************
 *
 * File: neural-network.js
 *
 * Creates and trains neural network with brain.js
 * GitHub: https://github.com/BrainJS/brain.js
 *
 * @author NurNils
 * @copyright Copyright (c) 2021
 *
 **********************/
const express = require('express');
const router = express.Router();
const brain = require('brain.js');
const fs = require('fs');
const TRAINING = require('../models/training');
const ARTICLE = require('../models/article');
const categories = ['corona', 'kfz'];

// Initializes long short term memory (LSTM) neural network
const network = new brain.recurrent.LSTM();
// The maximum times to iterate the training data
const networkIterations = 20000;

// Loads and trains neural network
loadNeuralNetwork = () => {
  // Start date to check how long the operation took
  const startDate = new Date();
  // Path to save trained neural network
  const networkPath = './assets/neural-network.json';

  // Checks if neural network already exists
  if (fs.existsSync(networkPath)) {
    const networkData = JSON.parse(fs.readFileSync(networkPath));
    network.fromJSON(networkData);
  }

  // Trains manual added untrained searches from database
  TRAINING.getNotTrainedSearches((err, training) => {
    // Checks if untrained data are available
    if (!err) {
      if (training && training.length > 0) {
        console.log(`Training neural network with ${training.length} new searches...`);
        const trainingData = training.map((item) => ({
          input: item.search,
          output: item.category,
        }));
        network.train(trainingData, {
          iterations: networkIterations,
        });
        fs.writeFileSync(networkPath, JSON.stringify(network.toJSON(), null, 2));
      }
    } else {
      console.log(`Unable to load training data: ${err.message}`);
    }
    // Updates training data to status "trained"
    TRAINING.updateNotTrainedSearches((err, training) => {
      if (!err) {
        const endDate = new Date();
        const minutes = (endDate.getTime() - startDate.getTime()) / 1000 / 60;
        console.log(
          `Successfully loaded neural network in ${minutes} minutes with ${training.nModified} searches`
        );
      } else {
        console.log(`Unable to update not trained searches`);
      }
    });
  });
};
loadNeuralNetwork();

router.get(`/`, (req, res) => {
  const data = req.query;
  if (data && data.search && data.lang) {
    let output = network.run(data.search );
    console.log('output', output);
    if (!categories.includes(output.toLowerCase())) output = 'corona';
    ARTICLE.search(output, (err, article) => {
      if (!err && article) {
        res.status(200).send({ status: 'success', data: { article, output } });
      } else {
        res.status(409).send({ status: 'error', message: 'Unable to search' });
      }
    });
  }
});

module.exports = router;
