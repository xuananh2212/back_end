'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserDevice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserDevice.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER
    },
    deviceId: {
      type: DataTypes.INTEGER
    },
    logOut: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'UserDevice',
  });
  return UserDevice;
};