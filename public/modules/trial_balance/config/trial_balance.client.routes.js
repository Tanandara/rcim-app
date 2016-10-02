angular.module("trial_balance").config([
  "$stateProvider",
  function($stateProvider){
    var date = moment().format("DD/MM/YYYY");

    $stateProvider
    .state("searchtrial",{
      url:"/searchtrial",
      templateUrl:"/modules/trial_balance/views/search_trial_balance.html"
    })
    .state("trialbalance",{
      url:"/trialbalance",
      params: {
            account_id:"0",
            datestart:date,
            dateend:date
        },
      templateUrl:"/modules/trial_balance/views/trial_balance.html"
    })
  }
]);
