angular.module("trial_balance").controller("TrialBalanceController",
["$scope","$http","$stateParams",
function($scope,$http,$stateParams){
  $scope.datestart = $stateParams.datestart;
  $scope.dateend = $stateParams.dateend;
  $scope.campus_id = $stateParams.campus_id;
  $scope.campus_name = $scope.campus_id == "1" ? "ศาลายา"     :
                       $scope.campus_id == "2" ? "วังไกลกังวล"  :
                       $scope.campus_id == "3" ? "บพิตรพิมุช"   :
                                                 "ทุกวิทยาเขต" ;

  $scope.getTrialBalance = function(){
    $http({
      method: 'POST',
      url: 'https://rcim-app.herokuapp.com/trial_balance',
      data: {
        "datestart" : dateStringFormat($scope.datestart) ,
        "dateend" : dateStringFormat($scope.dateend) ,
        "campus_id" : $stateParams.campus_id
      }
    }).success(function(data, status) {
      $scope.trial = data;
    });
  }

  $scope.SumDrCr = function(drcr){
    var sum = 0;
    angular.forEach($scope.trial,function(item,index){
        sum += ((parseFloat(drcr == "1" ? item.amount_dr : item.amount_cr ).toFixed(2))/1);
    });
    return sum;
  }






}]);
