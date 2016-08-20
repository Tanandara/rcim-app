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
    models.sequelize.query("SELECT * FROM coa where coa_id like :search or coa_detail like :search", 
        {
          replacements: { search: "%"+req.body.search+"%" },
          type: Sequelize.QueryTypes.SELECT
        })
        .then(function(users) {
          console.log(users);
          res.json(users);
        });

}
