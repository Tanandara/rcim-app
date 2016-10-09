var models  = require('../models');
var Sequelize  = require('sequelize');
var _ = require('lodash');




exports.initRequest = function(req,res,next){
  // req.session.user_id = "TANANDARA";
  // req.session.user_name = "ฐานันดร์ เกตุแก้ว";
  // req.session.role_id = 4;


  //console.log("\033[31m  ----- initRequest ----- \033[0m");
  if(!req.session.user_id){
      //console.log("\033[31m You are not login \033[0m");
      res.redirect("/login");
  }else{
    //console.log("\033[31m You are logined \033[0m");
    next();
  }
}

exports.renderLoginPage = function(req,res){
  res.render("login.ejs");
}


exports.destroySession = function(req,res){
  //console.log("\033[31m  ----- destroySession ----- \033[0m");
  req.session.destroy();
  res.redirect("/");
}
