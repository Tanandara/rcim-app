var models  = require('../models');
var Sequelize  = require('sequelize');
var _ = require('lodash');


// exports.GetAllCoa = function(req,res){
//     models.coa.findAll()
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
