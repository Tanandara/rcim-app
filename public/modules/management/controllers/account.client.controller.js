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
