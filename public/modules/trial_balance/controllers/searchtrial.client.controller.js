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
