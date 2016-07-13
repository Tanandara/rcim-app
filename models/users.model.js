module.exports = function(sequelize, DataTypes) {
  var users = sequelize.define('users', {
    user_id: {
                type:DataTypes.STRING ,
                primaryKey: true
              },
    user_name: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    tel_no: DataTypes.STRING,
    address: DataTypes.STRING
  });

  return users;
};
