function dateStringFormat(date){
  // แปลง dd/MM/yyyy เป็น yyyy-mm-dd
  return function (i){return i[3]+"-"+i[2]+"-"+i[1];}(/(\d+)\/(\d+)\/(\d+)/g.exec(date));
}

angular.module("core",[]);

angular.module("core").config([
  "$stateProvider",
  "$locationProvider",
  "$urlRouterProvider",
  function($stateProvider,$locationProvider,$urlRouterProvider){
    $locationProvider.hashPrefix("!");
    $urlRouterProvider.otherwise("/");
  }
]);

angular.module("general_journals",[]);

angular.module("general_journals").config([
  "$stateProvider",
  function($stateProvider){
    var date = moment().format("DD/MM/YYYY");

    $stateProvider
    .state("journalizing",{
      url:"/journalizing",
      templateUrl:"/modules/general_journals/views/journalizing.html"
    })
    .state("searchrefno",{
      url:"/searchrefno",
      templateUrl:"/modules/general_journals/views/searchrefno.html"
    })
    .state("editjournal",{
      url:"/editjournal",
      params: {
            ref_no : "59/0001"
      },
      templateUrl:"/modules/general_journals/views/editjournalizing.html"
    })
    .state("journals",{
      url:"/journals",
      templateUrl:"/modules/general_journals/views/journals.html"
    })
    .state("journaldetail",{
      url:"/journals/details",
      params: {
            datestart :date,
            dateend:date,
            ref_no:""
        },
      templateUrl:"/modules/general_journals/views/journal_detail.html"
    });
  }
]);

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

angular.module("general_journals").controller("JournalsController",
["$scope","$http","$state",
function($scope,$http,$state){

  $scope.datestart = moment().format("DD/MM/YYYY");
  $scope.dateend = moment().format("DD/MM/YYYY");

  $scope.goDetail = function(tab){
    //location.href = "#!/journals/details"
    data = tab == 1 ?
          {
            datestart:$scope.datestart,
            dateend:$scope.dateend
          }:
          {
            ref_no:$scope.ref_no
          };
    $state.go("journaldetail",data);
  }

}]);

angular.module("general_journals").controller("JournalDetailController",
["$scope","$http","$stateParams","$uibModal","$state",
function($scope,$http,$stateParams,$uibModal,$state){

  $scope.getJournalDetail = function(){
      $scope.datestart = $stateParams.datestart;
      $scope.dateend = $stateParams.dateend;
      $scope.ref_no = $stateParams.ref_no;
      var url   = "";
      var data  = "";
      if($scope.ref_no) {
        console.log("journal/search");
        url   = "https://rcim-app.herokuapp.com/journals/search";
        data  = {"ref_no" : $scope.ref_no };
      }else{
        console.log("journal_detail");
        url   = "https://rcim-app.herokuapp.com/journal_detail" ;
        data  = {"datestart" : dateStringFormat($scope.datestart) ,"dateend" : dateStringFormat($scope.dateend)};
      }

      $http({
        method: 'POST',
        url: url,
        data: data
      }).success(function(data, status) {
        // ถ้าไม่เจอ ref_no
        if(!data.length && $scope.ref_no){
          // แสดง modal
          var modalInstance = $uibModal.open({
                  animation: true,
                  templateUrl: 'myModalContent',
                  size: undefined,
                  controller: 'ModalAlert',
                  resolve: {
                    message: function () {return "ไม่พบเลขที่เอกสารอ้างอิง"}
                   }
                });

                modalInstance.result.then(function(){
                  $state.go('journals', {}, { reload: true });
                });
          return;
        }

        data.map(function(i){ i.journal_date = moment(i.journal_date).format("DD/MM/YYYY")});
        $scope.journal_details = data;
      });
  }



  $scope.SumDrCr = function(drcr){
    var sum = 0;
      angular.forEach($scope.journal_details,function(item,index){
        if(item.drcr==drcr){
          sum += ((parseFloat(item.amount).toFixed(2))/1);
        }
      });
      return sum;
  }

}]);

angular.module("general_journals").controller("EditJournalizingController",
["$scope","$http","$uibModal","$stateParams","$state","DropdownList",
function($scope,$http,$uibModal,$stateParams,$state,DropdownList){

$scope.checkJournalizing = function(){
  return !(_.size($scope.details) && ($scope.Dr ==$scope.Cr) && $scope.description && $scope.datejournal && $scope.ref_no && $scope.account_id);
}
$scope.searchText = function(typedthings){
  console.log("Do something like reload data with this: " + typedthings );
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
  DropdownList.GET("account_list").then(function(data){$scope.accountList = data});
  $http({
      method: 'POST',
      url:"https://rcim-app.herokuapp.com/journals/search",
      data:"ref_no="+$stateParams.ref_no,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      })
      .success(function(data, status) {
        // ถ้าไม่เจอ ref_no
        if(!data.length){
          // แสดง modal
          var modalInstance = $uibModal.open({
                  animation: true,
                  templateUrl: 'myModalContent',
                  size: undefined,
                  controller: 'ModalAlert',
                  resolve: {
                    message: function () {return "ไม่พบเลขที่เอกสารอ้างอิง"}
                   }
                });

                modalInstance.result.then(function(){
                  $state.go('searchrefno', {}, { reload: true });
                });
          return;
        }

        // ถ้าเจอ ref_no จึงแสดงข้อมูล
        $scope.description = data[data.length - 1].detail;
        $scope.account_id = data[data.length - 1].account_id + "";
        console.log(">>>>>>>>>>>>",data[data.length - 1].account_id);
        $scope.datejournal = moment(data[data.length - 1].journal_date).format("DD/MM/YYYY");
        $scope.ref_no = data[data.length - 1].ref_no;
        data.every( (value,index) => {
          if(index == data.length - 1) return false;
          var transaction =   {
                                "detail":value.detail,
                                "ledger_id":value.ledger_id || "X01",
                                "drcr":value.drcr,
                                "amount":value.amount
                              }
          $scope.details.push(transaction);
          return true;
        });

      });
}

$scope.removeDetail = function(index){
  $scope.details.splice(index,1);
}

$scope.shiftUpDetail = function(index){
  if(index == 0) return;
  var item = $scope.details[ index ];
  $scope.details[ index ] = $scope.details[ index - 1 ];
  $scope.details[ index - 1 ] = item;
}

$scope.shiftDownDetail = function(index){
  if(index == $scope.details.length -1) return;
  var item = $scope.details[ index ];
  $scope.details[ index ] = $scope.details[ index + 1 ];
  $scope.details[ index + 1 ] = item;
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
      url:"https://rcim-app.herokuapp.com/journals/update",
      data:journalsData,
      headers: {'Content-Type': 'application/json'}
      })
  .success(function(data,status){
    var modalmessage = "";
    if(data[0].message =="success"){
      modalmessage = "แก้ไขสำเร็จ";
      //$scope.clearData();
    }else{
      console.log(data);
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
    $uibModalInstance.close();
  };

});

angular.module("general_journals").controller("SearchRefNoController",
["$scope","$http","$state",
function($scope,$http,$state){

  $scope.getJournals = function(){
      // $http({
      //   method: 'GET',
      //   url: $scope.dbURL + '/journals'
      // }).success(function(data, status) {
      //   $scope.journals = data;
      // });
  }

  $scope.goDetail = function(){
    //location.href = "#!/journals/details"
    $state.go("editjournal",
    {
      ref_no:$scope.ref_no
    });
  }

}]);

angular.module("general_ledgers",[]);

angular.module("general_ledgers").config([
  "$stateProvider",
  function($stateProvider){
    var date =  moment().format("DD/MM/YYYY");

    $stateProvider
    .state("ledgers",{
      url:"/ledgers",
      templateUrl:"/modules/general_ledgers/views/ledgers.html"
    })
    .state("addledger",{
      url:"/ledgers/add",
      templateUrl:"/modules/general_ledgers/views/add_ledger.html",
      controller:"AddLedgerController"
    })
    .state("ledgerdetail",{
      url:"/ledgers/detail",
      templateUrl:"/modules/general_ledgers/views/ledger_detail.html",
      params: {
            account_id:"1",
            account_name:"บัญชี MBA บิพิตรพิมุข",
            ledger_id:"1101000000",
            ledger_name:"บัญชีเงินสดและรายการเทียบเท่าเงินสด",
            datestart:date,
            dateend:date
        },
      controller:"LedgerDetailController"
    })

  }
]);

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


}]);

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
      url: 'https://rcim-app.herokuapp.com/ledger',
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

angular.module("general_ledgers").controller("AddLedgerController",
["$scope","$http",
function($scope,$http){
  $scope.getLedgers = function(){
      $http({
        method: 'GET',
        url: $scope.dbURL + '/ledgers'
      }).success(function(data, status) {
        $scope.ledgers = data;
      });
  }

  $scope.currentCheck = function(){
    switch ($scope.coa) {
      case "1":
      $scope.coa_text ="สินทรัพย์";
        break;
      case "2":
      $scope.coa_text ="หนี้สิน";
        break;
      default:
      $scope.current = "";
      $scope.coa_text = "";
        break
    }
  }

  $scope.checkData = function(){
    if($scope.coa=='1' || $scope.coa=='2'){
      return !($scope.coa && $scope.ledger_id && $scope.ledger_name && $scope.current);
    }else{
      return !($scope.coa && $scope.ledger_id && $scope.ledger_name );
    }
  }




}]);

angular.module("trial_balance",[]);

angular.module("trial_balance").config([
  "$stateProvider",
  function($stateProvider){
    var date = moment().format("DD/MM/YYYY");

    $stateProvider
    .state("searchtrial",{
      url:"/searchtrial",
      templateUrl:"/modules/trial_balance/views/search_trial_balance.html"
    })
    .state("trialbalance",{
      url:"/trialbalance",
      params: {
            account_id:"0",
            account_name:"บัญชีทั้งหมด",
            datestart:date,
            dateend:date
        },
      templateUrl:"/modules/trial_balance/views/trial_balance.html"
    })
  }
]);

angular.module("trial_balance").controller("SearchTrialController",
["$scope","$http","$state","DropdownList",
function($scope,$http,$state,DropdownList){
  $scope.datestart = moment().format("DD/MM/YYYY");
  $scope.dateend = moment().format("DD/MM/YYYY");


  $scope.checkCondition = function(){
    return !($scope.account_id && $scope.datestart && $scope.dateend );
  }

  $scope.viewTrialBalance = function(){
    $state.go("trialbalance",{
      account_id:$scope.account_id,
      account_name:$scope.account_name,
      datestart:$scope.datestart,
      dateend:$scope.dateend
    });
  }

  $scope.initFunction = function(){
    DropdownList.GET("account_list").then(function(data){$scope.accountList = data});
  }


  $scope.onDropdownChange = function(){
    $scope.account_name = $("[name=account_id] option:selected").text();
  }


}]);

angular.module("trial_balance").controller("TrialBalanceController",
["$scope","$http","$stateParams",
function($scope,$http,$stateParams){

  $scope.sumBroughtForward = 0;
  $scope.sumDr = 0;
  $scope.sumCr = 0;
  $scope.sumCarryForward = 0;

  $scope.initFunction = function(){
    $scope.datestart = $stateParams.datestart;
    $scope.dateend = $stateParams.dateend;
    $scope.account_id = $stateParams.account_id;
    $scope.account_name = $stateParams.account_name;
    $http({
      method: 'POST',
      url: 'https://rcim-app.herokuapp.com/trial_balance',
      data: {
        "datestart" : dateStringFormat($scope.datestart) ,
        "dateend" : dateStringFormat($scope.dateend) ,
        "account_id" : $scope.account_id
      }
    }).success(function(data, status) {
      $scope.trial = data;
      _.map($scope.trial, i => {
        $scope.sumBroughtForward += i.brought_forward;
        $scope.sumDr += i.current_dr;
        $scope.sumCr += i.current_cr;
        $scope.sumCarryForward += i.carry_forward;
      })
    });
  }



  $scope.SumDrCr = function(drcr){
    var sum = 0;
    angular.forEach($scope.trial,function(item,index){
        sum += ((parseFloat(drcr == "1" ? item.current_dr : item.current_cr ).toFixed(2))/1);
    });
    return sum;
  }

  $scope.FormatDrCr = function(x){
    return x == 0 ? x                :
           x <  0 ? (x*-1) + ' (Cr)' :
                    x      + ' (Dr)' ;
  }






}]);

angular.module("balance_sheet",[]);

angular.module("balance_sheet").config([
  "$stateProvider",
  function($stateProvider){
    var date = moment().format("DD/MM/YYYY");

    $stateProvider
    .state("searchbalance",{
      url:"/searchbalance",
      templateUrl:"/modules/balance_sheet/views/search_balance_sheet.html"
    })
    .state("balancesheet",{
      url:"/balancesheet",
      params: {
            account_id:"0",
            account_name:"บัญชีทั้งหมด",
            dateend:date
        },
      templateUrl:"/modules/balance_sheet/views/balance_sheet.html"
    })
  }
]);

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
    _.each(_.filter($scope.balancesheet, i => pattern.test(i.coa_id) ) , i => sum+=i.amount_total);
    return sum;
  }















}]);

angular.module("balance_sheet").controller("SearchBalanceSheetController",
["$scope","$http","$state","DropdownList",
function($scope,$http,$state,DropdownList){
  $scope.date = moment().format("DD/MM/YYYY");


  $scope.checkCondition = function(){
    return !($scope.account_id && $scope.date);
  }

  $scope.viewBalanceSheet = function(){
    $state.go("balancesheet",{
      account_id:$scope.account_id,
      account_name:$scope.account_name,
      dateend:$scope.date
    });
  }

  $scope.initFunction = function(){
    DropdownList.GET("account_list").then(function(data){$scope.accountList = data});
  }


  $scope.onDropdownChange = function(){
    $scope.account_name = $("[name=account_id] option:selected").text();
  }

}]);

angular.module("profit_loss",[]);

angular.module("profit_loss").config([
  "$stateProvider",
  function($stateProvider){
    var date = moment().format("DD/MM/YYYY");

    $stateProvider
    .state("searchprofitloss",{
      url:"/searchprofitloss",
      templateUrl:"/modules/profit_loss/views/search_profit_loss.html"
    })
    .state("profitloss",{
      url:"/profitloss",
      params: {
          account_id:"0",
          account_name:"บัญชีทั้งหมด",
          datestart:date,
          dateend:date
        },
      templateUrl:"/modules/profit_loss/views/profit_loss.html"
    })
  }
]);

angular.module("profit_loss").controller("ProfitLossController",
["$scope","$http","$stateParams",
function($scope,$http,$stateParams){


  $scope.initFunction = function(){
    $scope.datestart = $stateParams.datestart;
    $scope.dateend = $stateParams.dateend;
    $scope.account_id = $stateParams.account_id;
    $scope.account_name = $stateParams.account_name;
    $http({
      method: 'POST',
      url: 'https://rcim-app.herokuapp.com/profit_loss',
      data: {
        "datestart" : dateStringFormat($scope.datestart) ,
        "dateend" : dateStringFormat($scope.dateend) ,
        "account_id" : $scope.account_id
      }
    }).success(function(data, status) {
      $scope.profitloss = data;
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
    _.each(_.filter($scope.profitloss, i => pattern.test(i.coa_id) ) ,
     i => {
       carry_forward = i.carry_forward;
       if(/^4/.test(i.coa_id) && i.carry_forward < 0) carry_forward = (i.carry_forward *-1);
       sum += carry_forward
     });
    return sum;
  }

}]);

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
  }


  $scope.onDropdownChange = function(){
    $scope.account_name = $("[name=account_id] option:selected").text();
  }





}]);

angular.module("dashboard", []);

angular.module("dashboard").config([
  "$stateProvider",
  function($stateProvider){
    $stateProvider
    .state("dashboard",{
      url:"/dashboard",
      templateUrl:"/modules/dashboard/views/dashboard.client.view.ejs"
    });
  }
]);

angular.module("dashboard").controller("dashboardController",
["$scope","$http",function($scope,$http){
  $scope.yourName = "No Name";
  //var users_json = $http.get("/testjson");
}]);

angular.module("users",[]);
// angular.module("users", []).run(["$rootScope","$http",function($rootScope,$http) {
//         $rootScope.LoadLookups = function(scope,model,url){return LoadLookups(scope,model,url,$http)}
// }]);

angular.module("users").config([
  "$stateProvider",
  function($stateProvider){
    $stateProvider
      .state("user",
        {
            url:"/user",
            templateUrl:"/modules/users/views/userlist.html"
        }
      )
      .state("adduser",
      {
        url:"/user/add",
        templateUrl:"/modules/users/views/manageuser.html"
      }
    )
  }

]);

angular.module("users").controller("UserController",[
  "$scope","$http","$state","$uibModal",
  function($scope,$http,$state, $uibModal){
    // $scope.users = false;
    // $scope.position = undefined;
    // $scope.campus = undefined;


    // $scope.initForm = function(){
    //   $scope.LoadLookups($scope,"position","/lookup/position");
    //   $scope.LoadLookups($scope,"campus","/lookup/campus");
    // }

    $scope.getAllUsers = function(){
        $http({
          method: 'GET',
          url: 'https://rcim-app.herokuapp.com/users'
        }).success(function(data, status) {
          $scope.users = data;
        });
      }

    $scope.changeState = function(state){
      $state.go(state);
    }

    // ฟังค์ชั่นสำหรับการ insertUser + uploadAvatar
    // $scope.insertUser=function(){
    //   $http({
    //     method: 'post',
    //     url: '/createUser',
    //     data: {
    //             userid : $scope.user.userid ,
    //             username : $scope.user.username ,
    //             password : $scope.user.password ,
    //             email : $scope.user.email ,
    //             position : $scope.position.selectedOption.position_name ,
    //             campus : $scope.campus.selectedOption.campus_name
    //           }
    //   }).success(function(data, status) {
    //     var message="";
    //     if(data.message==="success"){
    //         message="สร้าง user สำเร็จแล้วครับ";
    //         var fd = new FormData();
    //         fd.append('avatar', $scope.avatar);
    //         fd.append('userid', $scope.user.userid);
    //         $http({
    //   				method:"post",
    //   				url:"/uploadAvatar",
    //   				headers: {'Content-Type': undefined},
    //   				transformRequest: angular.identity,
    //   				data:fd
    // 			   }).success(function(){ })
    //     }else{
    //         message="สร้าง user ไม่สำเร็จครับ";
    //     }
    //     var modalInstance = $uibModal.open({
    //         animation: true,
    //         templateUrl: 'myModalContent',
    //         size: undefined,
    //         controller: 'addModalCtrl',
    //         resolve: {
    //           message: function () {return message},
    //           status:function(){return data.message}
    //          }
    //       });
    //
    //   });
    // }

    $scope.addUserModal = function(){
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'addModalContent',
          size: 'lg',
          controller: 'addModalCtrl'
         }
       );

       modalInstance.result.then(function(){
         $state.go('user', {}, { reload: true });
       });


    }


    $scope.editUserModal = function(_user){
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'editModalContent',
          size: 'lg',
          controller: 'editModalCtrl',
          resolve: {
            user: function () {return _user}
           }
         }
       );

       modalInstance.result.then(function () {
             $state.go('user', {}, { reload: true });
      });


    }


    $scope.deleteUserModal = function (_user) {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'deleteModalContent',
          size: undefined,
          controller: 'deleteModalCtrl',
          resolve: {
            items: function () {return _user}
           }
         }
       );

       modalInstance.result.then(function (id) {
         $http({
           method: 'post',
           url: 'https://rcim-app.herokuapp.com/users/delete',
           data: {
                   user_id : id
                 }
         }).success(function(data, status) {
             $state.go('user', {}, { reload: true });
         });
      });

    }



  }
]);

















//http://angular-ui.github.io/bootstrap/
angular.module('users').controller('deleteModalCtrl', function ($scope, $uibModalInstance, items) {
  $scope.user_id =items.user_id;
  $scope.ok = function () {
    $uibModalInstance.close($scope.user_id);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});



// เพิ่ม user
angular.module('users').controller('addModalCtrl', function ($scope, $uibModalInstance, $state , $http) {
  $scope.duplicate = false;
  $scope.checkData = function(){
    return !(
      $scope.userid &&
      $scope.username &&
      $scope.password &&
      $scope.password2 &&
      $scope.email &&
      $scope.tel &&
      $scope.address &&
      $scope.role &&
      $scope.campus &&
      ($scope.password == $scope.password2) &&
      ($scope.password.length >= 8) &&
      (/[0-9A-Za-z]/.test($scope.userid) && !/\s/.test($scope.userid))
    )
  };


  $scope.ok = function () {
    if( $scope.checkData() ) return;
      $http({
        method: 'post',
        url: 'https://rcim-app.herokuapp.com/users/create',
        data: {
                user_id   : $scope.userid,
                user_name : $scope.username,
                password  : $scope.password,
                email     : $scope.email,
                tel_no    : $scope.tel,
                address   : $scope.address,
                campus_id : $scope.campus,
                role_id   : $scope.role
              }
      })
      .success(function(data){
        if(data.message =="fail"){
          $scope.duplicate = true;
        }else{
          if($scope.avatar){
            var fd = new FormData();
              fd.append('avatar', $scope.avatar);
              fd.append('userid', data[0].id);
            $http({
              method:"post",
              url:"https://rcim-app.herokuapp.com/uploadAvatar",
              headers: {'Content-Type': undefined},
              transformRequest: angular.identity,
              data:fd
            }).success(function(){ });
          }
          $uibModalInstance.close();
        }

      });

  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

});


// แก้ไขข้อมูล user
angular.module('users').controller('editModalCtrl', function ($scope, $uibModalInstance, $state ,user, $http) {

  $scope.initData = function(){
    $scope.userid = user.user_id;
    $scope.username = user.user_name;
    $scope.email = user.email;
    $scope.tel = user.tel_no;
    $scope.address = user.address;
    $scope.role = user.role_id + "";
    $scope.campus = user.campus_id + "";
  };

  $scope.checkData = function(){
    return !(
      $scope.userid &&
      $scope.username &&
      $scope.password &&
      $scope.password2 &&
      $scope.email &&
      $scope.tel &&
      $scope.address &&
      $scope.role &&
      $scope.campus &&
      ($scope.password == $scope.password2) &&
      ($scope.password.length >= 8)
    )
  };


  $scope.ok = function () {
    if( $scope.checkData() ) return;
      $http({
        method: 'post',
        url: 'https://rcim-app.herokuapp.com/users/update',
        data: {
                user_id       : $scope.userid,
                user_name     : $scope.username,
                password      : $scope.password,
                email         : $scope.email,
                tel_no        : $scope.tel,
                address       : $scope.address,
                campus_id     : $scope.campus,
                role_id       : $scope.role,
                avatar_flag   : !!($scope.avatar)
              }
      })
      .success(function(data){
        if($scope.avatar){
          var fd = new FormData();
            fd.append('avatar', $scope.avatar);
            fd.append('userid', $scope.userid);
          $http({
            method:"post",
            url:"https://rcim-app.herokuapp.com/uploadAvatar",
            headers: {'Content-Type': undefined},
            transformRequest: angular.identity,
            data:fd
          }).success(function(){ });
        }
        $uibModalInstance.close();
      });

  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

});


angular.module('users').controller('messageModalCtrl', function ($scope, $uibModalInstance,$state, message,status) {
  $scope.message =message;
  $scope.ok = function () {
    $uibModalInstance.dismiss();
    if(status=="success"){
      $state.go("user");
    }
  };

});




angular.module('users').directive('fileModel', ['$parse', function ($parse) {
   return {
      restrict: 'A',
      link: function(scope, element, attrs) {
         var model = $parse(attrs.fileModel);
         var modelSetter = model.assign;

         element.bind('change', function(){
            scope.$apply(function(){
               modelSetter(scope, element[0].files[0]);
            });
         });
      }
   };
}]);

angular.module("management",[]);

angular.module("management").config([
  "$stateProvider",
  function($stateProvider){
    var date = moment().format("DD/MM/YYYY");

    $stateProvider
    .state("coa",{
      url:"/coa",
      templateUrl:"/modules/management/views/coa.html"
    })
    .state("account",{
      url:"/account",
      templateUrl:"/modules/management/views/account.html"
    })
    .state("broughtforward",{
      url:"/broughtforward",
      templateUrl:"/modules/management/views/broughtforward.html"
    })

    // .state("xxx",{
    //   url:"/xxxx",
    //   params: {
    //       account_id:"0",
    //       account_name:"บัญชีทั้งหมด",
    //       datestart:date,
    //       dateend:date
    //     },
    //   templateUrl:"/modules/profit_loss/views/profit_loss.html"
    // })
  }
]);

angular.module("management").controller("CoaController",[
  "$scope","$http","$state","$uibModal",
  function($scope,$http,$state, $uibModal){

    $scope.addCoaModal = function(){
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'addModalContent',
          controller: 'addCoaModalCtrl'
         }
       );

       modalInstance.result.then(function(){
         $state.go('coa', {}, { reload: true });
       });


    }

    $scope.editCoaModal = function(i){
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'editModalContent',
          controller: 'editCoaModalCtrl',
          resolve: {
            i: function () {return i}
           }
         }
       );

       modalInstance.result.then(function(){
         $state.go('coa', {}, { reload: true });
       });


    }


    $scope.deleteCoaModal = function(i){
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'deleteModalContent',
          controller: 'deleteCoaModalCtrl',
          resolve: {
            i: function () {return i}
           }
         }
       );

       modalInstance.result.then(function(){
         $state.go('coa', {}, { reload: true });
       });


    }


    $scope.getAllCoa = function(){
        $http({
          method: 'GET',
          url: 'https://rcim-app.herokuapp.com/coa'
        }).success(function(data, status) {
          $scope.coa = data;
        });
      }






  }]);




angular.module('management').controller('addCoaModalCtrl', function ($scope, $uibModalInstance, $state, $http) {

  $scope.duplicate = false;

  $scope.checkData = function(){
    return !(
      $scope.coa_id &&
      $scope.coa_detail &&
      ($scope.coa_id.length == 10)
    )
  };

  $scope.ok = function () {
    if( $scope.checkData() ) return;
      $http({
        method: 'post',
        url: 'https://rcim-app.herokuapp.com/coa/create',
        data: {
                coa_id       : $scope.coa_id,
                coa_detail   : $scope.coa_detail
              }
      })
      .success(function(data){
        if(data.message == "fail"){
          $scope.duplicate = true;
        }else{
          $uibModalInstance.close();
        }
      });

  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

});


angular.module('management').controller('editCoaModalCtrl', function ($scope, $uibModalInstance, $state ,i, $http) {

  $scope.initData = function(){
    $scope.coa_id = i.coa_id;
    $scope.coa_detail = i.coa_detail;
  };

  $scope.checkData = function(){
    return !(
      $scope.coa_id &&
      $scope.coa_detail &&
      ($scope.coa_id.length == 10)
    )
  };

  $scope.ok = function () {
    if( $scope.checkData() ) return;
      $http({
        method: 'post',
        url: 'https://rcim-app.herokuapp.com/coa/update',
        data: {
                    coa_id       : $scope.coa_id,
                    coa_detail   : $scope.coa_detail
              }
      })
      .success(function(data){
        $uibModalInstance.close();
      });

  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

});



angular.module('management').controller('deleteCoaModalCtrl', function ($scope, $uibModalInstance, $state ,i, $http) {

  $scope.initData = function(){
    $scope.coa_id = i.coa_id;
    $scope.coa_detail = i.coa_detail;
  };


  $scope.ok = function () {
      $http({
        method: 'post',
        url: 'https://rcim-app.herokuapp.com/coa/delete',
        data: {
                  coa_id  : $scope.coa_id
              }
      })
      .success(function(data){
        $uibModalInstance.close();
      });

  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

});

angular.module("management").controller("AccountController",[
  "$scope","$http","$state","$uibModal",
  function($scope,$http,$state, $uibModal){

    $scope.addAccountModal = function(){
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'addModalContent',
          controller: 'addAccountModalCtrl'
         }
       );

       modalInstance.result.then(function(){
         $state.go('account', {}, { reload: true });
       });


    }

    $scope.editAccountModal = function(i){
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'editModalContent',
          controller: 'editAccountModalCtrl',
          resolve: {
            i: function () {return i}
           }
         }
       );

       modalInstance.result.then(function(){
         $state.go('account', {}, { reload: true });
       });


    }


    $scope.deleteAccountModal = function(i){
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'deleteModalContent',
          controller: 'deleteAccountModalCtrl',
          resolve: {
            i: function () {return i}
           }
         }
       );

       modalInstance.result.then(function(){
         $state.go('account', {}, { reload: true });
       });


    }


    $scope.GetAllaccounts = function(){
        $http({
          method: 'GET',
          url: 'https://rcim-app.herokuapp.com/account_list'
        }).success(function(data, status) {
          $scope.accounts = data;
        });
      }









  }]);



  angular.module('management').controller('addAccountModalCtrl', function ($scope, $uibModalInstance, $state, $http) {

    $scope.duplicate = false;

    $scope.checkData = function(){
      return !(
        $scope.account_id &&
        $scope.account_name
      )
    };

    $scope.ok = function () {
      if( $scope.checkData() ) return;
        $http({
          method: 'post',
          url: 'https://rcim-app.herokuapp.com/account/create',
          data: {
                  account_id       : $scope.account_id,
                  account_name   : $scope.account_name
                }
        })
        .success(function(data){
          if(data.message == "fail"){
            $scope.duplicate = true;
          }else{
            $uibModalInstance.close();
          }
        });

    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

  });


  angular.module('management').controller('editAccountModalCtrl', function ($scope, $uibModalInstance, $state ,i, $http) {

    $scope.initData = function(){
      $scope.account_id = i.account_id;
      $scope.account_name = i.account_name;
    };

    $scope.checkData = function(){
      return !(
        $scope.account_id &&
        $scope.account_name
      )
    };

    $scope.ok = function () {
      if( $scope.checkData() ) return;
        $http({
          method: 'post',
          url: 'https://rcim-app.herokuapp.com/account/update',
          data: {
                      account_id       : $scope.account_id,
                      account_name   : $scope.account_name
                }
        })
        .success(function(data){
          $uibModalInstance.close();
        });

    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

  });



  angular.module('management').controller('deleteAccountModalCtrl', function ($scope, $uibModalInstance, $state ,i, $http) {

    $scope.initData = function(){
      $scope.account_id = i.account_id;
      $scope.account_name = i.account_name;
    };


    $scope.ok = function () {
        $http({
          method: 'post',
          url: 'https://rcim-app.herokuapp.com/account/delete',
          data: {
                    account_id  : $scope.account_id
                }
        })
        .success(function(data){
          $uibModalInstance.close();
        });

    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

  });

angular.module("management").controller("BroughtForwardController",
  ["$scope","$http","$uibModal","$stateParams","$state",
  function($scope,$http,$uibModal,$stateParams,$state){

  $scope.checkJournalizing = function(){
    return !(_.size($scope.details) && ($scope.Dr ==$scope.Cr) && $scope.description && $scope.datejournal);
  }
  $scope.searchText = function(typedthings){
    console.log("Do something like reload data with this: " + typedthings );
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
    $http({
        method: 'get',
        url:"https://rcim-app.herokuapp.com/journals/broughtforward",
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .success(function(data, status) {

          $scope.description = data[data.length - 1].detail;
          $scope.account_id = data[data.length - 1].account_id + "";
          $scope.datejournal = moment(data[data.length - 1].journal_date).format("DD/MM/YYYY");
          $scope.ref_no = data[data.length - 1].ref_no;
          data.every( (value,index) => {
            if(index == data.length - 1) return false;
            var transaction =   {
                                  "detail":value.detail,
                                  "ledger_id":value.ledger_id || "X01",
                                  "drcr":value.drcr,
                                  "amount":value.amount
                                }
            $scope.details.push(transaction);
            return true;
          });

        });
  }

  $scope.removeDetail = function(index){
    $scope.details.splice(index,1);
  }

  $scope.shiftUpDetail = function(index){
    if(index == 0) return;
    var item = $scope.details[ index ];
    $scope.details[ index ] = $scope.details[ index - 1 ];
    $scope.details[ index - 1 ] = item;
  }

  $scope.shiftDownDetail = function(index){
    if(index == $scope.details.length -1) return;
    var item = $scope.details[ index ];
    $scope.details[ index ] = $scope.details[ index + 1 ];
    $scope.details[ index + 1 ] = item;
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
          "ref_no":0,
          "drcr":data.drcr,
          "amount":data.amount,
          "account_id":0,
          "date_time":moment(new Date(0)).format("YYYY-MM-DD")
        }
      );
    });
    // set Description
    journalsData.push(
      {
        "coa_detail":$scope.description,
        "coa_id":"",
        "ref_no":0,
        "drcr":3,
        "amount":0,
        "account_id":0,
        "date_time":moment(new Date(0)).format("YYYY-MM-DD")
      }
    );
    $http({
        method: 'POST',
        url:"https://rcim-app.herokuapp.com/journals/update",
        data:journalsData,
        headers: {'Content-Type': 'application/json'}
        })
    .success(function(data,status){
      var modalmessage = "";
      if(data[0].message =="success"){
        modalmessage = "แก้ไขสำเร็จ";
        //$scope.clearData();
      }else{
        console.log(data);
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



  angular.module('management').controller('ModalAlert', function ($scope, $uibModalInstance,$state, message) {
    $scope.message = message;
    $scope.ok = function () {
      $uibModalInstance.close();
    };

  });

angular.module("service",[]);
angular.module("service")
.service('DropdownList', function($http,$q) {
    this.GET = function(url) {
      return $q(function(resolve, reject) {
                $http({
                 method: 'GET',
                 url: "https://rcim-app.herokuapp.com/" + url
               }).success(function(data, status) {
                 resolve(data);
               });
             });
    }

});

angular.module("Main",[]);
angular.module("Main",
['ui.router',
"ngAnimate",
"ui.bootstrap",
"autocomplete",
"core",
"dashboard",
"general_journals",
"general_ledgers",
"trial_balance",
"balance_sheet",
"profit_loss",
"users",
"management",
"service"]);


angular.module("Main")
.run(["$rootScope",function($rootScope){

  $rootScope.dbURL = "https://rcim-json.herokuapp.com";
  //$rootScope.dbURL = "http://localhost:3000";

    $rootScope
        .$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams){
                //console.log("State Change: transition begins!");
                $('.page-transition').toggleClass('loading');
        });

    $rootScope
        .$on('$stateChangeSuccess',
            function(event, toState, toParams, fromState, fromParams){
                //console.log("State Change: State change success!");
                $('.page-transition').toggleClass('loading');

        });

}]);
