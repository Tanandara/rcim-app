angular.module("profit_loss").controller("ProfitLossController",
["$scope","$http","$stateParams",
function($scope,$http,$stateParams){


  $scope.initFunction = function(){
    $scope.datestart = $stateParams.datestart;
    $scope.dateend = $stateParams.dateend;
    $scope.account_id = $stateParams.account_id;
    $scope.account_name = $stateParams.account_name;
    $scope.year = $stateParams.year;

    if($scope.year != null){
      $scope.datestart = moment(new Date($scope.year,0,1)).format("DD/MM/YYYY");
      $scope.dateend = moment(new Date($scope.year,11,31)).format("DD/MM/YYYY");
    }

    $http({
      method: 'POST',
      url: '/profit_loss',
      data: {
        "datestart" : dateStringFormat($scope.datestart) ,
        "dateend" : dateStringFormat($scope.dateend) ,
        "account_id" : $scope.account_id
      }
    }).success(function(data, status) {
      $scope.profitloss = data;

            if($scope.year != null){
                  $http({
                    method: 'POST',
                    url: '/profit_loss',
                    data: {
                      "datestart" : dateStringFormat(moment(new Date($scope.year-1,0,1)).format("DD/MM/YYYY")) ,
                      "dateend" : dateStringFormat(moment(new Date($scope.year-1,11,31)).format("DD/MM/YYYY")) ,
                      "account_id" : $scope.account_id
                    }
                  }).success(function(data, status) {
                    data.forEach(function(value,index){
                      $scope.profitloss[index].prev_before_cr = value.before_cr;
                      $scope.profitloss[index].prev_before_dr = value.before_dr;
                      $scope.profitloss[index].prev_brought_forward = value.brought_forward;
                      $scope.profitloss[index].prev_carry_forward = value.carry_forward;
                      $scope.profitloss[index].prev_current_cr = value.current_cr;
                      $scope.profitloss[index].prev_current_dr = value.current_dr;
                    });
              });
      }
    });
  }

  $scope.profitFilter = function(i){
    return /^4/gm.test(i.coa_id);
  }

  $scope.lossFilter = function(i){
    return /^5/gm.test(i.coa_id);
  }

  $scope.sumProfitLoss = function(c){
    var sum=0 ;
    var pattern = c == 'Profit' ? /^4/ : /^5/;
    var carry_forward=0;
    _.each(_.filter($scope.profitloss, function(i){ return pattern.test(i.coa_id) } ) ,
     function(i) {
       carry_forward = i.carry_forward;
       if(/^4/.test(i.coa_id) && i.carry_forward < 0) carry_forward = (i.carry_forward *-1);
       sum += carry_forward
     });
    return sum;
  }

  $scope.sumPrevProfitLoss = function(c){
    var sum=0 ;
    var pattern = c == 'Profit' ? /^4/ : /^5/;
    var carry_forward=0;
    _.each(_.filter($scope.profitloss, function(i){ return pattern.test(i.coa_id) } ) ,
     function(i) {
       carry_forward = i.prev_carry_forward;
       if(/^4/.test(i.coa_id) && i.prev_carry_forward < 0) carry_forward = (i.prev_carry_forward *-1);
       sum += carry_forward
     });
    return sum;
  }

}]);
