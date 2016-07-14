angular.module("general_journals").config([
  "$stateProvider",
  function($stateProvider){
    $stateProvider
    .state("journalizing",{
      url:"/journalizing",
      templateUrl:"/modules/general_journals/views/journalizing.html"
    })
    .state("journals",{
      url:"/journals",
      templateUrl:"/modules/general_journals/views/journals.html"
    })
    .state("journaldetail",{
      url:"/journals/details",
      templateUrl:"/modules/general_journals/views/journal_detail.html"
    });
  }
]);
