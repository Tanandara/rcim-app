angular.module("trial_balance").controller("SearchTrialController",
["$scope","$http","$state","DropdownList",
function($scope,$http,$state,DropdownList){
  $scope.datestart = moment().format("DD/MM/YYYY");
  $scope.dateend = moment().format("DD/MM/YYYY");


  $scope.checkCondition = function(){
    return !($scope.account_id && $scope.datestart && $scope.dateend );
  }

  $scope.viewTrialBalance = function(){
    $state.go("trialbalance",{
      account_id:$scope.account_id,
      datestart:$scope.datestart,
      dateend:$scope.dateend
    });
  }

  $scope.initFunction = function(){
    DropdownList.GET("account_list").then(function(data){$scope.accountList = data});
  }




}]);
