angular.module("profit_loss").controller("SearchProfitLossController",
["$scope","$http","$state","DropdownList",
function($scope,$http,$state,DropdownList){
  $scope.datestart = moment().format("DD/MM/YYYY");
  $scope.dateend = moment().format("DD/MM/YYYY");


  $scope.checkCondition = function(){
    return !($scope.account_id && $scope.datestart && $scope.dateend );
  }

  $scope.viewProfitLoss = function(){
    $state.go("profitloss",{
      account_id:$scope.account_id,
      account_name:$scope.account_name,
      datestart:$scope.datestart,
      dateend:$scope.dateend
    });
  }

  $scope.initFunction = function(){
    DropdownList.GET("account_list").then(function(data){$scope.accountList = data});
    var years = [];
    for(var i=0;i<=10;i++) years.push(moment().year()-i);
    $scope.years = years;
  }


  $scope.onDropdownChange = function(){
    $scope.account_name = $("[name=account_id] option:selected").text();
  }



  $scope.viewProfitLoss2 = function(){
    $state.go("profitloss-statement",{
      account_id:$scope.account_id,
      account_name:$scope.account_name,
      year:$scope.year
    });
  }

  $scope.checkCondition2 = function(){
    return !($scope.account_id && $scope.year );
  }





}]);
