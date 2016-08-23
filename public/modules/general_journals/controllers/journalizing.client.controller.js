angular.module("general_journals").controller("JournalizingController",
["$scope","$http","$uibModal",
function($scope,$http,$uibModal){

$scope.checkJournalizing = function(){
  return !(_.size($scope.details) && ($scope.Dr ==$scope.Cr) && $scope.description && $scope.datejournal);
}
$scope.searchText = function(typedthings){
  console.log("Do something like reload data with this: " + typedthings );
    // $http({
    //     method: 'GET',
    //     url:"https://rcim-json.herokuapp.com/ledgers/?q=" + typedthings
    //     }).success(function(data, status) {
    //         $scope.ledgersJSON = data;
    //         $scope.ledgersJSON.map(function(item){
    //           // เพิ่ม ledger detail   101 : เงินสด
    //           item.ledger_detail=item.ledger_id+" : "+item.ledger_name;
    //           item.ledger_name=item.ledger_name;
    //         });
    //         $scope.ledgers = _.map($scope.ledgersJSON, 'ledger_detail');
    //     });
    $http({
        method: 'POST',
        url:"https://rcim-app.herokuapp.com/coa",
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

$scope.details = [];
$scope.getJournal = function(){
}


$scope.addDetail = function(){
    var transaction =   {
                          "detail":$scope.ledger_name,
                          "ledger_id":$scope.ledger_id || "X01",
                          "drcr":$scope.drcr,
                          "amount":$scope.amount
                        }
    $scope.details.push(transaction);
    // clear ค่าทิ้ง
    $scope.ledger_name = "";
    $scope.ledger_id  = "";
    $scope.detail  = "";
    $scope.drcr = "";
    $scope.amount = "";

}



$scope.SumDrCr = function(drcr){
  var sum = 0;
    angular.forEach($scope.details,function(item,index){
      if(item.drcr==drcr){
        sum += ((parseFloat(item.amount).toFixed(2))/1);
        // รวม DrCr ไว้เช็คตอนบันทึก
        if(drcr=="1"){
          $scope.Dr = sum ;
        }else{
          $scope.Cr = sum ;
        }
      }
    });
    return sum;
}

$scope.saveJournalizing = function(){
  var journalsData = [], datejournal = function(i){return i[3]+"-"+i[2]+"-"+i[1];}(/(\d+)\/(\d+)\/(\d+)/g.exec($scope.datejournal));
  // set Debit Credit
  $scope.details.forEach(function(data){
    journalsData.push(
      {
        "coa_detail":data.detail,
        "coa_id":data.ledger_id,
        "drcr":data.drcr,
        "amount":data.amount,
        "date_time":datejournal
      }
    );
  });
  // set Description
  journalsData.push(
    {
      "coa_detail":$scope.description,
      "coa_id":"",
      "drcr":3,
      "amount":0,
      "date_time":datejournal
    }
  );
  $http({
      method: 'POST',
      url:"http://localhost:3000/journals/add",
      data:journalsData,
      headers: {'Content-Type': 'application/json'}
      })
  .success(function(data,status){
    // แสดง modal
    var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'myModalContent',
            size: undefined,
            controller: 'ModalAlert',
            resolve: {
              message: function () {return "บันทึกสำเร็จ"}
             }
          });

    console.log(data);
    console.log("save success");
    clearData();
  });
}



function clearData(){
  $scope.details=[];
  $scope.datejournal="";
  $scope.description="";
}



}]);


angular.module('general_journals').controller('ModalAlert', function ($scope, $uibModalInstance,$state, message) {
  $scope.message =message;
  $scope.ok = function () {
    $uibModalInstance.dismiss();
  };

});
