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
            dateend:date
        },
      templateUrl:"/modules/general_journals/views/journal_detail.html"
    });
  }
]);

angular.module("general_journals").controller("JournalizingController",
["$scope","$http","$uibModal",
function($scope,$http,$uibModal){

$scope.checkJournalizing = function(){
  return !(_.size($scope.details) && ($scope.Dr ==$scope.Cr) && $scope.description && $scope.datejournal && $scope.ref_no);
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
        "ref_no":$scope.ref_no,
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
      "ref_no":$scope.ref_no,
      "drcr":3,
      "amount":0,
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
  $scope.getJournals = function(){
      $http({
        method: 'GET',
        url: $scope.dbURL + '/journals'
      }).success(function(data, status) {
        $scope.journals = data;
      });
  }

  $scope.goDetail = function(){
    //location.href = "#!/journals/details"
    $state.go("journaldetail",
    {
      datestart:$scope.datestart,
      dateend:$scope.dateend
    });
  }

}]);

angular.module("general_journals").controller("JournalDetailController",
["$scope","$http","$stateParams",
function($scope,$http,$stateParams){

  $scope.getJournalDetail = function(){
      $scope.datestart = $stateParams.datestart;
      $scope.dateend = $stateParams.dateend;
      $http({
        method: 'POST',
        url: 'https://rcim-app.herokuapp.com/journal_detail',
        data: {"datestart" : dateStringFormat($scope.datestart) ,"dateend" : dateStringFormat($scope.dateend)}
      }).success(function(data, status) {
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
["$scope","$http","$uibModal","$stateParams","$state",
function($scope,$http,$uibModal,$stateParams,$state){

$scope.checkJournalizing = function(){
  return !(_.size($scope.details) && ($scope.Dr ==$scope.Cr) && $scope.description && $scope.datejournal && $scope.ref_no);
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
  $http({
      method: 'POST',
      url:"http://localhost:3000/journals/search",
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
      "date_time":datejournal
    }
  );
  $http({
      method: 'POST',
      url:"http://localhost:3000/journals/update",
      data:journalsData,
      headers: {'Content-Type': 'application/json'}
      })
  .success(function(data,status){
    var modalmessage = "";
    if(data[0].message =="success"){
      modalmessage = "แก้ไขสำเร็จ";
      $scope.clearData();
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
      $http({
        method: 'GET',
        url: $scope.dbURL + '/journals'
      }).success(function(data, status) {
        $scope.journals = data;
      });
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
    var date = new Date();

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
            campus_id:"1",
            ledger_id:"101",
            datestart:date,
            dateend:date
        },
      controller:"LedgerDetailController"
    })

  }
]);

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

angular.module("general_ledgers").controller("LedgerDetailController",
["$scope","$http","$stateParams",
function($scope,$http,$stateParams){

  $scope.getLedgerDetail = function(){
      $http({
        method: 'GET',
        url: $scope.dbURL + '/ledger_detail?q='
      }).success(function(data, status) {
        $scope.ledger = data;
      });
  }

  $scope.SumDrCr = function(drcr){
    var sum = 0;
      angular.forEach($scope.ledger,function(item,index){
        if(item.drcr==drcr){
          sum += ((parseFloat(item.amount).toFixed(2))/1);
          console.log(sum);
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
            campus_id:"4",
            datestart:date,
            dateend:date
        },
      templateUrl:"/modules/trial_balance/views/trial_balance.html"
    })
  }
]);

angular.module("trial_balance").controller("SearchTrialController",
["$scope","$http","$state",
function($scope,$http,$state){
  $scope.datestart = moment().format("DD/MM/YYYY");
  $scope.dateend = moment().format("DD/MM/YYYY");


  $scope.checkCondition = function(){
    return !($scope.campus_id && $scope.datestart && $scope.dateend );
  }

  $scope.viewTrialBalance = function(){
    $state.go("trialbalance",{
      campus_id:$scope.campus_id,
      datestart:$scope.datestart,
      dateend:$scope.dateend
    });
  }

  // $scope.getTrialMonth = function(){
  //     $http({
  //       method: 'GET',
  //       url: $scope.dbURL + '/trial_balance_month'
  //     }).success(function(data, status) {
  //       $scope.month = data;
  //
  //     });
  //
  // }
  //
  // $scope.getTrialYear = function(){
  //   $http({
  //     method: 'GET',
  //     url: $scope.dbURL + '/trial_balance_year'
  //   }).success(function(data, status) {
  //     $scope.year = data;
  //   });
  //
  // }




}]);

angular.module("trial_balance").controller("TrialBalanceController",
["$scope","$http","$stateParams",
function($scope,$http,$stateParams){
  $scope.datestart = $stateParams.datestart;
  $scope.dateend = $stateParams.dateend;
  $scope.campus_id = $stateParams.campus_id;
  $scope.campus_name = $scope.campus_id == "1" ? "ศาลายา"     :
                       $scope.campus_id == "2" ? "วังไกลกังวล"  :
                       $scope.campus_id == "3" ? "บพิตรพิมุข"   :
                                                 "ทุกวิทยาเขต" ;

  $scope.getTrialBalance = function(){
    $http({
      method: 'POST',
      url: 'https://rcim-app.herokuapp.com/trial_balance',
      data: {
        "datestart" : dateStringFormat($scope.datestart) ,
        "dateend" : dateStringFormat($scope.dateend) ,
        "campus_id" : $stateParams.campus_id
      }
    }).success(function(data, status) {
      $scope.trial = data;
    });
  }

  $scope.SumDrCr = function(drcr){
    var sum = 0;
    angular.forEach($scope.trial,function(item,index){
        sum += ((parseFloat(drcr == "1" ? item.amount_dr : item.amount_cr ).toFixed(2))/1);
    });
    return sum;
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
            campus_id:"4",
            date:date
        },
      templateUrl:"/modules/balance_sheet/views/balance_sheet.html"
    })
  }
]);

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
      url: 'https://rcim-app.herokuapp.com/balance_sheet',
      data: {
        "dateend" : dateStringFormat($scope.date) ,
        "campus_id" : $stateParams.campus_id
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
                  c == 'Liability'            ? /^2/    :
                  c == 'Shareholder'          ? /^3/     :
                                                /^[1-3]/ ;
    _.each(_.filter($scope.balancesheet, i => pattern.test(i.coa_id) ) , i => sum+=i.amount_total);
    return sum;
  }















}]);

angular.module("balance_sheet").controller("SearchBalanceSheetController",
["$scope","$http","$state",
function($scope,$http,$state){
  $scope.date = moment().format("DD/MM/YYYY");


  $scope.checkCondition = function(){
    return !($scope.campus_id && $scope.date);
  }

  $scope.viewBalanceSheet = function(){
    $state.go("balancesheet",{
      campus_id:$scope.campus_id,
      date:$scope.date
    });
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
            campus_id:"4",
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
  $scope.datestart = $stateParams.datestart;
  $scope.dateend = $stateParams.dateend;
  $scope.campus_id = $stateParams.campus_id;
  $scope.campus_name = $scope.campus_id == "1" ? "ศาลายา"     :
                       $scope.campus_id == "2" ? "วังไกลกังวล"  :
                       $scope.campus_id == "3" ? "บพิตรพิมุข"   :
                                                 "ทุกวิทยาเขต" ;

  $scope.getProfitLoss = function(){
    $http({
      method: 'POST',
      url: 'https://rcim-app.herokuapp.com/profit_loss',
      data: {
        "datestart" : dateStringFormat($scope.datestart) ,
        "dateend" : dateStringFormat($scope.dateend) ,
        "campus_id" : $stateParams.campus_id
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
    _.each(_.filter($scope.profitloss, i => pattern.test(i.coa_id) ) , i => sum+=i.amount_total);
    return sum;
  }

}]);

angular.module("profit_loss").controller("SearchProfitLossController",
["$scope","$http","$state",
function($scope,$http,$state){
  $scope.datestart = moment().format("DD/MM/YYYY");
  $scope.dateend = moment().format("DD/MM/YYYY");


  $scope.checkCondition = function(){
    return !($scope.campus_id && $scope.datestart && $scope.dateend );
  }

  $scope.viewProfitLoss = function(){
    $state.go("profitloss",{
      campus_id:$scope.campus_id,
      datestart:$scope.datestart,
      dateend:$scope.dateend
    });
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
  $scope.checkData = function(){
    return !(
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
      $http({
        method: 'post',
        url: 'https://rcim-app.herokuapp.com/users/create',
        data: {
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
"users"]);


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
