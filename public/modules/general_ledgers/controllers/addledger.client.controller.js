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
