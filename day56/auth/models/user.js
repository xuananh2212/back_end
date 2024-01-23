'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsToMany(models.Device, {
        through: models.UserDevice,
        foreignKey: "userId"
      });
      User.belongsTo(models.Provider, {
        foreignKey: "providerId"
      });
      User.belongsToMany(models.Permission,
        {
          through: 'User_Permissions',
          foreignKey: 'userId'
        });
      User.belongsToMany(models.Role
        , {
          through: 'User_Roles',
          foreignKey: 'userId'
        });
    }
  }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    status: DataTypes.INTEGER,
    providerId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};