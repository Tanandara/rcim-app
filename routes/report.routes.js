module.exports = function(app){
  var trial = require("../controllers/trialbalances.controller");
  var profitloss = require("../controllers/profitloss.controller");
  var queries = require("../controllers/queries");
  app.post("/trial_balance",trial.Query);
  app.post("/profit_loss",profitloss.Query);
}
