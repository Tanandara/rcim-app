var crypto = require('crypto');
module.exports = function(sequelize, DataTypes) {
  var users = sequelize.define('users', {
    user_id: {
                type:DataTypes.STRING ,
                primaryKey: true
              },
    user_name: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    salt: DataTypes.TEXT,
    tel_no: DataTypes.STRING,
    address: DataTypes.STRING,
    campus_id:DataTypes.INTEGER,
    role_id:DataTypes.INTEGER
  });


  users.beforeCreate((user, options) => {
    if(user.password){
      // ต้องเก็บเป็น Binary ==> user.salt = new Buffer(crypto.randomBytes(16).toString("base64"),"base64");
      user.salt = crypto.randomBytes(16).toString("base64");
      user.password = users.hashPassword(user.password,user.salt);
    }
  });

  users.hashPassword = function(password,salt){
    return crypto.pbkdf2Sync(password,salt,10000,64).toString("base64");
  }

  users.authenticate = function(raw,salt,password){
     console.log("hash password = " + password ,",raw password =" + raw ,",salt" + salt );
     return password == users.hashPassword(raw,salt);
  }


  return users;
};
