angular.module("management").config([
  "$stateProvider",
  function($stateProvider){
    var date = moment().format("DD/MM/YYYY");

    $stateProvider
    .state("coa",{
      url:"/coa",
      templateUrl:"/modules/management/views/coa.html"
    })
    .state("account",{
      url:"/account",
      templateUrl:"/modules/management/views/account.html"
    })
    .state("broughtforward",{
      url:"/broughtforward",
      templateUrl:"/modules/management/views/broughtforward.html"
    })

  }
]);
