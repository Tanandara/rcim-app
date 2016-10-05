var models  = require('../models');
var Sequelize  = require('sequelize');
var _ = require('lodash');


// exports.GetAllaccounts = function(req,res){
//     models.accounts.findAll()
//     .then(function(data){
//       res.json(data);
//     });
// }
//
exports.GetAllAccountsName = function(req,res){
    models.accounts.findAll(
      {
        attributes: ['account_id', 'account_name']
      })
    .then(function(data){
      res.json(data);
    });
}

exports.CreateAccount = function(req,res){
  models.accounts.create({
      account_id:req.body.account_id,
      account_name:req.body.account_name,
    })
    .then(function(data){
      console.log(data,data.length);
      //res.json(data);
      res.json({"message":"success"});
    })
    .catch(function(error) {
      console.log("catch",error);
      if(error.errors[0].message =="PRIMARY must be unique"){
        res.json({"message":"fail"});
      }
    });
}

exports.UpdateAccount = function(req,res){
  models.accounts.update({
      account_name:req.body.account_name
     },{
     where: {
              account_id:req.body.account_id
            }
     })
    .then(function(data){
      res.json({"message":"success"});
    })
    .catch(function(error) {
      console.log("catch",error);
      res.json({"message":"fail"});
    });
}


exports.DeleteAccount = function(req,res){
  models.accounts.destroy({
     where: {
                account_id:req.body.account_id
            }
     })
     .then(function(data){
       res.json({"message":"success"});
     })
     .catch(function(error) {
       console.log("catch",error);
       res.json({"message":"fail"});
     });
}





// Custom query
exports.Query = function(req,res){
    // models.sequelize.query(
    //   `
    //   select account_id,account_name from
    //   `
    //   ,
    //     {
    //       replacements: { search: "%"+req.body.search+"%" },
    //       type: Sequelize.QueryTypes.SELECT
    //     })
    //     .then(function(data) {
    //       console.log(data);
    //       res.json(data);
    //     });

}
