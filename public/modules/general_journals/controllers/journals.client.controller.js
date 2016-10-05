angular.module("general_journals").controller("JournalsController",
["$scope","$http","$state",
function($scope,$http,$state){

  $scope.datestart = moment().format("DD/MM/YYYY");
  $scope.dateend = moment().format("DD/MM/YYYY");

  $scope.goDetail = function(tab){
    //location.href = "#!/journals/details"
    data = tab == 1 ?
          {
            datestart:$scope.datestart,
            dateend:$scope.dateend
          }:
          {
            ref_no:$scope.ref_no
          };
    $state.go("journaldetail",data);
  }

}]);
