angular.module("general_journals").controller("JournalizingController",
["$scope","$http",
function($scope,$http){

$scope.details = [];
$scope.getJournal = function(){
    // $http({
    //   method: 'GET',
    //   url: $scope.dbURL + '/general_journals'
    // }).success(function(data, status) {
    //   $scope.journal_details = data;
    // });
}


$scope.addDetail = function(){
    var transaction =   {
                          "detail":$scope.detail,
                          "ledger_id":$scope.ledger_id || "X01",
                          "drcr":$scope.drcr,
                          "amount":$scope.amount
                        }
    $scope.details.push(transaction);
    // clear ค่าทิ้ง
    $scope.detail = "";
    $scope.ledger_id  = "";
    $scope.drcr = "";
    $scope.amount = "";

}



$scope.SumDrCr = function(drcr){
  var sum = 0;
    angular.forEach($scope.details,function(item,index){
      if(item.drcr==drcr){
        sum += ((parseFloat(item.amount).toFixed(2))/1);
      }
    });
    return sum;
}







}]);
