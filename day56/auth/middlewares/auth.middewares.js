const jwt = require('jsonwebtoken');
const authMiddleWare = {
     handlReffeshToken: (refresh_token, req, res, next) => {
          if (!refresh_token) {
               return res.redirect('/dang-nhap');
          } else {
               jwt.verify(refresh_token, process.env.JWT_REFRESH_KEY, (err, user) => {
                    if (err) {
                         console.log('loi');
                         return res.redirect('/dang-nhap');
                    } else {
                         const accessToken = jwt.sign({
                              id: user.id,
                              isAdmin: user.isAdmin,
                              email: user.email
                         }, process.env.JWT_ACCESS_KEY, {
                              expiresIn: '1h'
                         })
                         const refreshToken = jwt.sign({
                              id: user.id,
                              isAdmin: user.isAdmin,
                              email: user.email
                         }, process.env.JWT_REFRESH_KEY, {
                              expiresIn: '1h'
                         })
                         req.user = user;
                         res.setHeader("Set-Cookie", [`access_token=${accessToken};path=/;HttpOnly;`,
                         `refresh_token = ${refreshToken}; path =/;HttpOnly`]);
                         next();
                    }


               });

          }
     },
     index: (req, res, next) => {
          const access_token = req.cookies.access_token;
          const refresh_token = req.cookies.refresh_token;
          if (access_token) {
               jwt.verify(access_token, process.env.JWT_ACCESS_KEY, (err, user) => {
                    if (err) {
                         authMiddleWare.handlReffeshToken(refresh_token, req, res, next);
                    } else {
                         req.user = user;
                         next();
                    }
               })
          } else {
               authMiddleWare.handlReffeshToken(refresh_token, req, res, next);

          }
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