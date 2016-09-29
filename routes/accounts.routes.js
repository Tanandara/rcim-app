module.exports = function(app){
  var account = require("../controllers/accounts.controller");
  var queries = require("../controllers/queries");
  app.get("/account_list",account.GetAllAccountsName);
}
