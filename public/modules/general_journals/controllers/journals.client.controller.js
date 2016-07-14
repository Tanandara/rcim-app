angular.module("general_journals").controller("JournalsController",
["$scope","$http","$state",
function($scope,$http,$state){

  $scope.datestart = moment().format("DD/MM/YYYY");
  $scope.dateend = moment().format("DD/MM/YYYY");
  $scope.getJournals = function(){
      $http({
        method: 'GET',
        url: $scope.dbURL + '/journals'
      }).success(function(data, status) {
        $scope.journals = data;
      });
  }

  $scope.goDetail = function(){
    //location.href = "#!/journals/details"
    $state.go("journaldetail",
    {
      datestart:$scope.datestart,
      dateend:$scope.dateend
    });
  }

}]);
