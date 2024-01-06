const jwt = require('jsonwebtoken');
const authMiddleWare = {
     index: (req, res, next) => {
          const token = req.cookies.access_token;
          console.log(process.env.JWT_ACCESS_KEY, 111111);
          if (token) {
               jwt.verify(token, process.env.JWT_ACCESS_KEY, (err, user) => {
                    if (err) {
                         return res.redirect('/dang-nhap');
                    }
                    req.user = user;
               })

          } else {
               return res.redirect('/dang-nhap');
          }
          next();

     },
     loginAndRegister: async (req, res, next) => {
          const token = req.cookies.access_token;
          console.log(token);
          if (token) {
               jwt.verify(token, process.env.JWT_ACCESS_KEY, (err) => {
                    if (!err) {
                         return res.redirect('/');
                    } else {
                         next();
                    }
               })
          } else {
               next();
          }

     }

}
module.exports = authMiddleWare;