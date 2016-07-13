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
