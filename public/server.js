var express = require("express");
var app = express();

app.set('views', '/');
app.set('view engine', 'jade');
app.use(express.static(__dirname));
app.use("/",function(req,res){
  res.render("index");
});

app.listen(process.env.PORT || 5000);
module.exports = app;


console.log("running on port " + (process.env.PORT || 5000) );
