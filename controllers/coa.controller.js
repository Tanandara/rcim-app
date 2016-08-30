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
// exports.GetCoa = function(req,res){
//     models.coa.findAll(
//       {
//         where:
//               {
//                 user_id:req.params.id
//               }
//       })
//     .then(function(data){
//       res.json(data);
//     });
// }




// Custom query
exports.Query = function(req,res){
    models.sequelize.query(
      `
      select * from
      (
      	select * from coa
        where coa_id like '%100%' or coa_detail like '%100%'
      ) as ledgers
      where coa_id regexp '^[1-5][1-9][0-9][1-9]'
      `
      ,
        {
          replacements: { search: "%"+req.body.search+"%" },
          type: Sequelize.QueryTypes.SELECT
        })
        .then(function(users) {
          console.log(users);
          res.json(users);
        });

}
