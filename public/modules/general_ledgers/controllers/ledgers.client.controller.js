angular.module("general_ledgers").controller("LedgersController",
["$scope","$http","$state",
function($scope,$http,$state){

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




  $scope.datestart = moment().format("DD/MM/YYYY");
  $scope.dateend = moment().format("DD/MM/YYYY");

  $scope.checkSearchLedger = function(){
    return !($scope.campus_id && $scope.datestart && $scope.dateend && $scope.ledger_id );
  }

  $scope.viewLedgerDetails = function(){
    //location.href = "#!/ledgers/" + $scope.ledger_id;
    $state.go("ledgerdetail",{
      campus_id:$scope.campus_id,
      ledger_id:"101",
      datestart:$scope.datestart,
      dateend:$scope.dateend
    });

  }


  $scope.searchText = function(typedthings){
    console.log("Do something like reload data with this: " + typedthings );
      $http({
          method: 'GET',
          url:"https://rcim-json.herokuapp.com/ledgers/?q=" + typedthings
          }).success(function(data, status) {
              $scope.ledgersJSON = data;
              $scope.ledgersJSON.map(function(item){
                // เพิ่ม ledger detail   101 : เงินสด
                item.ledger_detail=item.ledger_id+" : "+item.ledger_name;
                item.ledger_name=item.ledger_name;
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
