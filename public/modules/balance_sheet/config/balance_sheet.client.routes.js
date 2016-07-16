angular.module("balance_sheet").config([
  "$stateProvider",
  function($stateProvider){
    var date = new Date();

    $stateProvider
    .state("searchbalance",{
      url:"/searchbalance",
      templateUrl:"/modules/balance_sheet/views/search_balance_sheet.html"
    })
    .state("balancesheet",{
      url:"/balancesheet",
      params: {
            campus_id:"1",
            datestart:date,
            dateend:date
        },
      templateUrl:"/modules/balance_sheet/views/balance_sheet.html"
    })
  }
]);
