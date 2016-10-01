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
            account_name:"บัญชี MBA บิพิตรพิมุข",
            ledger_id:"1101000000",
            ledger_name:"บัญชีเงินสดและรายการเทียบเท่าเงินสด",
            datestart:date,
            dateend:date
        },
      controller:"LedgerDetailController"
    })

  }
]);
