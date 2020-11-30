/**********************
 *
 * File: corona.js
 *
 * Loads current corona virus data from the Center for Systems Science and Engineering (CSSE) at Johns Hopkins University
 * GitHub: https://github.com/CSSEGISandData/COVID-19
 *
 * @author NurNils
 * @copyright Copyright (c) 2021
 *
 **********************/
const express = require('express');
const router = express.Router();
const csv = require('csv-parser');
const fs = require('fs');
const https = require('https');

// Path to save combined corona data
const coronaDataPath = 'assets/corona.json';

// First day where data from bw are available (Initial 05-15-2020, first day for available data from JHU)
let dateToCheck = '05-15-2020';

// Days to add for checking
let days = 1;

// Corona data object to show
let dataCoronaVirus = {
  labels: [],
  confirmed: [],
  deaths: [],
  recovered: [],
  active: [],
  incidentRate: [],
};

// Checks if any data is available
if (fs.existsSync(coronaDataPath)) {
  // Sets already loaded corona virus data
  dataCoronaVirus = JSON.parse(fs.readFileSync(coronaDataPath));
  // Sets Last loaded day from json
  dateToCheck = dataCoronaVirus.labels[dataCoronaVirus.labels.length - 1];
  console.log('Loaded cached data with new first date', dateToCheck);
} else {
  console.log('No data can be found. Loading new data', dateToCheck);
}

// Gets date formatted as string to get correct .csv filename (e.q. 08-06-2021)
const getDateFormat = (date) => {
  date.setDate(date.getDate() - 1);
  const year = date.getFullYear();
  let month = `${date.getMonth() + 1}`;
  if (month.length < 2) month = `0${month}`;
  let day = `${date.getDate()}`;
  if (day.length < 2) day = `0${day}`;
  return `${month}-${day}-${year}`;
};

// Reads corona virus data from provided date
const readCoronaVirusData = (date) => {
  fs.createReadStream(`assets/csv/${date}.csv`)
    .pipe(csv())
    .on('data', (row) => {
      if (row.Province_State && row.Province_State.indexOf('Baden-Wurttemberg') !== -1) {
        dataCoronaVirus.confirmed.push(row.Confirmed);
        dataCoronaVirus.deaths.push(row.Deaths);
        dataCoronaVirus.recovered.push(row.Recovered ? row.Recovered : 510096);
        dataCoronaVirus.active.push(row.Active);
        dataCoronaVirus.incidentRate.push(row.Incident_Rate);
        dataCoronaVirus.labels.push(date);
      }
    });
};

// Loads corona virus data
const loadCoronaVirusData = async () => {
  const newDateToCheck = new Date(dateToCheck);
  newDateToCheck.setDate(newDateToCheck.getDate() + days);
  const end = new Date();
  if (newDateToCheck < end) {
    const date = getDateFormat(newDateToCheck);
    const url = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/${date}.csv`;
    const file = fs.createWriteStream(`assets/csv/${date}.csv`);
    await https.get(url, (response) => {
      const stream = response.pipe(file);
      stream.on('finish', () => {
        console.log(`Downloaded ${date}.csv`);
        readCoronaVirusData(date);
        days++;
      });
    });
  } else {
    fs.writeFileSync(coronaDataPath, JSON.stringify(dataCoronaVirus));
  }
};

// Starts interval for loading corona virus data
setInterval(loadCoronaVirusData, 1000);

router.get(`/`, (req, res) => {
  res.status(200).send({ status: 'success', data: dataCoronaVirus });
});

module.exports = router;
