var express = require('express');
var router = express.Router();
const { Role, Permission } = require('../models/index');

/* GET users listing. */

router.get('/', function (req, res, next) {
     res.render('role/index.ejs')
});
router.post('/', async function (req, res, next) {
     const { name, permission } = req.body;
     // const role = await Role.findOrCreate({
     //      where: {
     //           name
     //      },
     //      defaults: {
     //           name
     //      }
     // })
     // console.log(role);
     // for (let i = 0; i < permission.length; i++) {
     //      const permissionFind = await Permission.findOrCreate({
     //           where: {
     //                value: permission[i]
     //           },
     //           defaults: {
     //                value: permission[i]
     //           }
     //      })
     //      console.log(role);
     //      const result = await role[0].addPermission(permissionFind[0]);
     //      console.log(result);
     // }

     const role = await Role.findOne({
          where: {
               name
          },
          include: [
               Permission
          ]
     })
     res.json(role);

     return res.redirect('/roles')
});


module.exports = router;
