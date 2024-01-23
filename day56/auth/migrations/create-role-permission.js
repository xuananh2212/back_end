'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
     async up(queryInterface, Sequelize) {
          await queryInterface.createTable('Role_Permissions', {
               id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER
               },
               permissionId: {
                    type: Sequelize.INTEGER,
                    references: {
                         model: {
                              tableName: 'Permissions',
                         },
                         key: 'id'
                    },
                    allowNull: false

               },
               roleId: {
                    type: Sequelize.INTEGER,
                    references: {
                         model: {
                              tableName: 'Roles',
                         },
                         key: 'id'
                    },
                    allowNull: false
               },
               createdAt: {
                    allowNull: false,
                    type: Sequelize.DATE
               },
               updatedAt: {
                    allowNull: false,
                    type: Sequelize.DATE
               }
          });
     },
     async down(queryInterface, Sequelize) {
          await queryInterface.dropTable('Role_Permissions');
     }
};