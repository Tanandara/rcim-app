angular.module("general_journals").config([
  "$stateProvider",
  function($stateProvider){
    var date = moment().format("DD/MM/YYYY");

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
      params: {
            datestart :date,
            dateend:date
        },
      templateUrl:"/modules/general_journals/views/journal_detail.html"
    });
  }
]);
