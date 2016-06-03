'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var formidable = require('express-formidable');
var fs = require('fs');


var app = express();
require('dotenv').load();
require('./app/config/passport')(passport);

mongoose.connect(process.env.MONGO_URI);

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));
app.use(formidable.parse());

app.use(session({
	secret: 'secretClementine',
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

//routes(app, passport);

app.get('/', function(req, res){
    fs.readFile('./index.html',"utf8", function (err, html) {
        if (err) {
            throw err; 
        }   
            res.writeHeader(200, {"Content-Type": "text/html"});  
            res.write(html);  
            res.end(); 
            return;
    });
	
});

app.post('/api/fileanalyse/', function(req, res){
  //console.log(req.body[0].size);
  var returnObject = { fileSize: req.body[0].size};
  var json = JSON.stringify(returnObject);
  //console.log(json)//
  res.writeHead(200, {"Content-Type": "application/json"});
  res.end(json);
});



var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});