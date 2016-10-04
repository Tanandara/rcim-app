angular.module("general_journals").controller("JournalizingController",
["$scope","$http","$uibModal","DropdownList",
function($scope,$http,$uibModal,DropdownList){
$scope.checkJournalizing = function(){
  return !(_.size($scope.details) && ($scope.Dr ==$scope.Cr) && $scope.description && $scope.datejournal && $scope.ref_no && $scope.account_id);
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
$scope.initFunction = function(){
  DropdownList.GET("account_list").then(function(data){$scope.accountList = data});
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
  if( $scope.checkJournalizing() ) return;
  var journalsData = [], datejournal = function(i){return i[3]+"-"+i[2]+"-"+i[1];}(/(\d+)\/(\d+)\/(\d+)/g.exec($scope.datejournal));
  // set Debit Credit
  $scope.details.forEach(function(data){
    journalsData.push(
      {
        "coa_detail":data.detail,
        "coa_id":data.ledger_id,
        "ref_no":$scope.ref_no,
        "drcr":data.drcr,
        "amount":data.amount,
        "account_id":$scope.account_id,
        "date_time":datejournal
      }
    );
  });
  // set Description
  journalsData.push(
    {
      "coa_detail":$scope.description,
      "coa_id":"",
      "ref_no":$scope.ref_no,
      "drcr":3,
      "amount":0,
      "account_id":$scope.account_id,
      "date_time":datejournal
    }
  );
  $http({
      method: 'POST',
      url:"https://rcim-app.herokuapp.com/journals/add",
      data:journalsData,
      headers: {'Content-Type': 'application/json'}
      })
  .success(function(data,status){
    var modalmessage = "";
    if(data[0].message =="success"){
      modalmessage = "บันทึกสำเร็จ";
      $scope.clearData();
    }else{
      modalmessage = "เลขที่เอกสารอ้างอิงซ้ำ";
    }

    // แสดง modal
    var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'myModalContent',
            size: undefined,
            controller: 'ModalAlert',
            resolve: {
              message: function () {return modalmessage}
             }
          });

  });
}

$scope.clearData = function(){
  $scope.details=[];
  $scope.datejournal="";
  $scope.description="";
  $scope.Dr = 0;
  $scope.Cr = 0;
  $scope.ref_no = "";
  $scope.account_id ="";
}




}]);


angular.module('general_journals').controller('ModalAlert', function ($scope, $uibModalInstance,$state, message) {
  $scope.message =message;
  $scope.ok = function () {
    $uibModalInstance.dismiss();
  };

});
