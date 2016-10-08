angular.module("users").config([
  "$stateProvider",
  function($stateProvider){
    $stateProvider
      .state("user",
        {
            url:"/user",
            templateUrl:"/modules/users/views/userlist.html"
        }
      );
      // .state("adduser",
      // {
      //   url:"/user/add",
      //   templateUrl:"/modules/users/views/manageuser.html"
      // }
      // )
  }

]);
