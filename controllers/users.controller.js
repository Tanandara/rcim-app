var models  = require('../models');
var Sequelize  = require('sequelize');
var _ = require('lodash');


exports.GetAllUsers = function(req,res){
    models.users.findAll()
    .then(function(data){
      res.json(data);
    });
}

exports.GetUser = function(req,res){
    models.users.findAll(
      {
        where:
              {
                user_id:req.params.id
              }
      })
    .then(function(data){
      res.json(data);
    });
}

exports.LoginUser = function(req,res){
  models.users.findAll({
    where: {
              user_id: req.body.user_id
          }
    })
    .then(function(data){
      // ในกรณีที่ไม่อยากใช้ lodash ==> if(Object.keys(data).length)
      if(_.isEmpty(data)){
        // ไม่เจอ user นี้
        console.log("user not found");
        res.json([{"myerrormessage":"user not found"}]);
      }else{
        // เจอ user นี้
        // เช็คพาสเวิร์ด
        if(models.users.authenticate(req.body.password,data[0].salt,data[0].password)){
          console.log("password correct");
          res.json(data);
        }else{
          console.log("password incorrect");
          res.json([{"myerrormessage":"password incorrect"}]);
        }

      }
    });
}

exports.DeleteUser = function(req,res){
  res.send("xxxx");
}

exports.UpdateUser = function(req,res){
  res.send("xxxx");
}

exports.CreateUser = function(req,res){
  models.users.create({
    user_id:req.body.user_id,
    user_name:req.body.user_name,
    password:req.body.password
  }).then(function(user){
    res.send("success");
  });
}



// Custom query
exports.Query = function(req,res){
    models.sequelize.query("SELECT * FROM users_view", { type: Sequelize.QueryTypes.SELECT})
      .then(function(users) {
        console.log(users);
        res.json(users);
      });

}
