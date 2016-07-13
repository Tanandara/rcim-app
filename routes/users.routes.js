module.exports = function(app){
  var users = require("../controllers/users.controller");
  var queries = require("../controllers/queries");
  app.get("/users",users.GetAllUsers);
  app.get("/users/:id",users.GetUser);
  app.post("/users/create",users.CreateUser);
  app.post("/users/delete",users.DeleteUser);
  app.post("/users/update",users.UpdateUser);
  // Custom Query in users model
  app.get("/user/query",users.Query);



  // Custom Query
  app.get("/queries",queries.user_views);
  app.get("/queries/:id",queries.user_views_query);
}
