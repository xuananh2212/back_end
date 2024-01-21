'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const { User, Permission } = models;
      Role.belongsToMany(User, { through: 'User_Roles', foreignKey: 'role_id' });
      Role.belongsToMany(Permission, { through: 'Role_Permissions', foreignKey: 'role_id' });
    }
  }
  Role.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Role',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Role;
};