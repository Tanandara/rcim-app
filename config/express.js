var express = require("express");
var cors = require("cors");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var ejs = require('ejs');
var session = require("express-session");
var validator = require("express-validator");

module.exports = function(){
  var app = express();

  // Cors
  app.use(cors());


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




  // Routes
  require("../routes/index.routes")(app);
  require("../routes/users.routes")(app);
  require("../routes/coa.routes")(app);
  require("../routes/journals.routes")(app);


  return app;
}
