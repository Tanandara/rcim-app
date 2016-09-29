module.exports = function(sequelize, DataTypes) {
  var journals = sequelize.define('journals', {
    journal_id: {
                type:DataTypes.INTEGER ,
                primaryKey: true
              },
    journal_no: DataTypes.INTEGER,
    ref_no: DataTypes.STRING,
    coa_detail: DataTypes.STRING,
    coa_id: DataTypes.STRING,
    drcr: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL,
    date_time: DataTypes.DATE,
    campus_id:DataTypes.INTEGER,
    account_id:DataTypes.INTEGER,
    user_create:DataTypes.STRING,
    date_create:DataTypes.DATE,
    user_update:DataTypes.STRING,
    date_update:DataTypes.DATE
  },{
    freezeTableName: true
  });


  return journals;
};
