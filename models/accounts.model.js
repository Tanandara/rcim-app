module.exports = function(sequelize, DataTypes) {
  var accounts = sequelize.define('accounts', {
    account_id: {
                type:DataTypes.INTEGER ,
                primaryKey: true
              },
    account_name: DataTypes.STRING,
    user_create:DataTypes.STRING,
    date_create:DataTypes.DATE,
    user_update:DataTypes.STRING,
    date_update:DataTypes.DATE
  },{
    freezeTableName: true
  });


  return accounts;
};
