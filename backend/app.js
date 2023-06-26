const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const { ValidationError } = require('sequelize');

//Bool to check if env is in prod by checking environment key in config
const { environment } = require('./config');
const isProduction = environment === 'production';

//Initialize Express app
const app = express();

//Connect "morgan" middleware for logging info on request and response
app.use(morgan('dev'));

//cookie-parser middleware for parsing cookies
app.use(cookieParser());
//express.json middleware for parsing JSON bodies of requests w/ Content-Type of application/json
app.use(express.json());

// Security Middleware
if (!isProduction) {
    // enable cors only in development
    app.use(cors());
}

// helmet helps set a variety of headers to better secure app
app.use(
    helmet.crossOriginResourcePolicy({
        policy: "cross-origin"
    })
);

// Set the _csrf token and create req.csrfToken method. Two cookies work together to provide CSRF protection.
app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "Lax",
            httpOnly: true
        }
    })
);

app.use(routes); // Connect all the routes

// Catch unhandled requests, set up error body and forward to error handler.
app.use((_req, _res, next) => {
    const err = new Error("The requested resource couldn't be found.");
    err.title = "Resource Not Found";
    err.errors = ["The requested resource couldn't be found."];
    err.status = 404;
    next(err);
});

// Process sequelize errors
app.use((err, _req, _res, next) => {
    // Check if error is a Sequelize error:
    // If the error is an instance of ValidationError from sequelize package, then the error was created from a Sequelize database validation error
    if (err instanceof ValidationError) {
        err.errors = err.errors.map((e) => e.message);
        err.title = 'Validation error';
    }
    next(err);
});

module.exports = app;