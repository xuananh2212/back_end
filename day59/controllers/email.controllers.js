const { object, string } = require('yup');
const moment = require('moment');
const path = require('path');
const sendMail = require('../utils/email');
const SendEmail = require('../models/index').SendEmail;
module.exports = {
     sendEmail: (req, res) => {
          const error = req.flash('error');
          const msg = req.flash('msg');
          console.log(msg);
          res.render('email/email', { error, msg });
     },
     handleSendEmail: async (req, res) => {
          try {
               let schema = object({
                    email: string().required('Email không được để trống').email('Email không đúng định dạng!')
               });
               const body = await schema.validate(req.body, {
                    abortEarly: false
               })
               const { email, title, desc } = body;
               const sendEmail = await SendEmail.create(body);
               await sendMail(email, title, desc, sendEmail.id);
               req.flash('msg', 'Gửi Mail thành công');
          } catch (err) {
               console.log(err);
               req.flash('msg', 'lỗi');
               //   res.json(err);
               req.flash('error', err?.inner[0]?.message);
          }

          res.redirect('/email');
     },
     historyAll: async (req, res, next) => {
          try {
               const sendEmails = await SendEmail.findAll();
               res.render('email/history', { sendEmails, moment });
          } catch (err) {
               next(new Error('lỗi server'));
          }
     },
     historyDetail: async (req, res, next) => {
          const { id } = req.params;
          try {
               const sendEmail = await SendEmail.findByPk(+id);
               if (!sendEmail) {
                    return next(new Error('id không tồn tại'));
               }
               res.render('email/historyDetail', { sendEmail, moment })

          } catch (err) {
               next(new Error('id không tồn tại'));
          }
     },
     handleReadEmail: async (req, res, next) => {
          const { id } = req.query;
          try {
               const email = await SendEmail.update({
                    status: true
               }, {
                    where: {
                         id
                    }
               })
               console.log(email);
          } catch (err) {
               console.log(err);
          }
          return res.redirect('/email')
     }

}