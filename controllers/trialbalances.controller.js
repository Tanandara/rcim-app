var models  = require('../models');
var Sequelize  = require('sequelize');
var _ = require('lodash');




//Custom query
exports.Query = function(req,res){
    req.body.account_id = isNaN(req.body.account_id) ? 1 : req.body.account_id ;
    var account_id = req.body.account_id == 0 ? 'select account_id from accounts' :  req.body.account_id;
    console.log("account_id :",req.body.account_id);
    models.sequelize.query(
      `
      select
      trial.coa_id,
      trial.coa_detail,
      brought_forward.amount_dr as before_dr,
      brought_forward.amount_cr as before_cr,
      brought_forward.amount_dr - brought_forward.amount_cr as brought_forward ,
      trial.amount_dr as current_dr,
      trial.amount_cr as current_cr,
      if((brought_forward.amount_dr - brought_forward.amount_cr ) < 0 ,
      trial.amount_dr - ( ((brought_forward.amount_dr - brought_forward.amount_cr ) *-1 )+ trial.amount_cr),
      (trial.amount_dr + (brought_forward.amount_dr - brought_forward.amount_cr )) - trial.amount_cr
      ) as carry_forward
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
      			from (select * from coa where (coa_id regexp '^[1-5][1-9][0-9][1-9]000000|^5[3-4]0{8}')) as coa_2digit
      			left outer join
      			(
      				select concat(substring(coa_id,1,4),'000000') as grp_coa_id,drcr,sum(amount) as amount from
      				(	select * from journals
      					where date_time between :datestart and :dateend
      					and account_id=1
      				) as journals
      				where drcr != 3
      				group by grp_coa_id,drcr
      			) as coa_sum
      			on coa_sum.grp_coa_id = coa_2digit.coa_id
      		) as trial_balance
      		group by coa_id,coa_detail
      ) as trial
      left outer join
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
      			from (select * from coa where (coa_id regexp '^[1-5][1-9][0-9][1-9]000000|^5[3-4]0{8}')) as coa_2digit
      			left outer join
      			(
      				select concat(substring(coa_id,1,4),'000000') as grp_coa_id,drcr,sum(amount) as amount from
      				(	select * from journals
      					where date_time < :datestart
      					and account_id in (`+ account_id +`)
      				) as journals
      				where drcr != 3
      				group by grp_coa_id,drcr
      			) as coa_sum
      			on coa_sum.grp_coa_id = coa_2digit.coa_id
      		) as trial_balance
      		group by coa_id,coa_detail
      ) as brought_forward
      on brought_forward.coa_id = trial.coa_id
      `
      ,
      {
        replacements: {
                        datestart: req.body.datestart,
                        dateend: req.body.dateend
                      },
        type: Sequelize.QueryTypes.SELECT
      })
      .then(function(data) {
        //console.log(data);
        res.json(data);
      });
}







// exports.Query = function(req,res){
//     models.sequelize.query(
//       `
//       select
//       coa_id,
//       coa_detail,
//       max(if(drcr=1,amount,0)) as amount_dr,
//       max(if(drcr=2,amount,0)) as amount_cr
//       from
//       (
//       	select
//       	coa_2digit.coa_id,
//       	coa_2digit.coa_detail,
//       	if(coa_sum.drcr is null,0,coa_sum.drcr) as drcr,
//       	if(coa_sum.amount is null,0,coa_sum.amount) as amount
//       	from (select * from coa where (coa_id regexp '^[1-5][1-9]00000000')) as coa_2digit
//       	left outer join
//       	(
//       		select concat(substring(coa_id,1,2),'00000000') as grp_coa_id,drcr,sum(amount) as amount from
//       		(	select * from journals
//       			where date_time between :datestart and :dateend
//       			and campus_id in (:campus_id)
//       		) as journals
//       		where drcr != 3
//       		group by grp_coa_id,drcr
//       	) as coa_sum
//       	on coa_sum.grp_coa_id = coa_2digit.coa_id
//       ) as trial_balance
//       group by coa_id,coa_detail
//       `
//       ,
//       {
//         replacements: {
//                         datestart: req.body.datestart,
//                         dateend: req.body.dateend,
//                         campus_id : req.body.campus_id == 4 ? [1,2,3] : [req.body.campus_id]
//                       },
//         type: Sequelize.QueryTypes.SELECT
//       })
//       .then(function(data) {
//         console.log(data);
//         res.json(data);
//       });
// }
