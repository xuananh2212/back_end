module.exports = function (permissions, value) {
     if (permissions.length) {
          const valuePermissions = permissions.map(({ value }) => value);
          console.log(valuePermissions, value, valuePermissions.includes(value));
          return valuePermissions.includes(value);
     }
}