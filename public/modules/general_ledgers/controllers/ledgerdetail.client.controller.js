angular.module("general_ledgers").controller("LedgerDetailController",
["$scope","$http","$stateParams",
function($scope,$http,$stateParams){


  $scope.initFunction = function(){
    $scope.datestart = $stateParams.datestart;
    $scope.dateend = $stateParams.dateend;
    $scope.coa_id = $stateParams.ledger_id;
    $scope.ledger_name = $stateParams.ledger_name;
    $scope.account_id = $stateParams.account_id;
    $scope.account_name = $stateParams.account_name;
    $http({
      method: 'POST',
      url: 'https://rcim-app.herokuapp.com/ledger/brought_forward',
      data: {
              "datestart" : dateStringFormat($scope.datestart) ,
              "coa_id" : $scope.coa_id,
              "account_id" : $scope.account_id
            }
    }).success(function(data, status) {
      $scope.brought_forward = data[0].brought_forward;
    });


    $http({
      method: 'POST',
      url: 'http://rcim-app.herokuapp.com/ledger',
      data: {
              "datestart" : dateStringFormat($scope.datestart) ,
              "dateend" : dateStringFormat($scope.dateend) ,
              "coa_id" : $scope.coa_id ,
              "account_id" : $scope.account_id
            }
    }).success(function(data, status) {
      data.map(function(i){ i.date_time = moment(i.date_time).format("DD/MM/YYYY")});
      $scope.details =  data;
    });


  }

  $scope.broughtForward = function(){
    var value = $scope.brought_forward;
    return value == 0 ? value      + ""      :
           value < 0  ? (value*-1) + " (Cr)" :
                        value      + " (Dr)" ;
  }

  $scope.carryForward = function(){
    var broughtForward = $scope.brought_forward;
    var sumDr = $scope.SumDrCr("1");
    var sumCr = $scope.SumDrCr("2");

    var carryForward = /Dr/.test($scope.broughtForward()) ?
                      ( sumDr +  broughtForward )  - sumCr :
                      sumDr - ((broughtForward*-1) + sumCr ) ;

    // console.log("broughtForward:",broughtForward,
    //             "sumDr:",sumDr,
    //             "sumCr:",sumCr,
    //             "carryForward:",carryForward);

    return carryForward == 0 ? carryForward                :
           carryForward <  0 ? (carryForward*-1) + " (Cr)" :
                               carryForward      + " (Dr)" ;
  }



  $scope.SumDrCr = function(drcr){
    var sum = 0;
      angular.forEach($scope.details,function(item,index){
        if(item.drcr==drcr){
          sum += ((parseFloat(item.amount).toFixed(2))/1);
          //console.log(sum);
        }
      });
      return sum;
  }



}]);
