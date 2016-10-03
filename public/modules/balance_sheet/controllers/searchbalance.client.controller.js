angular.module("balance_sheet").controller("SearchBalanceSheetController",
["$scope","$http","$state","DropdownList",
function($scope,$http,$state,DropdownList){
  $scope.date = moment().format("DD/MM/YYYY");


  $scope.checkCondition = function(){
    return !($scope.account_id && $scope.date);
  }

  $scope.viewBalanceSheet = function(){
    $state.go("balancesheet",{
      account_id:$scope.account_id,
      account_name:$scope.account_name,
      dateend:$scope.date
    });
  }

  $scope.initFunction = function(){
    DropdownList.GET("account_list").then(function(data){$scope.accountList = data});
  }


  $scope.onDropdownChange = function(){
    $scope.account_name = $("[name=account_id] option:selected").text();
  }

}]);
