'use strict';
module.exports = {
     up: (queryInterface, Sequelize) => {
          return queryInterface.renameColumn('User_Permissions', 'UserId', 'userId', {
               type: Sequelize.STRING,
          })
     },
     down: (queryInterface, Sequelize) => {
          return queryInterface.renameColumn('User_Permissions', 'userId', 'UserId', {
               type: Sequelize.STRING,
          })
     }
};