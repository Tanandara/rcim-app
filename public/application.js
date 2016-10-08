angular.module("Main",[]);
angular.module("Main",
['ui.router',
"ngAnimate",
"ui.bootstrap",
"autocomplete",
"core",
"dashboard",
"general_journals",
"general_ledgers",
"trial_balance",
"balance_sheet",
"profit_loss",
"users",
"management",
"service"]);


angular.module("Main")
.run(["$rootScope","$state","$http",function($rootScope,$state,$http){

  $rootScope.dbURL = "https://rcim-json.herokuapp.com";
  //$rootScope.dbURL = "http://localhost:3000";

    $rootScope
        .$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams){
                //console.log("State Change: transition begins!");
                $('.page-transition').toggleClass('loading');
                //console.log("toState:",toState,"toParams:", toParams,"fromState:", fromState,"fromParams:" ,fromParams);
        });

    $rootScope
        .$on('$stateChangeSuccess',
            function(event, toState, toParams, fromState, fromParams){
                //console.log("State Change: State change success!");
                //console.log("toState:",toState,"toParams:", toParams,"fromState:", fromState,"fromParams:" ,fromParams);
                $('.page-transition').toggleClass('loading');
                check_permission($http,$state,toState);
        });

}]);
