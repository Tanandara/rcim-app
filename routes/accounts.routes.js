module.exports = function(app){
  var account = require("../controllers/accounts.controller");
  var queries = require("../controllers/queries");
  app.post("/account/create",account.CreateAccount);
  app.post("/account/update",account.UpdateAccount);
  app.post("/account/delete",account.DeleteAccount);
  app.get("/account_list",account.GetAllAccountsName);
}
