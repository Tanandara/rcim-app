angular.module("users",[]);
angular.module("users", []).run(["$rootScope","$http",function($rootScope,$http) {
        $rootScope.LoadLookups = function(scope,model,url){return LoadLookups(scope,model,url,$http)}
}]);
