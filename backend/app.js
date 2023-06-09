const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

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