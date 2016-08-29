var models  = require('../models');
var Sequelize  = require('sequelize');
var _ = require('lodash');




//Custom query
exports.Query = function(req,res){
    models.sequelize.query(
      `
      select
      coa_id,
      coa_detail,
      amount_dr,
      amount_cr,
      amount_dr - amount_cr as amount_total
      from
      (
      	select
      	coa_id,
      	coa_detail,
      	max(if(drcr=1,amount,0)) as amount_dr,
      	max(if(drcr=2,amount,0)) as amount_cr
      	from
      	(
      		select
      		coa_2digit.coa_id,
      		coa_2digit.coa_detail,
      		if(coa_sum.drcr is null,0,coa_sum.drcr) as drcr,
      		if(coa_sum.amount is null,0,coa_sum.amount) as amount
      		from (select * from coa where (coa_id regexp '^[4-5][1-9]00000000')) as coa_2digit
      		left outer join
      		(
      			select concat(substring(coa_id,1,2),'00000000') as grp_coa_id,drcr,sum(amount) as amount from
      			(	select * from journals
      				where date_time between :datestart and :dateend
      				and campus_id in (:campus_id)
      			) as journals
      			where drcr != 3
      			group by grp_coa_id,drcr
      		) as coa_sum
      		on coa_sum.grp_coa_id = coa_2digit.coa_id
      	) as trial_balance
      	group by coa_id,coa_detail
      ) as profit_loss
      `
      ,
      {
        replacements: {
                        datestart: req.body.datestart,
                        dateend: req.body.dateend,
                        campus_id : req.body.campus_id == 4 ? [1,2,3] : [req.body.campus_id]
                      },
        type: Sequelize.QueryTypes.SELECT
      })
      .then(function(data) {
        console.log(data);
        res.json(data);
      });



}
