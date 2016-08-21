module.exports = function(sequelize, DataTypes) {
  var journals = sequelize.define('journals', {
    journal_id: {
                type:DataTypes.INTEGER ,
                primaryKey: true
              },
    journal_no: DataTypes.INTEGER,
    coa_detail: DataTypes.STRING,
    coa_id: DataTypes.STRING,
    drcr: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL,
    date_time: DataTypes.DATE,
    campus_id:DataTypes.INTEGER,
    user_id:DataTypes.STRING,
    date_create:DataTypes.DATE
  },{
    freezeTableName: true
  });


  return journals;
};
