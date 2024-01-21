'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
     async up(queryInterface, Sequelize) {
          await queryInterface.createTable('User_Roles', {
               id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER
               },
               user_id: {
                    type: Sequelize.INTEGER,
                    references: {
                         model: {
                              tableName: 'Users'
                         }

                    }
               },
               role_id: {
                    type: Sequelize.INTEGER,
                    references: {
                         model: {
                              tableName: 'Roles'
                         }
                    }
               },
               created_at: {
                    allowNull: false,
                    type: Sequelize.DATE
               },
               updated_at: {
                    allowNull: false,
                    type: Sequelize.DATE
               }
          });
     },
     async down(queryInterface, Sequelize) {
          await queryInterface.dropTable('User_Roles');
     }
};