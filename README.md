<!-- Logo -->
![Citizen Portal Logo](/PROJECT/logo/logo.jpg?raw=true)

# Citizen Portal

Welcome to the new intelligent citizen portal.

<!-- Social Media -->
[![GitHub Repo stars](https://img.shields.io/github/stars/NurNils/T2000?style=social)](https://github.com/NurNils/T2000)
[![GitHub followers](https://img.shields.io/github/followers/NurNils?style=social)](https://github.com/NurNils)
[![Twitter Follow](https://img.shields.io/twitter/follow/NurNiIs?style=social)](https://twitter.com/NurNiIs)

<!-- Devices -->
![Citizen Portal Devices](/PROJECT/assets/devices.png?raw=true)

## About
This project was developed by Nils-Christopher Wiesenauer (NurNils) on behalf of evia solutions GmbH during the 3rd and 4th semester as part of the module [T2000](https://studium.dhbw-stuttgart.de/informatik/studienbetrieb/praxisphasen-berichte/t2000-praxis-ii/) at DHBW Stuttgart. The main purpose of this web application is the conceptual design and development of a citizen portal with an integrated artificial intelligence.

💚 The system is based on the MEAN (MongoDB, Express.js, Angular, Node.js)-Stack with the CRUD (Create, Read, Update, Delete) functionality in the backend.

🧠 Brain.js is used for the integrated artificial intelligence. [More info](https://github.com/BrainJS/brain.js#readme)

🎓 The project was rated with a **1.5**
## Table of Contents

- [Installation and Usage](#Installation-and-Usage)
  - [Frontend](#Frontend)
  - [Backend](#Backend)
- [Artificial Intelligence](#Artificial-Intelligence)
  - [Brain.js](#Brainjs)
- [Technologies](#Technologies)
  - [MongoDB](#MongoDB)
  - [Express.js](#Expressjs)
  - [Angular](#Angular)
  - [Node.js](#Nodejs)
- [Documents](#Documents)
  - [Documentation (T2000)](#Documentation-T2000)
  - [Presentation](#Presentation)
  - [Evaluation](#Evaluation)

## Installation and Usage

### Frontend

This Citizen Portal App was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.0.2. [More Info](/SOURCE/FRONTEND/citizen-portal-app)

1. Run `npm install` to download all needed packages and it's dependencies.

2. Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

3. Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Backend

This Citizen Portal API was created with [Node.js](https://nodejs.org/) version 12.16.x. [More Info](/SOURCE/BACKEND/citizen-portal-api)

1. Run `npm install` to download all needed packages and it's dependencies.

2. Go to the API folder and create a `.env` file with the following content (update if necessary):
```javascript
// If PRODUCTION=true: Database connection with authorization below (user and password), otherwise it connects without authorization.
PRODUCTION=false 
PORT=3000
APP_NAME="Citizen Portal"
APP_DOMAIN="citizen-portal.com"
APP_MAIL="hi@citizen-portal.com"
JWT_SECRET="JWT_SECRET"
DB_PORT=27017
DB_HOSTNAME="localhost"
DB_DATABASE="database"
DB_USER="user"
DB_PASSWORD="password"
FILES_IMAGE="image/bmp,image/x-bmp,image/x-ms-bmp,image/cis-cod,image/cmu-raster,image/fif,image/gif,image/ief,image/jpeg,image/png,image/svg+xml,image/tiff,image/vasa,image/vnd.wap.wbmp,image/x-freehand,image/x-icon,image/x-portable-anymap,image/x-portable-bitmap,image/x-portable-graymap,image/x-portable-pixmap,image/x-rgb,image/x-windowdump,image/x-xbitmap,image/x-xpixmap"
```
3. Run `npm start` for a Node.js server. Navigate to `http://localhost:3000/` or defined port in `.env` file. The app will automatically reload if you change any of the source files because of [nodemon](https://nodemon.io/).

## Artificial Intelligence

### Brain.js

[Brain.js](https://github.com/BrainJS/brain.js) is used for the integrated artificial intelligence.
To archieve training of manual added tranings from database using strings with inputs and outputs a LSTM neural network was implemented: [More Info](/SOURCE/BACKEND/citizen-portal-api/routes/neural-network.js)

🛈 LSTM means long short-term memory and is a subcategory of recurrent neural networks (RNN) that are able to learn long-term dependencies. LSTMs were first introduced in 1997 by Sepp Hochreiter and Jürgen Schmidhuber. The idea of the two was to use three gates. An input gate, a forget gate and an output gate. In this way, the LSTM is able to remember events from earlier experiences compared to general RNNs, thus creating the long short-term memory.

```javascript
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
```

For the intelligent search an endpoint `/search` was created. To get a category based on a search term, a HTTP GET request must be sent: 
```javascript
router.get(`/`, (req, res) => {
  const data = req.query;
  if (data && data.search && data.lang) {
    let output = network.run(data.search);
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
```

## Technologies

The system is based on the MEAN (MongoDB, Express.js, Angular, Node.js)-Stack with the CRUD (Create, Read, Update, Delete) functionality in the backend.

![MEAN Stack](/PROJECT/assets/mean-stack.jpeg?raw=true)

### MongoDB

MongoDB is a document-oriented NoSQL database used for high volume data storage.

### Express.js

Express.js is the most popular Node web framework and is the underlying li-brary for several other popular Node web frameworks. It provides many mechanisms.

### Angular

Angular is a TypeScript based front-end framework which is published as open source software.

### Node.js

Node.js is a JavaScript free and open source cross-platform for server-side programming that allows users to build network applications quickly.

## Corona Data

Matching the current situation, the citizen portal additionally displays the current situations of Baden-Württemberg and the associated urban and rural districts. For data in the portfolio of the Bundesinstitut auf dem Gebiet der Krankheitsüberwachung und Krankheitsprävention, the Robert Koch-Institut (RKI) is a federal institute in the field of disease surveillance and disease prevention, and thus also the central federal institution in the field. [More Info](https://www.rki.de/DE/Content/Institut/institut_node.html)

The `/corona` subpage displays statistics of currently available data to citizens. Anybody can quickly get to the desired information.

For the overview of Covid-19 data of Baden-Württemberg, the citizen portal uses data from the Center  for  Systems  Science  and  Engineering (CSSE) of Johns Hopkins University. Current data from around the world is provided by the CSSE on a daily basis in a GitHub repository in the form of Excel files. [More Info](https://github.com/CSSEGISandData/COVID-19)
 
The citizen portal automatically downloads these files every day, generating complete statistics of all available data for the state of Baden-Württemberg. 

![Corona Data](/PROJECT/assets/corona-statistics.jpg?raw=true)

## Documents

### Documentation (T2000)

The project documentation (T2000) was written in latex and packaged as a [.zip](/PROJECT/T2000_Latex.zip) file. A [.pdf](/PROJECT/T2000_Dokumentation_TINF19C_Wiesenauer_Nils-Christopher.pdf) document was created for submission. 

### Presentation

A PowerPoint presentation ([.pptx](/PROJECT/T2000_Presentation.pptx)) was created for the oral exam. The exam itself took place online.

Procedure:
- 15 minutes presentation of the project work and presentation of the own work. 
- 15 minutes of questions from the examination board on the topic of the project work, including the associated basics.

### Evaluation

The overall grade for the module subject consists of 50% of the grade for the documentation and 50% of the oral examination (1/2 presentation and 2/2 question paper). Both were rated with a 1.5.