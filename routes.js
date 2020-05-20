const express = require('express');
const router = express.Router();
const sendMailTo = require('./utility/queue/sendMail').sendMailTo;
const path = require('path');

//API routes
router.post('/api/sendEmail', (req, res) => sendMailTo(req, res));

// codeCoverage route
router.get('/codeCoverage', (req, res) => {
    res.sendFile(path.join(__dirname + '/coverage/lcov-report/index.html'));
});

module.exports = router;