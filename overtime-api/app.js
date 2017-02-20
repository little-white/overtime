var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var excelTemplate = require('./excel-template.js');
var session = require('express-session');
var bodyParser = require('body-parser');

// var router = express.Router();
app.use(bodyParser.json());
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));

// Authentication and Authorization Middleware
var auth = function(req, res, next) {
    console.log(req.session);
    console.log(req.session.user);
    console.log(req.session.admin);
    if (req.session && req.session.user && req.session.admin)
        return next();
    else
        return res.sendStatus(401);
};

mongoose.connect('mongodb://localhost:27017/overtime');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log("connected");
});

var Schema = mongoose.Schema;
var testSchema = new Schema({
    name: String,
    img: String
});

var usersSchema = new Schema({
    name: String,
    password: String
});

var overtimeSchema = new Schema({
    number: Number,
    name: String,
    department: String,
    date: String,
    start: String,
    end: String,
    rest: String,
    reason: String,
    length: String,
    level: String
});

var Test = mongoose.model('demo0', testSchema);
var Users = mongoose.model('users', usersSchema);
var Overtime = mongoose.model('overtime', overtimeSchema);

// You can define styles as json object 
// More info: https://github.com/protobi/js-xlsx#cell-styles 


// The data set should have the following shape (Array of Objects) 
// The order of the keys is irrelevant, it is also irrelevant if the 
// dataset contains more fields as the report is build based on the 
// specification provided above. But you should have all the fields 
// that are listed in the report specification 
var dataset = [
    { customer_name: 'IBM', status_id: 1, note: 'some note', misc: 'not shown' },
    { customer_name: 'HP', status_id: 0, note: 'some note' },
    { customer_name: 'MS', status_id: 0, note: 'some note', misc: 'not shown' }
]

// Create the excel report. 
// This function will return Buffer 



app.get('/excel', function(req, res) {
    // save the user
    var data = []
    Overtime.find(function(err, overtime) {
        if (err) throw err;
        console.log(excelTemplate);
        var report = excelTemplate(overtime);

        res.attachment('report.xlsx');
        res.send(report);
    });
});

app.get('/api/hello', auth, function(req, res) {
    Users.find(function(err, user) {
        if (err) throw err;
        res.send(user);
    });
});

app.get('/api/login', function(req, res) {
    if (!req.query.username || !req.query.password) {
        res.send('login failed');
    } else {
        Users.findOne({ name: req.query.username }, function(err, user) {
            if (err) throw err;
            console.log(user);

            if (user.password === req.query.password) {
                req.session.user = req.query.username;
                req.session.admin = true;
                res.send("login success!");
            } else {
                res.send("login failed!");
            }
        });
    }
});

app.post('/api/register', function(req, res) {
    var users = new Users({
        name: "demo1",
        password: "demo1"
    });
    users.save(function(err, users) {
        if (err) return console.error(err);
        res.sendStatus(200);
    });
})

app.get('/api/overtime', function(req, res) {
    Overtime.find(function(err, overtime){
        res.send(overtime);
    })
})

app.post('/api/overtime', function(req, res) {
    var overtime = new Overtime({
        start: req.body.start,
        end: req.body.end,
        reason: req.body.reason
    });
    overtime.save(function(err, overtime) {
        if (err) return console.error(err);
        res.sendStatus(200);
    });
})

app.listen(3000)
