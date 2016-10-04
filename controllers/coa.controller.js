var models  = require('../models');
var Sequelize  = require('sequelize');
var _ = require('lodash');


exports.GetAllCoa = function(req,res){
    models.coa.findAll()
    .then(function(data){
      res.json(data);
    });
}


exports.CreateCoa = function(req,res){
  models.coa.create({
      coa_id:req.body.coa_id,
      coa_detail:req.body.coa_detail,
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

exports.UpdateCoa = function(req,res){
  models.coa.update({
      coa_detail:req.body.coa_detail
     },{
     where: {
              coa_id: req.body.coa_id
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


exports.DeleteCoa = function(req,res){
  models.coa.destroy({
     where: {
                coa_id: req.body.coa_id
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
        where coa_id like :search or coa_detail like :search
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
