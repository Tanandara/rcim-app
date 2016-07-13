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
