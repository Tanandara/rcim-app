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
