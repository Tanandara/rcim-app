var models  = require('../models');
var Sequelize  = require('sequelize');
var _ = require('lodash');
var crypto = require('crypto');


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
  models.users.destroy({
    where: {
      user_id: req.body.user_id
    }
  }).then(function() {
    res.json([{"message":"success"}]);
  });
}

exports.UpdateUser = function(req,res){
  // เข้ารหัส password
  if(req.body.password){req.body.salt = crypto.randomBytes(16).toString("base64"); req.body.password =function(password,salt){return crypto.pbkdf2Sync(password,salt,10000,64).toString("base64")}(req.body.password,req.body.salt)}

  models.users.update({
      user_name:req.body.user_name,
      password:req.body.password,
      salt:req.body.salt,
      email: req.body.email,
      tel_no: req.body.tel_no,
      address: req.body.address,
      campus_id:req.body.campus_id,
      role_id:req.body.role_id
  }, {
    where: {
      user_id: req.body.user_id
    }
  })
  .then((data)=>{
    res.json([{"message":"success"}]);
  });
}

exports.CreateUser = function(req,res){
  models.users.create({
    user_id:req.body.user_id,
    user_name:req.body.user_name,
    password:req.body.password,
    email: req.body.email,
    tel_no: req.body.tel_no,
    address: req.body.address,
    campus_id:req.body.campus_id,
    role_id:req.body.role_id
  }).then(function(user){
    res.send("success");
  });
}

exports.CreateUser2 = function(req,res){
  /*
    role
    1 = พนักงานบัญชี
    2 = หัวหน้าพนักงานบัญชี
    3 = ผู้บริหาร
    4 = ผู้ดูแลระบบ

    campus_id
    1 = ศาลายา
    2 = วังไกล
    3 = บพิตร
  */

  var user_id = req.body.campus_id+""+req.body.role_id;

  models.sequelize.query("SELECT max(user_id) as max_id FROM users where user_id like :user_id",
  {
    replacements:  {
                    user_id : user_id+"%"
                  },
    type: Sequelize.QueryTypes.SELECT
  })
  .then((max)=> {
    // generate ID
    if(max[0].max_id==null){
      user_id += "001";
    }else{
      console.log(max);
      var new_id = (parseInt(max[0].max_id.replace(/\d{2}(\d{3})/gm,"$1")) + 1).toString();
      var pad = "000";
      console.log("new_id = " + new_id);
      user_id += pad.substring(0, pad.length - new_id.length) + new_id;
    }

    // Create User
    models.users.create({
      user_id:user_id,
      user_name:req.body.user_name,
      password:req.body.password,
      email: req.body.email,
      tel_no: req.body.tel_no,
      address: req.body.address,
      campus_id:req.body.campus_id,
      role_id:req.body.role_id
    }).then(function(data){
      // res.json(data);
      res.json([{"message":"success"}]);
    });

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
