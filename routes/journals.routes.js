module.exports = function(app){
  var journals = require("../controllers/journals.controller");
  var queries = require("../controllers/queries");
  app.post("/journals/add",journals.CheckRefNo,journals.AddJournals);
  app.post("/journal_detail",journals.ShowDetails);
  app.post("/journals/test",journals.test,journals.test2);
}
