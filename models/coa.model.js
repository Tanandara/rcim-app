module.exports = function(sequelize, DataTypes) {
  var coa = sequelize.define('coa', {
    coa_id: {
                type:DataTypes.STRING ,
                primaryKey: true
              },
    coa_detail: DataTypes.STRING
  },{
    freezeTableName: true
  });
  return coa;
};
