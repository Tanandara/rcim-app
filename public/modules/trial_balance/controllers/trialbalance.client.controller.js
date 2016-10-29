angular.module("trial_balance").controller("TrialBalanceController",
["$scope","$http","$stateParams",
function($scope,$http,$stateParams){

  $scope.sumBroughtForward = 0;
  $scope.sumDr = 0;
  $scope.sumCr = 0;
  $scope.sumCarryForward = 0;

  $scope.initFunction = function(){
    $scope.datestart = $stateParams.datestart;
    $scope.dateend = $stateParams.dateend;
    $scope.account_id = $stateParams.account_id;
    $scope.account_name = $stateParams.account_name;
    $http({
      method: 'POST',
      url: '/trial_balance',
      data: {
        "datestart" : dateStringFormat($scope.datestart) ,
        "dateend" : dateStringFormat($scope.dateend) ,
        "account_id" : $scope.account_id
      }
    }).success(function(data, status) {
      $scope.trial = data;
      _.map($scope.trial, function(i) {
        $scope.sumBroughtForward += i.brought_forward;
        $scope.sumDr += i.current_dr;
        $scope.sumCr += i.current_cr;
        $scope.sumCarryForward += i.carry_forward;
      })
    });
  }



  $scope.SumDrCr = function(drcr){
    var sum = 0;
    angular.forEach($scope.trial,function(item,index){
        sum += ((parseFloat(drcr == "1" ? item.current_dr : item.current_cr ).toFixed(2))/1);
    });
    return sum;
  }

  $scope.FormatDrCr = function(x){
    return x == 0 ? x                :
           x <  0 ? (x*-1) + ' (Cr)' :
                    x      + ' (Dr)' ;
  }






}]);
