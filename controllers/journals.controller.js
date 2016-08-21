var models  = require('../models');
var Sequelize  = require('sequelize');
var _ = require('lodash');



exports.GetJournal = function(req,res){
    // models.users.findAll(
    //   {
    //     where:
    //           {
    //             user_id:req.params.id
    //           }
    //   })
    // .then(function(data){
    //   res.json(data);
    // });
}



//
// exports.CreateUser = function(req,res){
//   models.users.create({
//     user_id:req.body.user_id,
//     user_name:req.body.user_name,
//     password:req.body.password
//   }).then(function(user){
//     res.send("success");
//   });
// }



// Custom query
// exports.Query = function(req,res){
//     models.sequelize.query("SELECT * FROM users_view", { type: Sequelize.QueryTypes.SELECT})
//       .then(function(users) {
//         console.log(users);
//         res.json(users);
//       });
//
// }


exports.AddJournals = function(req,res){

    models.journals.max("journal_id").then((max)=>{
      // check max of journal_id
      var id = isNaN(max) ? 1 : (max+1);

      // define
      campus_id = 3;
      user_id = "10001";


      req.body.forEach((data,index)=>{
          models.journals.create({
            journal_id: id,
            journal_no: index+1,
            coa_detail: data.coa_detail,
            coa_id: data.coa_id,
            drcr: data.drcr,
            amount: data.amount,
            date_time: data.date_time,
            campus_id:campus_id,
            user_id:user_id,
            date_create:new Date()
          });
      });

      console.log(req.body);
      res.json([{"message":"success"}]);
      //
      //
      //
      //
      //
      //    console.log(max,"|||| id =" + id);
      //    res.end(req.body.data+"\r\nmax = "+max+"|||| id = " + id);
         //res.json(max);
    });

}
