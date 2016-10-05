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
