var models  = require('../models');
var Sequelize  = require('sequelize');
var _ = require('lodash');
var crypto = require('crypto');
var fs = require('fs');


exports.GetAllUsers = function(req,res){
    models.sequelize.query(
    `
    SELECT
    u.user_id,
    u.user_name,
    u.email,
    u.tel_no,
    u.address,
    c.campus_name,
    r.role_name,
    u.campus_id,
    u.role_id
    FROM users as u
    left outer join campus as c on u.campus_id = c.campus_id
    left outer join roles as r on u.role_id = r.role_id
    `
    , { type: Sequelize.QueryTypes.SELECT})
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
  console.log("\033[31m  ----- LoginUser ----- \033[0m");
  models.users.findAll({
    where: {
              user_id: req.body.user_id.toUpperCase()
          }
    })
    .then(function(data){
      // ในกรณีที่ไม่อยากใช้ lodash ==> if(Object.keys(data).length)
      if(_.isEmpty(data)){
        // ไม่เจอ user นี้
        console.log("user not found");
        //res.json([{"myerrormessage":"user not found"}]);
        res.redirect("login");
      }else{
        // เจอ user นี้
        // เช็คพาสเวิร์ด
        if(models.users.authenticate(req.body.password,data[0].salt,data[0].password)){
          console.log("password correct");
          req.session.user_id = data[0].user_id;
          req.session.user_name = data[0].user_name;
          req.session.role_id = data[0].role_id;
          //res.json(data);
          console.log("req.session.user_id", req.session.user_id);
          res.redirect("/");
        }else{
          console.log("password incorrect");
          res.redirect("login");
          //res.json([{"myerrormessage":"password incorrect"}]);
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
    ClearAvatar(req.body.user_id,true);
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
    ClearAvatar(req.body.user_id , req.body.avatar_flag);
    res.json([{"message":"success"}]);
  });
}

function ClearAvatar(user_id,avatar_flag){
  if(!avatar_flag) return; // ถ้าไม่มีการอัพโหลดไฟล์จะออกจากฟังค์ชั่น
  var filename="";
  for (var i of fs.readdirSync("./public/images/users/")) {
    //console.log("\033[31m  filename : \033[0m",i,(new RegExp('^'+user_id+'\\.')).test(i));
    if ((new RegExp('^'+user_id+'\\.')).test(i)) {
      filename = i;
      break;
    }
  }
  if(filename!="") fs.unlink("./public/images/users/" + filename );
}


exports.CreateUser = function(req,res){
  /*
    role
    1 = พนักงานบัญชี
    2 = หัวหน้าพนักงานบัญชี
    3 = ผู้บริหาร
    4 = ผู้ดูแลระบบ
  */

  // Create User
  models.users.create({
    user_id:req.body.user_id.toUpperCase(),
    user_name:req.body.user_name,
    password:req.body.password,
    email: req.body.email,
    tel_no: req.body.tel_no,
    address: req.body.address,
    campus_id:req.body.campus_id,
    role_id:req.body.role_id
  })
  .then(function(data){
    res.json({"message":"success","id": data.user_id});
  })
  .catch(function(error) {
    console.log("catch",error);
    if(error.errors[0].message =="PRIMARY must be unique"){
      res.json({"message":"fail"});
    }
  });

}


exports.uploadAvatar = function(req,res){
  console.log("\033[31m  ----- uploadAvatar ----- \033[0m");
  console.log("\033[31m  req.file : \033[0m",req.file);
    if(req.file){
        var fileExtension = (req.file.originalname).replace(/.+\.(gif|jpe?g|png)$/i,"$1");
        if((/^(gif|jpe?g|png)$/i).test(fileExtension)){

          var src = fs.createReadStream(req.file.path);
          var dest = fs.createWriteStream( "./public/images/users/" +  req.body.userid +"." + fileExtension);
          src.pipe(dest);
          src.on('end', function() {
             console.log('upload complete');
             fs.unlink(req.file.path);
             res.send("upload complete");
           });
          src.on('error', function(err) {
            console.log(err);
            fs.unlink(req.file.path);
            res.send("upload fail");
           });



        }else{
          fs.unlink(req.file.path);
          res.json({"message":"ไม่ได้อัพโหลดรูปภาพมา"});
        }


    }
}



// Custom query
exports.Query = function(req,res){
    models.sequelize.query("SELECT * FROM users_view", { type: Sequelize.QueryTypes.SELECT})
      .then(function(users) {
        console.log(users);
        res.json(users);
      });

}
