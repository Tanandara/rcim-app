var config    = require("../config/sequelize");
var Sequelize = require("sequelize");
var sequelize = new Sequelize(config.mysql,{
                                        query:{
                                          raw:true
                                        },
                                        define: {
                                        timestamps: false
                                        }
                                      });

//-------------------------------------------------------------------

exports.user_views = function(req,res){
    sequelize.query("SELECT * FROM users_view", { type: Sequelize.QueryTypes.SELECT})
      .then(function(users) {
        console.log(users);
        res.json(users);
      });
}

exports.user_views_query = function(req,res){
    sequelize.query("SELECT * FROM users_view where user_id = :user_id",
                      {
                        replacements: { user_id: req.params.id },
                        type: Sequelize.QueryTypes.SELECT
                      })
      .then(function(users) {
        console.log(users);
        res.json(users);
      });
}
