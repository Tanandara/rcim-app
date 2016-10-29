angular.module("service",[]);
angular.module("service")
.service('DropdownList', function($http,$q) {
    this.GET = function(url) {
      return $q(function(resolve, reject) {
                $http({
                 method: 'GET',
                 url: "/" + url
               }).success(function(data, status) {
                 resolve(data);
               });
             });
    }

});
