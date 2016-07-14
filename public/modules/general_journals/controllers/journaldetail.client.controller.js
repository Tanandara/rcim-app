angular.module("general_journals").controller("JournalDetailController",
["$scope","$http",
function($scope,$http){

  $scope.date = "14/07/2016";
  $scope.date2 = "15/07/2016";

  $scope.getJournalDetail = function(){
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
          console.log(sum);
        }
      });
      return sum;
  }

}]);
