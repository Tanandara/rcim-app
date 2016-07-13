angular.module("general_ledgers").config([
  "$stateProvider",
  function($stateProvider){
    $stateProvider
    .state("ledgers",{
      url:"/ledgers",
      templateUrl:"/modules/general_ledgers/views/ledgers.html"
    })
    .state("ledgerdetail",{
      url:"/ledgers/{ledger_id:int}",
      templateUrl:"/modules/general_ledgers/views/ledger_detail.html",
      controller:"LedgerDetailController"
    })
    .state("addledger",{
      url:"/ledgers/add",
      templateUrl:"/modules/general_ledgers/views/add_ledger.html",
      controller:"AddLedgerController"
    })
  }
]);
