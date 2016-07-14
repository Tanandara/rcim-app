angular.module("core",[]);

angular.module("core").config([
  "$stateProvider",
  "$locationProvider",
  "$urlRouterProvider",
  function($stateProvider,$locationProvider,$urlRouterProvider){
    $locationProvider.hashPrefix("!");
    $urlRouterProvider.otherwise("/");
  }
]);

angular.module("general_journals",[]);

angular.module("general_journals").config([
  "$stateProvider",
  function($stateProvider){
    var date = new Date();

    $stateProvider
    .state("journalizing",{
      url:"/journalizing",
      templateUrl:"/modules/general_journals/views/journalizing.html"
    })
    .state("journals",{
      url:"/journals",
      templateUrl:"/modules/general_journals/views/journals.html"
    })
    .state("journaldetail",{
      url:"/journals/details",
      params: {
            datestart :date,
            dateend:date
        },
      templateUrl:"/modules/general_journals/views/journal_detail.html"
    });
  }
]);

angular.module("general_journals").controller("JournalizingController",
["$scope","$http",
function($scope,$http){
$scope.date = new Date();

$scope.getJournal = function(){
    $http({
      method: 'GET',
      url: $scope.dbURL + '/general_journals'
    }).success(function(data, status) {
      $scope.journal_details = data;
    });
}



$scope.SumDrCr = function(drcr){
  var sum = 0;
    angular.forEach($scope.journal_details,function(item,index){
      if(item.drcr==drcr){
        sum += ((parseFloat(item.amount).toFixed(2))/1);
        console.log(sum);
      }
    });
    return sum;
}







}]);

angular.module("general_journals").controller("JournalsController",
["$scope","$http","$state",
function($scope,$http,$state){

  $scope.datestart = moment().format("DD/MM/YYYY");
  $scope.dateend = moment().format("DD/MM/YYYY");
  $scope.getJournals = function(){
      $http({
        method: 'GET',
        url: $scope.dbURL + '/journals'
      }).success(function(data, status) {
        $scope.journals = data;
      });
  }

  $scope.goDetail = function(){
    //location.href = "#!/journals/details"
    $state.go("journaldetail",
    {
      datestart:$scope.datestart,
      dateend:$scope.dateend
    });
  }

}]);

angular.module("general_journals").controller("JournalDetailController",
["$scope","$http","$stateParams",
function($scope,$http,$stateParams){

  $scope.getJournalDetail = function(){
      $scope.datestart = $stateParams.datestart;
      $scope.dateend = $stateParams.dateend;
      $http({
        method: 'GET',
        url: $scope.dbURL + '/journal_detail'
      }).success(function(data, status) {
        $scope.journal_details = data;
      });
  }



  $scope.SumDrCr = function(drcr){
    var sum = 0;
      angular.forEach($scope.journal_details,function(item,index){
        if(item.drcr==drcr){
          sum += ((parseFloat(item.amount).toFixed(2))/1);
        }
      });
      return sum;
  }

}]);

angular.module("general_ledgers",[]);

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

angular.module("general_ledgers").controller("LedgersController",
["$scope","$http","$state",
function($scope,$http,$state){

  $scope.getLedgers = function(){
      $http({
        method: 'GET',
        url: $scope.dbURL + '/ledgers'
      }).success(function(data, status) {
        $scope.ledgers = data;
      });
  }

  $scope.goLedgerDetail = function(id){
    location.href = "#!/ledgers/" + id;
  }


}]);

angular.module("general_ledgers").controller("LedgerDetailController",
["$scope","$http",
function($scope,$http){

  $scope.getLedgerDetail = function(){
      $http({
        method: 'GET',
        url: $scope.dbURL + '/ledger_detail?q='
      }).success(function(data, status) {
        $scope.ledger = data;
      });
  }

  $scope.SumDrCr = function(drcr){
    var sum = 0;
      angular.forEach($scope.ledger,function(item,index){
        if(item.drcr==drcr){
          sum += ((parseFloat(item.amount).toFixed(2))/1);
          console.log(sum);
        }
      });
      return sum;
  }



}]);

angular.module("general_ledgers").controller("AddLedgerController",
["$scope","$http",
function($scope,$http){





}]);

angular.module("trial_balance",[]);

angular.module("trial_balance").config([
  "$stateProvider",
  function($stateProvider){
    $stateProvider
    .state("searchtrial",{
      url:"/searchtrial",
      templateUrl:"/modules/trial_balance/views/search_trial_balance.html"
    })
    .state("trialbalance",{
      url:"/trialbalance",
      templateUrl:"/modules/trial_balance/views/trial_balance.html"
    })
  }
]);

angular.module("trial_balance").controller("SearchTrialController",
["$scope","$http",
function($scope,$http){
  $scope.getTrialMonth = function(){
      $http({
        method: 'GET',
        url: $scope.dbURL + '/trial_balance_month'
      }).success(function(data, status) {
        $scope.month = data;

      });

  }

  $scope.getTrialYear = function(){
    $http({
      method: 'GET',
      url: $scope.dbURL + '/trial_balance_year'
    }).success(function(data, status) {
      $scope.year = data;
    });

  }




}]);

angular.module("trial_balance").controller("TrialBalanceController",
["$scope","$http",
function($scope,$http){


  $scope.getTrialBalance = function(){
    
    $http({
      method: 'GET',
      url: $scope.dbURL + '/trial_balance'
    }).success(function(data, status) {
      $scope.trial = data;
    });

  }

  $scope.SumDrCr = function(drcr){
    var sum = 0;
      angular.forEach($scope.trial,function(item,index){
        if(item.drcr==drcr){
          sum += ((parseFloat(item.amount).toFixed(2))/1);
          console.log(sum);
        }
      });
      return sum;
  }






}]);

angular.module("dashboard", []);

angular.module("dashboard").config([
  "$stateProvider",
  function($stateProvider){
    $stateProvider
    .state("dashboard",{
      url:"/dashboard",
      templateUrl:"/modules/dashboard/views/dashboard.client.view.ejs"
    });
  }
]);

angular.module("dashboard").controller("dashboardController",
["$scope","$http",function($scope,$http){
  $scope.yourName = "No Name";
  //var users_json = $http.get("/testjson");
}]);

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