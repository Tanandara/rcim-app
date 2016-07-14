angular.module("general_journals").controller("JournalDetailController",
["$scope","$http","$stateParams",
function($scope,$http,$stateParams){

  $scope.getJournalDetail = function(){
      $scope.datestart = $stateParams.datestart;
      $scope.dateend = $stateParams.dateend;
      $http({
        method: 'GET',
        url: $scope.dbURL + '/journal_detail'
      }).success(function(data, status) {
        $scope.journal_details = data;
      });
  }



  $scope.SumDrCr = function(drcr){
    var sum = 0;
      angular.forEach($scope.journal_details,function(item,index){
        if(item.drcr==drcr){
          sum += ((parseFloat(item.amount).toFixed(2))/1);
        }
      });
      return sum;
  }

}]);
