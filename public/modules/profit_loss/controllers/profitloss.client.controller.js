angular.module("profit_loss").controller("ProfitLossController",
["$scope","$http","$stateParams",
function($scope,$http,$stateParams){


  $scope.initFunction = function(){
    $scope.datestart = $stateParams.datestart;
    $scope.dateend = $stateParams.dateend;
    $scope.account_id = $stateParams.account_id;
    $scope.account_name = $stateParams.account_name;
    $http({
      method: 'POST',
      url: 'https://rcim-app.herokuapp.com/profit_loss',
      data: {
        "datestart" : dateStringFormat($scope.datestart) ,
        "dateend" : dateStringFormat($scope.dateend) ,
        "account_id" : $scope.account_id
      }
    }).success(function(data, status) {
      $scope.profitloss = data;
    });
  }

  $scope.profitFilter = function(i){
    return /^4/gm.test(i.coa_id);
  }

  $scope.lossFilter = function(i){
    return /^5/gm.test(i.coa_id);
  }

  $scope.sumProfitLoss = function(c){
    var sum=0 ;
    var pattern = c == 'Profit' ? /^4/ : /^5/;
    var carry_forward=0;
    _.each(_.filter($scope.profitloss, i => pattern.test(i.coa_id) ) ,
     i => {
       carry_forward = i.carry_forward;
       if(/^4/.test(i.coa_id) && i.carry_forward < 0) carry_forward = (i.carry_forward *-1);
       sum += carry_forward
     });
    return sum;
  }

}]);
