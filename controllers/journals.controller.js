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



    models.sequelize.query(
      "select " +
      "date_time as journal_date," +
      "journal_id as journal_id," +
      "ref_no as ref_no," +
      "coa_detail as detail," +
      "coa_id as ledger_id," +
      "drcr as drcr," +
      "amount as amount ," +
      "account_id as account_id " +
      "from journals " +
      "where ref_no = :ref_no " +
      "order by date_time,journal_id",
      {
        replacements: {
                        ref_no: req.body.ref_no
                      },
        type: Sequelize.QueryTypes.SELECT
      })
      .then(function(data) {
        console.log(data);
        res.json(data);
      });

}


exports.GetBroughtForward = function(req,res){
    models.sequelize.query(
      "select " +
      "date_time as journal_date," +
      "journal_id as journal_id," +
      "ref_no as ref_no," +
      "coa_detail as detail," +
      "coa_id as ledger_id," +
      "drcr as drcr," +
      "amount as amount ," +
      "account_id as account_id " +
      "from journals " +
      "where account_id = :account_id " +
      "order by date_time,journal_id",
      {
        replacements: {
                        account_id: 0
                      },
        type: Sequelize.QueryTypes.SELECT
      })
      .then(function(data) {
        if(data.length == 0 ) CreateDefaultBroughtForward();
        console.log(data);
        res.json(data);
      });

}

function CreateDefaultBroughtForward(){
  models.journals.create({
    journal_id: 0,
    journal_no: 1,
    ref_no: 0,
    coa_detail: "ยอดยกมาในอดีต",
    coa_id: "",
    drcr: "3",
    amount: 0,
    date_time: new Date(0),
    account_id:0,
    user_create:"10001",
    date_create:new Date()
  })
  .then(function(data){
    console.log(data);
    res.json(data);
  })
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


exports.CheckRefNo = function(req,res,next){
    models.journals.findAll(
      {
        where:
              {
                ref_no:req.body[0].ref_no
              }
      })
    .then(function(data){
      if(data.length){
        res.json([{"message":"duplicate"}]);
      }else{
        next();
      }
    });
}

exports.AddJournals = function(req,res){
    models.journals.max("journal_id").then((max)=>{
      // check max of journal_id
      var id = isNaN(max) ? 1 : (max+1);

      // define
      user_id = req.session.user_id;


      req.body.forEach((data,index)=>{
          models.journals.create({
            journal_id: id,
            journal_no: index+1,
            ref_no: data.ref_no,
            coa_detail: data.coa_detail,
            coa_id: data.coa_id,
            drcr: data.drcr,
            amount: data.amount,
            date_time: data.date_time,
            account_id:data.account_id,
            user_create:user_id,
            date_create:new Date()
          });
      });

      console.log(req.body);
      res.json([{"message":"success"}]);
    });

}


exports.UpdateJournals = function(req,res){
  var journal_id = "";
  models.journals.findAll(
    {
      where:
            {
              ref_no:req.body[0].ref_no
            }
    })
  .then(function(data){
    if(data.length){
      journal_id = data[0].journal_id;
      _.map(req.body,i => {
        i.user_create = data[0].user_create;
        i.date_create = data[0].date_create;
      });
      models.journals.destroy({
        where: {
                  journal_id: journal_id
               }
      })
      .then(function(data){
          // define
          user_id = req.session.user_id;

          req.body.forEach((data,index)=>{
              models.journals.create({
                journal_id: journal_id,
                journal_no: index+1,
                ref_no: data.ref_no,
                coa_detail: data.coa_detail,
                coa_id: data.coa_id,
                drcr: data.drcr,
                amount: data.amount,
                date_time: data.date_time,
                account_id:data.account_id,
                user_create:data.user_create,
                date_create:data.date_create,
                user_update:user_id,
                date_update:new Date()
              });
          });

          console.log(req.body);
          res.json([{"message":"success"}]);
      });
    }else{
      res.send("journal_id not found");
    }
  });
}




exports.ShowDetails = function(req,res){

      models.sequelize.query(
        "select " +
        "date_time as journal_date," +
        "journal_id as journal_id," +
        "ref_no as ref_no," +
        "coa_detail as detail," +
        "coa_id as ledger_id," +
        "drcr as drcr," +
        "amount as amount " +
        "from journals " +
        "where (date_time BETWEEN :datestart AND :dateend)  " +
        "order by date_time,journal_id",
        {
          replacements: {
                          datestart: req.body.datestart,
                          dateend: req.body.dateend
                        },
          type: Sequelize.QueryTypes.SELECT
        })
        .then(function(data) {
          console.log(data);
          res.json(data);
        });
}
