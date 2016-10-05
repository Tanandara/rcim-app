angular.module("general_journals").config([
  "$stateProvider",
  function($stateProvider){
    var date = moment().format("DD/MM/YYYY");

    $stateProvider
    .state("journalizing",{
      url:"/journalizing",
      templateUrl:"/modules/general_journals/views/journalizing.html"
    })
    .state("searchrefno",{
      url:"/searchrefno",
      templateUrl:"/modules/general_journals/views/searchrefno.html"
    })
    .state("editjournal",{
      url:"/editjournal",
      params: {
            ref_no : "59/0001"
      },
      templateUrl:"/modules/general_journals/views/editjournalizing.html"
    })
    .state("journals",{
      url:"/journals",
      templateUrl:"/modules/general_journals/views/journals.html"
    })
    .state("journaldetail",{
      url:"/journals/details",
      params: {
            datestart :date,
            dateend:date,
            ref_no:""
        },
      templateUrl:"/modules/general_journals/views/journal_detail.html"
    });
  }
]);
