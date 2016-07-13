var models  = require('../models');
var Sequelize  = require('sequelize');

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
