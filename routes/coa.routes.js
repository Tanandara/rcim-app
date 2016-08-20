module.exports = function(app){
  var coa = require("../controllers/coa.controller");
  var queries = require("../controllers/queries");
  app.post("/coa",coa.Query);
}
