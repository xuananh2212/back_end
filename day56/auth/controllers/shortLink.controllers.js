require('dotenv').config();
var moment = require('moment');
const shortid = require('shortid');
const qr = require('qrcode');
const { object, string, number, date, InferType } = require('yup');
const { ShortLink } = require("../models/index");
const MY_URL = process.env.URL;
module.exports = {
     index: async (req, res) => {
          const error = req.flash('error');
          const msgError = req.flash('msgError');
          const msgSuccess = req.flash('msgSuccess');
          const shortLinks = await ShortLink.findAll({
               order: [["createdAt", 'DESC']]
          });
          res.render('shortLinks/index', { shortLinks, moment, req, error, MY_URL, msgError, msgSuccess });
     },
     handleAddShortLink: async (req, res) => {
          let { url, password, checkOptions, id } = req.body;

          try {
               let schema = object({
                    url: string()
                         .required("vui lòng nhập url").matches(/^(http|https):\/\/([\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?)$/, "không đúng định dạng url"),
               });
               await schema.validate(req.body, { abortEarly: false });
               if (!checkOptions) {
                    checkOptions = [];
               }
               if (typeof checkOptions === 'string') {
                    checkOptions = [checkOptions]
               }
               if (checkOptions.includes("1")) {
                    if (id) {
                         const link = await ShortLink.findOne({
                              where: {
                                   urlShort: id
                              }
                         });
                         if (!link) {
                              await ShortLink.create({
                                   url,
                                   urlShort: id,
                                   password,
                                   safe: checkOptions.includes("0"),
                              })
                         }else{
                              req.flash('msgError', 'mã id đã tồn tại');
                         }
                    } else {
                         await ShortLink.create({
                              url,
                              urlShort: shortid.generate(),
                              password,
                              safe: checkOptions.includes("0"),
                         })
                    }
               } else {
                    await ShortLink.create({
                         url,
                         urlShort: shortid.generate(),
                         password,
                         safe: checkOptions.includes("0"),
                    })
               }
               req.flash('msgSuccess', 'Thêm Thành công');
          } catch (err) {
               req.flash('error', err?.message);
          }
          return res.redirect('/short-link');

     },
     redirectShortLink: async (req, res, next) => {
          const { id } = req.params;
          const errorPassword = req.flash('errorPassword');
          req.session.shortLinkId = id;
          try {
               const link = await ShortLink.findOne({
                    where: {
                         urlShort: id
                    }
               });
               if (!link) {
                    throw new Error('404');
               }
               const linkupdate = await ShortLink.update({
                    count: ++link.count
               }, {
                    where: {
                         urlShort: id
                    }
               })
               console.log(linkupdate, 111);
               if (!link.password) {
                    if (!link.safe) {
                         return res.redirect(`${link.url}`);
                    } else {
                         qr.toDataURL(link?.url, async (err, src) => {
                              if (err) {
                                   res.redirect(`/short-link/${id}`);
                              }
                              const urlAll = {
                                   url: link?.url,
                                   urlFacebook: `https://www.facebook.com/share.php?u=${link?.url}`,
                                   urlQrc: src,
                              }
                              res.render('shortLinks/safe', { urlAll });
                         })
                    }
               } else {
                    res.render('shortLinks/password', { errorPassword });
               }
          } catch (err) {
               next(new Error(err?.message));

          }

     },
     handleRedirectShortLink: async (req, res, next) => {
          const { id } = req.params;
          try {
               if (id !== req.session.shortLinkId) {
                    throw new Error('id không trùng lặp');
               }
               const { password } = req.body;
               if (password) {
                    const link = await ShortLink.findOne({
                         where: {
                              urlShort: id
                         }
                    });
                    if (!link) {
                         throw new Error('404');
                    }
                    if (link?.password === password) {
                         console.log(link.url);
                         if (!link.safe) {
                              return res.redirect(`${link.url}`);
                         } else {
                              qr.toDataURL(link?.url, async (err, src) => {
                                   if (err) {
                                        res.redirect(`/short-link/${id}`);
                                   }
                                   const urlAll = {
                                        url: link?.url,
                                        urlFacebook: `https://www.facebook.com/share.php?u=${link?.url}`,
                                        urlQrc: src
                                   }
                                   res.render('shortLinks/safe', { urlAll });
                              })
                         }
                    } else {
                         req.flash('errorPassword', 'mật khẩu không đúng!');
                         res.redirect(`/short-link/${id}`);

                    }
               } else {
                    req.flash('errorPassword', 'không để trống password!');
               }
          } catch (err) {
               next(new Error(err?.message));
          }

     }
}