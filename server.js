#!/usr/bin/env node

process.env.NODE_ENV = "development";
console.log(process.env.NODE_ENV);
var debug = require('debug')('rcim-back-end');
var express = require("./config/express");
var models = require("./models");

var app = express();

app.set('port', process.env.PORT || 3000);

console.log("Express server listening on port " + (process.env.PORT || 3000) );

models.sequelize.sync().then(function () {
  var server = app.listen(app.get('port'), function() {
    debug('Express server listening on port ' + server.address().port);
  });
});
