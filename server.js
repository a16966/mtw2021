// config the host and the port
const port = 8080;

// import the express package
const express = require('express');

// creates an express app
const app = express();

// creates static routes
const path = require('path');
app.use(express.static(path.join(__dirname, "/public")));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "/public/", "login.html"))
});

// import libraries
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSanitizer = require('express-sanitizer');
const validator = require('express-validator');

const mongoDB = require("./config/connectionDB.js");
mongoDB.con();

// config the middleware
app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// cors
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "append,delete,entries,foreach,get,has,keys,set,values,Authorization, Access-Control-Allow-Origin, Access-Control-Allow-Credentials, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

app.use(expressSanitizer());
app.use(validator());

// routes
// class routes
const classRouter = require("./routes/class.routes.js");
app.use('/', classRouter);
// component routes
const componentRouter = require("./routes/component.routes.js");
app.use('/', componentRouter);
// student routes
const studentRouter = require("./routes/student.routes.js");
app.use('/', studentRouter);
// note routes
const noteRouter = require("./routes/note.routes.js");
app.use('/', noteRouter);

// start the server
app.listen(port, function (err) {
    if (!err) {
        console.log('Server is running');
    }
    else {
        console.log(err);
    }
});

// export the app
module.exports = app;