angular.module("balance_sheet").controller("BalanceSheetController",
["$scope","$http","$stateParams",
function($scope,$http,$stateParams){
  $scope.date = $stateParams.date;
  $scope.campus_id = $stateParams.campus_id;
  $scope.campus_name = $scope.campus_id == "1" ? "ศาลายา"     :
                       $scope.campus_id == "2" ? "วังไกลกังวล"  :
                       $scope.campus_id == "3" ? "บพิตรพิมุข"   :
                                                 "ทุกวิทยาเขต" ;

  $scope.getProfitLoss = function(){
    $http({
      method: 'POST',
      url: 'http://localhost:3000/balance_sheet',
      data: {
        "dateend" : dateStringFormat($scope.date) ,
        "campus_id" : $stateParams.campus_id
      }
    }).success(function(data, status) {
      $scope.balancesheet = data;
    });
  }


  $scope.currentAssetFilter = function(i){
    return /^11/gm.test(i.coa_id);
  }

  $scope.noncurentAssetFilter = function(i){
    return /^12/gm.test(i.coa_id);
  }

  $scope.currentLiabilityFilter = function(i){
    return /^21/gm.test(i.coa_id);
  }

  $scope.noncurrentLiabilityFilter = function(i){
    return /^22/gm.test(i.coa_id);
  }

  $scope.shareholderFilter = function(i){
    return /^3/gm.test(i.coa_id);
  }

  $scope.sumBalance = function(c){
    var sum=0 ;
    var pattern = c == 'currentAsset'         ? /^11/    :
                  c == 'noncurrentAsset'      ? /^12/    :
                  c == 'Asset'                ? /^1/     :
                  c == 'currentLiability'     ? /^21/    :
                  c == 'noncurrentLiability'  ? /^22/    :
                  c == 'Liability'            ? /^22/    :
                  c == 'Shareholder'          ? /^3/     :
                                                /^[1-3]/ :
    _.each(_.filter($scope.profitloss, i => pattern.test(i.coa_id) ) , i => sum+=i.amount_total);
    return sum;
  }















}]);
