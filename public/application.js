angular.module("Main",[]);
angular.module("Main",
['ui.router',
"ngAnimate",
"ui.bootstrap",
"core",
"dashboard",
"general_journals",
"general_ledgers",
"trial_balance"]);


angular.module("Main")
.run(["$rootScope",function($rootScope){

  $rootScope.dbURL = "https://rcim-json.herokuapp.com";
  //$rootScope.dbURL = "http://localhost:3000"; 

    $rootScope
        .$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams){
                console.log("State Change: transition begins!");
                $('.page-transition').toggleClass('loading');
        });

    $rootScope
        .$on('$stateChangeSuccess',
            function(event, toState, toParams, fromState, fromParams){
                console.log("State Change: State change success!");
                $('.page-transition').toggleClass('loading');

        });

}]);