const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');
const json2xls = require('json2xls');
const bodyParser = require('body-parser');
const fs = require('fs');
const passport = require('passport');
const SamlStrategy = require('passport-saml').Strategy;
const env = process.env.NODE_ENV || 'development';
const siteConfig = require(`${__dirname}/config/config.json`)[env];
 

app.options('*', cors());
// enable cors
app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
    exposedHeaders: ['Content-Length'],
}));

require('dotenv').config();

// logger
const { requestLogger } = require('./support/logger');

// error handler
require('express-async-errors');

const {
  errorHandler,
  badJsonHandler,
  notFoundHandler,
} = require('./middlewares');

// Configure body parser to handle larger payloads
app.use(bodyParser.json({ limit: '100mb' })); // Adjust limit as needed
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true })); // Adjust limit as needed

app.use(requestLogger);

// parse json body
app.use(express.json());
// handle bad json format
app.use(badJsonHandler);



app.use(session({  
  name: process.env.APP_NAME,
  secret: process.env.SESSION_KEY, 
  resave: process.env.SESSION_RESAVE,
  saveUninitialized: process.env.SESSION_SAVE_UNINITIALIZED,
  cookie: { 
    secure: process.env.COOKIE_SECURE, // This will only work if you have https enabled!
    maxAge: 3600000, // 1 hrs,
    store: new session.MemoryStore,
  } 
}));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  req.setTimeout(600000); // 600000 ms = 10 minutes
  next();
});

app.use('/uploads', express.static(__dirname + '/public/uploads'));

const exampleController = async (req) => {
  try {
      // Simulate controller logic
      return {
          statusCode: 200,
          body: 'Success'
      };
  } catch (error) {
      return {
          statusCode: 500,
          body: 'Internal Server Error'
      };
  }
};

app.use(json2xls.middleware);

app.use((req, res, next) => {
  console.log('Middleware status code:', res.statusCode);
  next();
});

app.get('/', (req, res) => {
  exampleController(req)
      .then(response => {
          console.log('Response:', response);
          if (!response.statusCode) {
              console.error('Undefined status code detected');
              res.status(500).send('Internal Server Error');
          } else {
              res.status(response.statusCode).send(response.body);
          }
      })
      .catch(error => {
          console.log('Error:', error);
          res.status(500).send(error.message);
      });
});



// load routes
// load routes
require('./loaders/routes')(app);

// load and validate env variables
require('./loaders/config');
// Error handling middleware

// handle 404 not found error
app.use(notFoundHandler);

// catch all errors
app.use(errorHandler);

app.locals.moment = require('moment');
app.locals.env = env;
app.locals.siteConfig = siteConfig;
app.locals.globalRoot = __dirname;

module.exports = app;
