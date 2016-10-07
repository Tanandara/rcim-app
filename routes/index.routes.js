module.exports = function(app){
  app.get("/",function(req,res){
    //res.send("welcome to the rcim api");
	  res.render("index");
  });
}
