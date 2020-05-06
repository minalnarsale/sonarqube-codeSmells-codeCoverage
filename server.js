const express = require('express');
const bodyParser = require('body-parser');
const sendMail = require('./utility/queues/sendMail');

const app = express();

//middleware: separation of incoming request into req.header, req.body
app.use(bodyParser.urlencoded({ extended: true }));

//middleware: req.body -> Json object conversion
app.use(bodyParser.json());

//middleware: adding logger for each request coming to server
app.use((req, res, next) => {
    console.log(new Date(), req.method, (decodeURIComponent(req.url)));
    next();
});

// API calls
app.post('/api/sendEmail', (req, res) => sendMail(req, res));

app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));
