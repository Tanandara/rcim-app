var models  = require('../models');
var Sequelize  = require('sequelize');
var _ = require('lodash');




//Custom query
exports.Query = function(req,res){
    req.body.coa_id = req.body.coa_id.replace(/0{6}$|0{4}$|0{2}$/,"");
    models.sequelize.query(
      `
      select
      a.coa_id,
      a.date_time,
      a.ref_no,
      b.coa_detail as detail,
      a.drcr,
      sum(a.amount) as amount
      from journals as a
      left outer join
      (select ref_no,coa_detail from journals where drcr = 3) as b
      on a.ref_no = b.ref_no
      where a.coa_id regexp :coa_id and a.account_id = :account_id and a.date_time between :datestart and :dateend
      group by date_time,ref_no,detail,drcr
      order by a.date_time
      `
      ,
      {
        replacements: {
                        datestart: req.body.datestart,
                        dateend: req.body.dateend,
                        coa_id: '^' + req.body.coa_id,
                        account_id : req.body.account_id
                      },
        type: Sequelize.QueryTypes.SELECT
      })
      .then(function(data) {
        console.log(data);
        res.json(data);
      });
}


exports.BroughtForward = function(req,res){
    req.body.coa_id = req.body.coa_id.replace(/0{6}$|0{4}$|0{2}$/,"");
    models.sequelize.query(
      `
      select Dr - Cr as brought_forward from
        (
        	select if(sumDr.sum is null , 0 , sumDr.sum) as Dr,if(sumCr.sum is null , 0 , sumCr.sum) as Cr from
        		  (
        			select
        			sum(amount) as sum
        			from
        			(
        					SELECT
        					a.coa_id,
        					a.date_time,
        					a.ref_no,
        					b.coa_detail as detail,
        					a.drcr,
        					sum(a.amount) as amount
        					FROM journals as a
        					left outer join
        					(select ref_no,coa_detail from journals where drcr = 3) as b
        					on a.ref_no = b.ref_no
        					where a.coa_id regexp :coa_id and ((a.account_id = :account_id and a.date_time < :datestart and a.drcr = 1) or (a.account_id ='0' and a.drcr = 1))
        					group by date_time,ref_no,detail,drcr
        					order by a.date_time
        			) as sumDr
        		  ) as sumDr
        		 cross join
        		 (
        			select
        			sum(amount) as sum
        			from
        			(
        					SELECT
        					a.coa_id,
        					a.date_time,
        					a.ref_no,
        					b.coa_detail as detail,
        					a.drcr,
        					sum(a.amount) as amount
        					FROM journals as a
        					left outer join
        					(select ref_no,coa_detail from journals where drcr = 3) as b
        					on a.ref_no = b.ref_no
        					where a.coa_id regexp :coa_id and ((a.account_id = :account_id and a.date_time < :datestart and a.drcr = 2) or (a.account_id ='0' and a.drcr = 2))
        					group by date_time,ref_no,detail,drcr
        					order by a.date_time
        			) as sumCr
        		 ) as sumCr
        ) as SumAll
      `
      ,
      {
        replacements: {
                        datestart: req.body.datestart,
                        coa_id: '^' + req.body.coa_id,
                        account_id : req.body.account_id
                      },
        type: Sequelize.QueryTypes.SELECT
      })
      .then(function(data) {
        console.log(data);
        res.json(data);
      });
}
