const express = require('express');
const router = express.Router();
const apiRouter = require('./api')

//All the URLS of the routes in the api router will be prefixed with /api
router.use('/api', apiRouter)

// Test Route
// router.get('/hello/world', function (req, res) {
//     //Setting cookie on response w/name of XSRF-TOKEN to val of req.csrfToken method
//     res.cookie('XSRF-TOKEN', req.csrfToken());
    // res.send('Hello World!');
// });

// Add a XSRF-TOKEN cookie. Allows dev to reset CSRF token cookie
router.get("/api/csrf/restore", (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.status(200).json({
      'XSRF-Token': csrfToken
    });
  });

module.exports = router;