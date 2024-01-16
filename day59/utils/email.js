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
const sendMail = async (to, subject, message, id) => {
     const info = await transporter.sendMail({
          from: `<${process.env.POSTGRES_MAIL_USER}>`, // sender address
          to, // list of receivers
          subject, // Subject line
          subject, // plain text body
          html: `${message} <img src="https://day59-alpha.vercel.app/check-read?id=${id}" width="1" height="1">`, // html body
     });
     return info;
}
module.exports = sendMail;