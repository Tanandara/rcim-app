angular.module("general_journals").controller("SearchRefNoController",
["$scope","$http","$state",
function($scope,$http,$state){

  $scope.getJournals = function(){
      // $http({
      //   method: 'GET',
      //   url: $scope.dbURL + '/journals'
      // }).success(function(data, status) {
      //   $scope.journals = data;
      // });
  }

  $scope.goDetail = function(){
    //location.href = "#!/journals/details"
    $state.go("editjournal",
    {
      ref_no:$scope.ref_no
    });
  }

}]);
