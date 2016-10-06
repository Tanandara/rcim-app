module.exports = function(app){
  var journals = require("../controllers/journals.controller");
  var queries = require("../controllers/queries");
  app.post("/journals/add",journals.CheckRefNo,journals.AddJournals);
  app.post("/journals/update",journals.UpdateJournals);
  app.post("/journals/search",journals.GetJournal);
  app.post("/journal_detail",journals.ShowDetails);
  app.get("/journals/broughtforward",journals.GetBroughtForward);
}
