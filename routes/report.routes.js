module.exports = function(app){
  var trial = require("../controllers/trialbalances.controller");
  var queries = require("../controllers/queries");
  app.post("/trial_balance",trial.Query);
}
