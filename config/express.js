var express = require("express");
var cors = require("cors");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var ejs = require('ejs');
var session = require("express-session");
var validator = require("express-validator");
var helmet = require('helmet');

module.exports = function(){
  var app = express();

  // Security
  app.use(helmet());

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
  require("../routes/login.routes")(app);
  require("../routes/index.routes")(app);
  require("../routes/users.routes")(app);
  require("../routes/coa.routes")(app);
  require("../routes/accounts.routes")(app);
  require("../routes/journals.routes")(app);
  require("../routes/report.routes")(app);

  app.get("*",function(req,res){
   console.log("\033[31m  url : "+ req.url +"\033[0m");
   console.log("\033[31m  ----- Page Not Found ----- \033[0m");
   res.redirect("/");
  });

  return app;
}
