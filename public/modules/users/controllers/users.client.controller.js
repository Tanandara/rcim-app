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
          url: 'http://localhost:3000/users'
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

      //  modalInstance.result.then(function (user_id) {
      //    $http({
      //      method: 'post',
      //      url: '/deleteUser',
      //      data: {
      //              userid : user_id
      //            }
      //    }).success(function(data, status) {
      //        $state.go('user', {}, { reload: true });
      //    });
      // });
    }



  }
]);

















//http://angular-ui.github.io/bootstrap/
angular.module('users').controller('deleteModalCtrl', function ($scope, $uibModalInstance, items) {
  $scope.user_id =items.user_id;
  $scope.ok = function () {
    //$uibModalInstance.close($scope.selected.item);
    $uibModalInstance.close($scope.user_id);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});



// เพิ่ม user
angular.module('users').controller('addModalCtrl', function ($scope, $uibModalInstance,$state) {
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
        url: 'http://localhost:3000/user/create',
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

      });




    // $uibModalInstance.dismiss();
    // if(status=="success"){
    //   $state.go("user");
    // }
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






//เอามาจาก http://stackoverflow.com/questions/14012239/password-check-directive-in-angularjs
angular.module("users").directive("passwordVerify", function() {
   return {
      require: "ngModel",
      scope: {
        passwordVerify: '='
      },
      link: function(scope, element, attrs, ctrl) {
        scope.$watch(function() {
            var combined;

            if (scope.passwordVerify || ctrl.$viewValue) {
               combined = scope.passwordVerify + '_' + ctrl.$viewValue;
            }
            return combined;
        }, function(value) {
            if (value) {
                ctrl.$parsers.unshift(function(viewValue) {
                    var origin = scope.passwordVerify;
                    if (origin !== viewValue) {
                        ctrl.$setValidity("passwordVerify", false);
                        return undefined;
                    } else {
                        ctrl.$setValidity("passwordVerify", true);
                        return viewValue;
                    }
                });
            }
        });
     }
   };
})
