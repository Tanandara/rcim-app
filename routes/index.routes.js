var fs = require("fs");
module.exports = function(app){
  app.get("/",function(req,res){
    //res.send("welcome to the rcim api");
    var filename="";
    for (var i of fs.readdirSync("./public/images/users/")) {
      if ((new RegExp('^'+req.session.user_id+'\\.')).test(i)) {
        filename = i;
        break;
      }
    }


    var role = req.session.role_id + "" == "1" ? "พนักงานบัญชี"    :
               req.session.role_id + "" == "2" ? "หัวหน้าพนักงาน"  :
               req.session.role_id + "" == "3" ? "ผู้บริหาร"        :
                                                 "ผู้ดูแลระบบ"     ;

    console.log("\033[31m role : " + role + " \033[0m");
    console.log("\033[31m filename : " + filename + " \033[0m");

	  res.render("index",{
        user_name :req.session.user_name  ,
        role      :role                   ,
        filename  :filename               ,
        role_id   :req.session.role_id + ""
      });
  });


  app.post("/check_permission",function(req,res){
    //console.log("\033[31m /check_permission : state => (" + req.body.name + ") \033[0m");
    var checkPermission = (permission) => {
      /*
        role
        1 = พนักงานบัญชี
        2 = หัวหน้าพนักงานบัญชี
        3 = ผู้บริหาร
        4 = ผู้ดูแลระบบ
      */
      if(!!~permission.indexOf(req.session.role_id + "")){
        //console.log("\033[31m permission : Success (" + req.body.name + ") \033[0m");
        res.json({"permission":"success"});
      }else{
        //console.log("\033[31m permission : Fail (" + req.body.name + ") \033[0m");
        res.json({"permission":"fail"});
      }
    }

    switch (req.body.name) {
      //ทำบัญชีประจำวัน
      case "journalizing":
          checkPermission(["1","4"]);
        break;
      // แก้ไขรายการประจำวัน
      case "searchrefno":
      case "editjournal":
          checkPermission(["2","4"]);
        break;

      //จัดการข้อมูลระบบ
      ////จัดการข้อมูลผู้ใช้งาน
      case "user":
          checkPermission(["4"]);
        break;
      ////จัดการผังบัญชี - จัดการสมุดบัญชี - ตั้งค่ายอดยกมา
      case "coa":
      case "account":
      case "broughtforward":
          checkPermission(["2","4"]);
        break;
      default:  res.json({"permission":"success"});
        break;
    }


  });
}
