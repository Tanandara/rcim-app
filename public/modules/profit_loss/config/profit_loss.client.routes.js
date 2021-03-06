angular.module("profit_loss").config([
  "$stateProvider",
  function($stateProvider){
    var date = moment().format("DD/MM/YYYY");
    var year = moment().year();

    $stateProvider
    .state("searchprofitloss",{
      url:"/searchprofitloss",
      templateUrl:"/modules/profit_loss/views/search_profit_loss.html"
    })
    .state("profitloss",{
      url:"/profitloss",
      params: {
          account_id:"0",
          account_name:"บัญชีทั้งหมด",
          datestart:date,
          dateend:date
        },
      templateUrl:"/modules/profit_loss/views/profit_loss.html"
    })
    .state("profitloss-statement",{
      url:"/profitloss-statement",
      params: {
          account_id:"0",
          account_name:"บัญชีทั้งหมด",
          year:year
        },
      templateUrl:"/modules/profit_loss/views/profit_loss_statement.html"
    })
  }
]);
