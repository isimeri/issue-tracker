'use strict';

const express = require('express');
const cors = require('cors');
const connectDB = require('./db/connect.js');
require('dotenv').config();
const issueModel = require("./db/issueModel.js");
const apiRouter = require("./routes/api.js");

const fccTestingRoutes  = require('./routes/fcctesting.js');
const runner            = require('./test-runner');

let app = express();

app.set("view engine", 'ejs');
app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //For FCC testing purposes only
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use('/api/issues', apiRouter);

connectDB();

//Index page (static HTML)
app.get('/', (req, res) => {
  res.render("index");
});

//For FCC testing purposes
fccTestingRoutes(app);


app.get('/:project', async (req, res) => {
  const proj = req.params.project;
  let options = {project: proj};
  const issuesArr = await issueModel.find(options).sort({created_at: 'desc'});
  res.render("issue", {project: proj, issues: issuesArr});
});

//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

//Start our server and tests!
const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        console.log('Tests are not valid:');
        console.error(e);
      }
    }, 3500);
  }
});

module.exports = app; //for testing
