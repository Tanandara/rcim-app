angular.module("general_journals").controller("JournalsController",
["$scope","$http",
function($scope,$http){

  $scope.getJournals = function(){
      $http({
        method: 'GET',
        url: $scope.dbURL + '/journals'
      }).success(function(data, status) {
        $scope.journals = data;
      });
  }


}]);
