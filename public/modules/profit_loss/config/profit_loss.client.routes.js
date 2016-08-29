angular.module("profit_loss").config([
  "$stateProvider",
  function($stateProvider){
    var date = moment().format("DD/MM/YYYY");

    $stateProvider
    .state("searchprofitloss",{
      url:"/searchprofitloss",
      templateUrl:"/modules/profit_loss/views/search_profit_loss.html"
    })
    .state("profitloss",{
      url:"/profitloss",
      params: {
            campus_id:"4",
            datestart:date,
            dateend:date
        },
      templateUrl:"/modules/profit_loss/views/profit_loss.html"
    })
  }
]);
