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
        filename  :filename
      });
  });
}
