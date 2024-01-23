'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
     async up(queryInterface, Sequelize) {
          await queryInterface.createTable('User_Permissions', {
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
               userId: {
                    type: Sequelize.INTEGER,
                    references: {
                         model: {
                              tableName: 'Users',
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
          await queryInterface.dropTable('User_Permissions');
     }
};