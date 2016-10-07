
module.exports = function(app){
  var users = require("../controllers/users.controller");
  var login = require("../controllers/login.controller");
  var queries = require("../controllers/queries");


  app.get("/login",login.renderLoginPage);
  app.post("/users/login",users.LoginUser);
  app.get("/logout",login.destroySession);

  app.use("/",login.initRequest);


}
