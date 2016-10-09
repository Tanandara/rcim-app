angular.module("balance_sheet").controller("BalanceSheetController",
["$scope","$http","$stateParams",
function($scope,$http,$stateParams){


  $scope.initFunction = function(){
    $scope.dateend = $stateParams.dateend;
    $scope.account_id = $stateParams.account_id;
    $scope.account_name = $stateParams.account_name;
    $http({
      method: 'POST',
      url: 'https://rcim-app.herokuapp.com/balance_sheet',
      data: {
        "dateend" : dateStringFormat($scope.dateend) ,
        "account_id" : $scope.account_id
      }
    }).success(function(data, status) {
      $scope.balancesheet = data;
    });

  }



  $scope.currentAssetFilter = function(i){
    return /^11/.test(i.coa_id);
  }

  $scope.noncurrentAssetFilter = function(i){
    return /^12/.test(i.coa_id);
  }

  $scope.currentLiabilityFilter = function(i){
    return /^21/.test(i.coa_id);
  }

  $scope.noncurrentLiabilityFilter = function(i){
    return /^22/.test(i.coa_id);
  }

  $scope.shareholderFilter = function(i){
    return /^3/.test(i.coa_id);
  }

  $scope.sumBalance = function(c){
    var sum=0 ;
    var pattern = c == 'currentAsset'         ? /^11/    :
                  c == 'noncurrentAsset'      ? /^12/    :
                  c == 'Asset'                ? /^1/     :
                  c == 'currentLiability'     ? /^21/    :
                  c == 'noncurrentLiability'  ? /^22/    :
                  c == 'Liability'            ? /^2/     :
                  c == 'Shareholder'          ? /^3/     :
                                                /^[2-3]/ ;
    _.each(_.filter($scope.balancesheet, function(i){ pattern.test(i.coa_id) } ) , function(i){sum+=i.amount_total});
    return sum;
  }















}]);
