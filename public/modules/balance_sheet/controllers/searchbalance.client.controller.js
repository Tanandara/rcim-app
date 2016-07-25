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
