const { User, Role } = require('../models/index');
const checkRole = require('../utils/checkRole');
const authController = require('./auth.controllers');
module.exports = {
     index: async (req, res, next) => {
          const users = await User.findAll();
          const page = 0;
          const totalPage = 0;
          const success = req.flash('success');
          res.render('users/index', { users, page, totalPage, success });
     },
     handleDelete: async (req, res, next) => {
          const { id: userId } = req.user;
          const { id } = req.params;
          console.log(userId, id);
          try {
               const user = await User.findByPk(id);
               console.log(user, 1111);
               if (!user) {
                    throw new Error('404 Not Found');
               }
               user.setRoles([]);
               user.setPermissions([]);
               await User.destroy({
                    where: {
                         id
                    }
               });
               if (+id === +userId) {
                    req.flash('msg', 'bạn đã bị xoá ra khỏi hệ thống!');
                    return await authController.logOut(req, res);
               }
               req.flash('success', 'Xoá User thành công');
               res.redirect('/users');

          } catch (err) {
               console.log(err, 11111);
               next(new Error(err?.message));
          }
     },
     addRolePermission: async (req, res, next) => {
          let { id } = req.params;
          id = +id;
          req.session.userId = id;
          const success = req.flash('success');
          try {
               const user = await User.findOne({
                    where: {
                         id
                    },
                    include: [
                         {
                              model: Role,
                              through: {
                                   attributes: []
                              }
                         }
                    ]
               });
               ;
               if (!user) {
                    throw new Error('404 page not found');
               }
               console.log(user.Roles);
               const roles = await Role.findAll();
               res.render('users/rolePermission', { roles, user, checkRole, success });

          } catch (err) {
               next(new Error(err?.message));

          }
     },
     handleAddRolePermission: async (req, res, next) => {
          let { id } = req.params;
          id = +id;
          let { permission } = req.body;
          try {
               if (id !== +req.session.userId) {
                    throw new Error('lỗi id bị thay đổi');
               }
               const user = await User.findByPk(id);
               if (!permission) {
                    await user?.setRoles([]);
               } else {
                    console.log(1);
                    if (typeof permission === 'string') {
                         permission = [permission];
                    }
                    console.log(permission);
                    const rolePermissionSelects = await Promise.all(
                         permission.map((id) => Role.findByPk(id))
                    )
                    await user?.setRoles(rolePermissionSelects);
                    req.flash('success', 'cập nhật phân quyền thành công');
               }
               return res.redirect(`/users/role-permission/${id}`);
          } catch (err) {
               console.log(err);
               next(new Error(err?.message));

          }
     }
}