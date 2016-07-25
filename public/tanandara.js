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

$scope.checkJournalizing = function(){
  return !(_.size($scope.details) && ($scope.Dr ==$scope.Cr) && $scope.description && $scope.datejournal);
}
$scope.searchText = function(typedthings){
  console.log("Do something like reload data with this: " + typedthings );
    $http({
        method: 'GET',
        url:"https://rcim-json.herokuapp.com/ledgers/?q=" + typedthings
        }).success(function(data, status) {
            $scope.ledgersJSON = data;
            $scope.ledgersJSON.map(function(item){
              // เพิ่ม ledger detail   101 : เงินสด
              item.ledger_detail=item.ledger_id+" : "+item.ledger_name;
              item.ledger_name=item.ledger_name;
            });
            $scope.ledgers = _.map($scope.ledgersJSON, 'ledger_detail');
        });
}

$scope.selectedText = function(suggestion){
  console.log("Suggestion selected: " + suggestion ,
              _.find($scope.ledgersJSON, { 'ledger_detail':  suggestion })
  );
  $scope.ledger_id = _.find($scope.ledgersJSON, { 'ledger_detail':  suggestion }).ledger_id;
  $scope.ledger_name = _.find($scope.ledgersJSON, { 'ledger_detail':  suggestion }).ledger_name;
}

$scope.details = [];
$scope.getJournal = function(){
}


$scope.addDetail = function(){
    var transaction =   {
                          "detail":$scope.ledger_name,
                          "ledger_id":$scope.ledger_id || "X01",
                          "drcr":$scope.drcr,
                          "amount":$scope.amount
                        }
    $scope.details.push(transaction);
    // clear ค่าทิ้ง
    $scope.ledger_name = "";
    $scope.ledger_id  = "";
    $scope.detail  = "";
    $scope.drcr = "";
    $scope.amount = "";

}



$scope.SumDrCr = function(drcr){
  var sum = 0;
    angular.forEach($scope.details,function(item,index){
      if(item.drcr==drcr){
        sum += ((parseFloat(item.amount).toFixed(2))/1);
        // รวม DrCr ไว้เช็คตอนบันทึก
        if(drcr=="1"){
          $scope.Dr = sum ;
        }else{
          $scope.Cr = sum ;
        }
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
            campus_id:"1",
            ledger_id:"101",
            datestart:date,
            dateend:date
        },
      controller:"LedgerDetailController"
    })

  }
]);

angular.module("general_ledgers").controller("LedgersController",
["$scope","$http","$state",
function($scope,$http,$state){

  // $scope.getLedgers = function(){
  //     $http({
  //       method: 'GET',
  //       url: $scope.dbURL + '/ledgers'
  //     }).success(function(data, status) {
  //       $scope.ledgers = data;
  //     });
  // }
  //
  // $scope.goLedgerDetail = function(id){
  //   location.href = "#!/ledgers/" + id;
  // }




  $scope.datestart = moment().format("DD/MM/YYYY");
  $scope.dateend = moment().format("DD/MM/YYYY");

  $scope.checkSearchLedger = function(){
    return !($scope.campus_id && $scope.datestart && $scope.dateend && $scope.ledger_id );
  }

  $scope.viewLedgerDetails = function(){
    //location.href = "#!/ledgers/" + $scope.ledger_id;
    $state.go("ledgerdetail",{
      campus_id:$scope.campus_id,
      ledger_id:"101",
      datestart:$scope.datestart,
      dateend:$scope.dateend
    });

  }


  $scope.searchText = function(typedthings){
    console.log("Do something like reload data with this: " + typedthings );
      $http({
          method: 'GET',
          url:"https://rcim-json.herokuapp.com/ledgers/?q=" + typedthings
          }).success(function(data, status) {
              $scope.ledgersJSON = data;
              $scope.ledgersJSON.map(function(item){
                // เพิ่ม ledger detail   101 : เงินสด
                item.ledger_detail=item.ledger_id+" : "+item.ledger_name;
                item.ledger_name=item.ledger_name;
              });
              $scope.ledgers = _.map($scope.ledgersJSON, 'ledger_detail');
          });
  }

  $scope.selectedText = function(suggestion){
    console.log("Suggestion selected: " + suggestion ,
                _.find($scope.ledgersJSON, { 'ledger_detail':  suggestion })
    );
    $scope.ledger_id = _.find($scope.ledgersJSON, { 'ledger_detail':  suggestion }).ledger_id;
    $scope.ledger_name = _.find($scope.ledgersJSON, { 'ledger_detail':  suggestion }).ledger_name;
  }


}]);

angular.module("general_ledgers").controller("LedgerDetailController",
["$scope","$http","$stateParams",
function($scope,$http,$stateParams){

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
  $scope.getLedgers = function(){
      $http({
        method: 'GET',
        url: $scope.dbURL + '/ledgers'
      }).success(function(data, status) {
        $scope.ledgers = data;
      });
  }

  $scope.currentCheck = function(){
    switch ($scope.coa) {
      case "1":
      $scope.coa_text ="สินทรัพย์";
        break;
      case "2":
      $scope.coa_text ="หนี้สิน";
        break;
      default:
      $scope.current = "";
      $scope.coa_text = "";
        break
    }
  }

  $scope.checkData = function(){
    if($scope.coa=='1' || $scope.coa=='2'){
      return !($scope.coa && $scope.ledger_id && $scope.ledger_name && $scope.current);
    }else{
      return !($scope.coa && $scope.ledger_id && $scope.ledger_name );
    }
  }




}]);

angular.module("trial_balance",[]);

angular.module("trial_balance").config([
  "$stateProvider",
  function($stateProvider){
    var date = new Date();

    $stateProvider
    .state("searchtrial",{
      url:"/searchtrial",
      templateUrl:"/modules/trial_balance/views/search_trial_balance.html"
    })
    .state("trialbalance",{
      url:"/trialbalance",
      params: {
            campus_id:"1",
            datestart:date,
            dateend:date
        },
      templateUrl:"/modules/trial_balance/views/trial_balance.html"
    })
  }
]);

angular.module("trial_balance").controller("SearchTrialController",
["$scope","$http","$state",
function($scope,$http,$state){
  $scope.datestart = moment().format("DD/MM/YYYY");
  $scope.dateend = moment().format("DD/MM/YYYY");


  $scope.checkCondition = function(){
    return !($scope.campus_id && $scope.datestart && $scope.dateend );
  }

  $scope.viewTrialBalance = function(){
    $state.go("trialbalance",{
      campus_id:$scope.campus_id,
      datestart:$scope.datestart,
      dateend:$scope.dateend
    });
  }

  // $scope.getTrialMonth = function(){
  //     $http({
  //       method: 'GET',
  //       url: $scope.dbURL + '/trial_balance_month'
  //     }).success(function(data, status) {
  //       $scope.month = data;
  //
  //     });
  //
  // }
  //
  // $scope.getTrialYear = function(){
  //   $http({
  //     method: 'GET',
  //     url: $scope.dbURL + '/trial_balance_year'
  //   }).success(function(data, status) {
  //     $scope.year = data;
  //   });
  //
  // }




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

angular.module("balance_sheet",[]);

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
            date:date
        },
      templateUrl:"/modules/balance_sheet/views/balance_sheet.html"
    })
  }
]);

angular.module("balance_sheet").controller("BalanceSheetController",
["$scope","$http","$stateParams",
function($scope,$http,$stateParams){

}]);

angular.module("balance_sheet").controller("SearchBalanceSheetController",
["$scope","$http","$state",
function($scope,$http,$state){
  $scope.date = moment().format("DD/MM/YYYY");


  $scope.checkCondition = function(){
    return !($scope.campus_id && $scope.date);
  }

  $scope.viewBalanceSheet = function(){
    $state.go("balancesheet",{
      campus_id:$scope.campus_id,
      date:$scope.date
    });
  }
}]);

angular.module("profit_loss",[]);

angular.module("profit_loss").config([
  "$stateProvider",
  function($stateProvider){
    var date = new Date();

    $stateProvider
    .state("searchprofitloss",{
      url:"/searchprofitloss",
      templateUrl:"/modules/profit_loss/views/search_profit_loss.html"
    })
    .state("profitloss",{
      url:"/profitloss",
      params: {
            campus_id:"1",
            datestart:date,
            dateend:date
        },
      templateUrl:"/modules/profit_loss/views/profit_loss.html"
    })
  }
]);


angular.module("profit_loss").controller("SearchProfitLossController",
["$scope","$http","$state",
function($scope,$http,$state){
  $scope.datestart = moment().format("DD/MM/YYYY");
  $scope.dateend = moment().format("DD/MM/YYYY");


  $scope.checkCondition = function(){
    return !($scope.campus_id && $scope.datestart && $scope.dateend );
  }

  $scope.viewProfitLoss = function(){
    $state.go("profitloss",{
      campus_id:$scope.campus_id,
      datestart:$scope.datestart,
      dateend:$scope.dateend
    });
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
"autocomplete",
"core",
"dashboard",
"general_journals",
"general_ledgers",
"trial_balance",
"balance_sheet",
"profit_loss"]);


angular.module("Main")
.run(["$rootScope",function($rootScope){

  $rootScope.dbURL = "https://rcim-json.herokuapp.com";
  //$rootScope.dbURL = "http://localhost:3000";

    $rootScope
        .$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams){
                //console.log("State Change: transition begins!");
                $('.page-transition').toggleClass('loading');
        });

    $rootScope
        .$on('$stateChangeSuccess',
            function(event, toState, toParams, fromState, fromParams){
                //console.log("State Change: State change success!");
                $('.page-transition').toggleClass('loading');

        });

}]);
