module.exports = function(app){
  var coa = require("../controllers/coa.controller");
  var queries = require("../controllers/queries");
  app.post("/coa",coa.Query);
  app.post("/coa/create",coa.CreateCoa);
  app.post("/coa/update",coa.UpdateCoa);
  app.post("/coa/delete",coa.DeleteCoa);
  app.get("/coa",coa.GetAllCoa);

}
