angular.module("general_journals").controller("JournalDetailController",
["$scope","$http","$stateParams",
function($scope,$http,$stateParams){

  $scope.getJournalDetail = function(){
      $scope.datestart = $stateParams.datestart;
      $scope.dateend = $stateParams.dateend;
      $http({
        method: 'POST',
        url: 'https://rcim-app.herokuapp.com/journal_detail',
        data: {"datestart" : dateStringFormat($scope.datestart) ,"dateend" : dateStringFormat($scope.dateend)}
      }).success(function(data, status) {
        data.map(function(i){ i.journal_date = moment(i.journal_date).format("DD/MM/YYYY")});
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
