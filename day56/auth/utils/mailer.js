"use strict";
require('dotenv').config();
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
     host: process.env.POSTGRES_MAIL_HOST, // host của email server
     port: process.env.POSTGRES_MAIL_PORT, // cổng
     secure: true,
     auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: process.env.POSTGRES_MAIL_USER,
          pass: process.env.POSTGRES_MAIL_PASSWORD,
     },
});
module.exports = async function sendMail(to, subject, html) {
     // send mail with defined transport object
     const info = await transporter.sendMail({
          from: `<${process.env.POSTGRES_MAIL_USER}>`, // sender address
          to, // list of receivers
          subject, // Subject line
          subject, // plain text body
          html // html body
     });

     return info;
}
