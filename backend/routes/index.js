const express = require('express');
const router = express.Router();

router.get('/hello/world', function (req, res) {
    //Setting cookie on response w/name of XSRF-TOKEN to val of req.csrfToken method
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.send('Hello World!');
});

module.exports = router;