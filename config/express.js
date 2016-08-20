var express = require("express");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var ejs = require('ejs');
var session = require("express-session");
var validator = require("express-validator");

module.exports = function(){
  var app = express();



  // Session config
  app.use(session({
    secret:"12345iloveyou",
    resave:false,
    saveUninitialized:true
  }));

  // Debug
  if(process.env.NODE_ENV==="development"){
    app.use(morgan("dev"));
  }

  // bodyParser and validator
  app.use(bodyParser.urlencoded({
    extended:true
  }));
  app.use(bodyParser.json());
  app.use(validator());


  // View Engine
  app.set("views",["./views"]);
  app.set('view engine', 'ejs');
  app.use(express.static("./public"));


  // Cors
  app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });
  

  // Routes
  require("../routes/index.routes")(app);
  require("../routes/users.routes")(app);
  require("../routes/coa.routes")(app);


  return app;
}
