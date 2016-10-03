angular.module("balance_sheet").config([
  "$stateProvider",
  function($stateProvider){
    var date = moment().format("DD/MM/YYYY");

    $stateProvider
    .state("searchbalance",{
      url:"/searchbalance",
      templateUrl:"/modules/balance_sheet/views/search_balance_sheet.html"
    })
    .state("balancesheet",{
      url:"/balancesheet",
      params: {
            account_id:"0",
            account_name:"บัญชีทั้งหมด",
            dateend:date
        },
      templateUrl:"/modules/balance_sheet/views/balance_sheet.html"
    })
  }
]);
