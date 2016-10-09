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
          //console.log("$scope.avatar :",$scope.avatar);
          if($scope.avatar){
            var fd = new FormData();
              fd.append('avatar', $scope.avatar);
              fd.append('userid', data.id);
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
