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
          url: '/coa'
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
        url: '/coa/create',
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
        url: '/coa/update',
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
        url: '/coa/delete',
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
