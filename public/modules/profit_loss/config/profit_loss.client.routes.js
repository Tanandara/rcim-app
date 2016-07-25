angular.module("profit_loss").config([
  "$stateProvider",
  function($stateProvider){
    var date = new Date();

    $stateProvider
    .state("searchprofitloss",{
      url:"/searchprofitloss",
      templateUrl:"/modules/profit_loss/views/search_profit_loss.html"
    })
    .state("profitloss",{
      url:"/profitloss",
      params: {
            campus_id:"1",
            datestart:date,
            dateend:date
        },
      templateUrl:"/modules/profit_loss/views/profit_loss.html"
    })
  }
]);
