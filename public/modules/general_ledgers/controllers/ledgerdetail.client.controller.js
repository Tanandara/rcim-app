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
