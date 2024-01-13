'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Device extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
     Device.belongsToMany(models.User, {
      through: models.UserDevice,
      foreignKey: "deviceId"
     })
      // define association here
    }
  }
  Device.init({
    id:{
       type: DataTypes.INTEGER,
       autoIncrement: true,
       primaryKey: true
    },
    browser: DataTypes.STRING,
    os: DataTypes.STRING,
    desc: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Device',
  });
  return Device;
};