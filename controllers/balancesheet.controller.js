var models  = require('../models');
var Sequelize  = require('sequelize');
var _ = require('lodash');
var moment = require('moment');




//Custom query
exports.Query = function(req,res){
    //var datestart = moment(new Date(0)).format("YYYY-MM-DD");
    req.body.account_id = isNaN(req.body.account_id) ? 1 : req.body.account_id ;
    var account_id = req.body.account_id == 0 ? 'select account_id from accounts union select 0' :  [0,req.body.account_id];
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
      		from (select * from coa where (coa_id regexp '^[1-3][1-9][0-9][1-9]000000')) as coa_2digit
      		left outer join
      		(
      			select concat(substring(coa_id,1,4),'000000') as grp_coa_id,drcr,sum(amount) as amount from
      			(	select * from journals
      				where date_time <= :dateend
      				and account_id in (` + account_id + `)
      			) as journals
      			where drcr != 3
      			group by grp_coa_id,drcr
      		) as coa_sum
      		on coa_sum.grp_coa_id = coa_2digit.coa_id
      	) as trial_balance
      	group by coa_id,coa_detail
      ) as balance_sheet
      `
      ,
      {
        replacements: {
                        dateend: req.body.dateend
                      },
        type: Sequelize.QueryTypes.SELECT
      })
      .then(function(data) {
        console.log(data);
        res.json(data);
      });



}
