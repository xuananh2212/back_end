module.exports = function (roles, id) {
     if (roles.length) {
          const nameRole = roles.map(({ id }) => id);
          return nameRole.includes(+id);
     }
     return false;
}