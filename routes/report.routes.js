module.exports = function(app){
  var trial = require("../controllers/trialbalances.controller");
  var profitloss = require("../controllers/profitloss.controller");
  var ledger = require("../controllers/ledgers.controller");
  var balancesheet = require("../controllers/balancesheet.controller");
  var queries = require("../controllers/queries");
  app.post("/trial_balance",trial.Query);
  app.post("/profit_loss",profitloss.Query);
  app.post("/ledger",ledger.Query);
  app.post("/ledger/brought_forward",ledger.BroughtForward);
  app.post("/balance_sheet",balancesheet.Query);
}
