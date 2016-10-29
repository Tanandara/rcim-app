angular.module("general_ledgers").controller("LedgersController",
["$scope","$http","$state","DropdownList",
function($scope,$http,$state,DropdownList){

  // $scope.getLedgers = function(){
  //     $http({
  //       method: 'GET',
  //       url: $scope.dbURL + '/ledgers'
  //     }).success(function(data, status) {
  //       $scope.ledgers = data;
  //     });
  // }
  //
  // $scope.goLedgerDetail = function(id){
  //   location.href = "#!/ledgers/" + id;
  // }

  $scope.initFunction = function(){
    DropdownList.GET("account_list").then(function(data){$scope.accountList = data});
  }



  $scope.datestart = moment().format("DD/MM/YYYY");
  $scope.dateend = moment().format("DD/MM/YYYY");

  $scope.checkSearchLedger = function(){
    return !($scope.account_id && $scope.datestart && $scope.dateend && $scope.ledger_id );
  }

  $scope.viewLedgerDetails = function(){
    //location.href = "#!/ledgers/" + $scope.ledger_id;
    $state.go("ledgerdetail",{
      account_id:$scope.account_id,
      ledger_id:$scope.ledger_id,
      ledger_name:$scope.ledger_name,
      datestart:$scope.datestart,
      dateend:$scope.dateend
    });

  }


  $scope.searchText = function(typedthings){
    console.log("Do something like reload data with this: " + typedthings );
      $http({
          method: 'POST',
          url:"/coa",
          data:"search="+typedthings,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          }).success(function(data, status) {
              $scope.ledgersJSON = data;
              $scope.ledgersJSON.map(function(item){
                // เพิ่ม ledger detail   101 : เงินสด
                item.ledger_detail=item.coa_id+" : "+item.coa_detail;
                item.ledger_name=item.coa_detail;
                item.ledger_id=item.coa_id;
              });
              $scope.ledgers = _.map($scope.ledgersJSON, 'ledger_detail');
          });
  }

  $scope.selectedText = function(suggestion){
    console.log("Suggestion selected: " + suggestion ,
                _.find($scope.ledgersJSON, { 'ledger_detail':  suggestion })
    );
    $scope.ledger_id = _.find($scope.ledgersJSON, { 'ledger_detail':  suggestion }).ledger_id;
    $scope.ledger_name = _.find($scope.ledgersJSON, { 'ledger_detail':  suggestion }).ledger_name;
  }


}]);
