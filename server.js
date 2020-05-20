const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

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

//defining routes for API, tests-cases, swagger-documentation, code-coverage report
app.use('/', routes);

app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));

module.exports = app;
