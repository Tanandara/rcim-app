angular.module("profit_loss").controller("ProfitLossController",
["$scope","$http","$stateParams",
function($scope,$http,$stateParams){
  $scope.datestart = $stateParams.datestart;
  $scope.dateend = $stateParams.dateend;
  $scope.campus_id = $stateParams.campus_id;
  $scope.campus_name = $scope.campus_id == "1" ? "ศาลายา"     :
                       $scope.campus_id == "2" ? "วังไกลกังวล"  :
                       $scope.campus_id == "3" ? "บพิตรพิมุข"   :
                                                 "ทุกวิทยาเขต" ;

  $scope.getProfitLoss = function(){
    $http({
      method: 'POST',
      url: 'https://rcim-app.herokuapp.com/profit_loss',
      data: {
        "datestart" : dateStringFormat($scope.datestart) ,
        "dateend" : dateStringFormat($scope.dateend) ,
        "campus_id" : $stateParams.campus_id
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
    _.each(_.filter($scope.profitloss, i => pattern.test(i.coa_id) ) , i => sum+=i.amount_total);
    return sum;
  }

}]);
