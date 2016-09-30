angular.module("general_ledgers").config([
  "$stateProvider",
  function($stateProvider){
    var date = new Date();

    $stateProvider
    .state("ledgers",{
      url:"/ledgers",
      templateUrl:"/modules/general_ledgers/views/ledgers.html"
    })
    .state("addledger",{
      url:"/ledgers/add",
      templateUrl:"/modules/general_ledgers/views/add_ledger.html",
      controller:"AddLedgerController"
    })
    .state("ledgerdetail",{
      url:"/ledgers/detail",
      templateUrl:"/modules/general_ledgers/views/ledger_detail.html",
      params: {
            account_id:"1",
            ledger_id:"101",
            datestart:date,
            dateend:date
        },
      controller:"LedgerDetailController"
    })

  }
]);
