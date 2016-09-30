angular.module("general_ledgers").controller("LedgerDetailController",
["$scope","$http","$stateParams",
function($scope,$http,$stateParams){

  $scope.broughtForward = function(){
    var value = 13000;
    return value < 0 ? (value*-1) + " (Cr)" : value + " (Dr)" ;
  }
  $scope.carryForward = function(){
    if(/Dr/.test($scope.broughtForward())){
      return ( $scope.SumDrCr("1") +  parseInt($scope.broughtForward().replace(/[^\d]+/,"")) ) - $scope.SumDrCr("2")
    }else{

      return $scope.SumDrCr("1") - ( parseInt($scope.broughtForward().replace(/[^\d]+/,""))  + $scope.SumDrCr("2") )
    }
  }
  $scope.details =
  [
    {"journal_date":"2016-09-30","ref_no":"59/0001","detail":"จ่ายค่าอะไรสักอย่าง","drcr":"2","amount":"5000"},
    {"journal_date":"2016-09-30","ref_no":"59/0002","detail":"จ่ายค่าอะไรสักอย่าง","drcr":"2","amount":"6000"},
    {"journal_date":"2016-09-30","ref_no":"59/0003","detail":"จ่ายค่าอะไรสักอย่าง","drcr":"2","amount":"7000"},
    {"journal_date":"2016-09-31","ref_no":"59/0004","detail":"ได้รับเงินจากการขาย","drcr":"1","amount":"8000"},
    {"journal_date":"2016-09-31","ref_no":"59/0005","detail":"จ่ายค่าอะไรสักอย่าง","drcr":"2","amount":"5000"},
    {"journal_date":"2016-10-01","ref_no":"59/0006","detail":"ได้รับเงินจากการขาย","drcr":"1","amount":"6000"},
    {"journal_date":"2016-10-02","ref_no":"59/0007","detail":"จ่ายค่าอะไรสักอย่าง","drcr":"2","amount":"1000"}
  ]

  $scope.getLedgerDetail = function(){
      // $http({
      //   method: 'GET',
      //   url: $scope.dbURL + '/ledger_detail?q='
      // }).success(function(data, status) {
      //   $scope.ledger = data;
      // });
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
