const { Role, Permission } = require('../models/index');
const { object, string, number, date, InferType } = require('yup');
const { Op } = require("sequelize");
const checkPermission = require('../utils/checkPermission');
module.exports = {
     index: async (req, res, next) => {
          const { user: { id } } = req;
          const roles = await Role.findAll();
          const success = req.flash('success');
          res.render('roles/index', { roles, success });
     },
     addRole: async (req, res) => {
          const error = req.flash('error');
          const success = req.flash('success');
          res.render('roles/add', { error, success });
     },
     handleAddRole: async (req, res) => {
          try {
               let schema = object({
                    name: string()
                         .required('Vui lòng tên role')
                         .test("unique", "Tên role đang tồn tại", async (value) => {
                              const role = await Role.findOne({
                                   where: {
                                        name: value
                                   }
                              })
                              return role ? false : true

                         }),
               });
               const body = await schema.validate(req.body, { abortEarly: false });
               let { permission, name } = body;
               if (!permission) {
                    throw new Error('vui lòng chọn quyền');
               } else {
                    const role = await Role.create({
                         name
                    })
                    if (typeof permission === 'string') {
                         permission = [permission];
                    }
                    for (let i = 0; i < permission.length; i++) {
                         const permissionFind = await Permission.findOrCreate({
                              where: {
                                   value: permission[i]
                              },
                              defaults: {
                                   value: permission[i]
                              }
                         });
                         await role.addPermission(permissionFind[0]);
                    }
                    req.flash('success', 'Thêm role thành công');
               }
          } catch (err) {
               const error = err?.message;
               req.flash('error', error);
          }
          return res.redirect('/roles/add');
     },
     editRole: async (req, res, next) => {
          let { id } = req.params;
          id = +id;
          console.log(id);
          req.session.roleId = id;
          const error = req.flash('error');
          const success = req.flash('success');

          try {
               const roleCurrent = await Role.findOne({
                    where: {
                         id
                    },
                    include: [
                         {
                              model: Permission,
                              through: {
                                   attributes: []
                              }
                         }
                    ]
               });

               if (!roleCurrent) {
                    throw new Error('404 page not found');
               }
               //res.json(roleCurrent);
               const roles = await Role.findAll();
               res.render('roles/edit', { roles, roleCurrent, error, success, checkPermission });
          } catch (err) {
               return next(new Error('404 page not found'));
          }
     },
     handleEditRole: async (req, res) => {
          let { id } = req.params;
          id = +id;
          try {
               let schema = object({
                    name: string()
                         .required('Vui lòng tên role')
                         .test("unique", "Tên role đang tồn tại", async (value) => {
                              const role = await Role.findOne({
                                   where: {
                                        name: value,
                                        id: {
                                             [Op.ne]: id
                                        }
                                   }
                              })
                              return role ? false : true

                         }),
               });
               const body = await schema.validate(req.body, { abortEarly: false });
               let { permission, name } = body;
               if (+id !== req.session.roleId) {
                    throw new Error('lỗi id không trùng!');
               }
               if (!permission) {
                    throw new Error('vui lòng chọn quyền');
               } else {
                    const role = await Role.findByPk(id);
                    if (typeof permission === 'string') {
                         permission = [permission];
                    }
                    console.log(permission);
                    await Role.update({ name },
                         {
                              where: {
                                   id
                              }
                         })
                    const permissionSelects = await Promise.all(
                         permission.map((value) => Permission.findOne({
                              where: {
                                   value
                              }
                         }))
                    );
                    console.log(permissionSelects);
                    const result = await role?.setPermissions(permissionSelects);
                    // res.json(result);
                    req.flash('success', 'cập nhật role thành công');
               }
          } catch (err) {
               const error = err?.message;
               req.flash('error', error);
          }
          return res.redirect(`/roles/edit/${id}`);


     },
     handleDeleteRole: async (req, res, next) => {
          let { id } = req.params;
          id = +id;
          try {
               const role = await Role.findByPk(id);
               if (!role) {
                    throw new Error('404 page not found');
               }
               await role.setPermissions([]);
               await Role.destroy({
                    where: {
                         id
                    }
               })
               req.flash('success', 'xoá thành công');
               return res.redirect('/roles');

          } catch (err) {
               next(new Error(err?.message));

          }

     }


}