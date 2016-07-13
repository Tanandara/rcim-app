angular.module("general_journals").controller("JournalizingController",
["$scope","$http",
function($scope,$http){
$scope.date = new Date();

$scope.getJournal = function(){
    $http({
      method: 'GET',
      url: $scope.dbURL + '/general_journals'
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
