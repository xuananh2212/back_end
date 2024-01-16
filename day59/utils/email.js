require('dotenv').config();
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
     host: process.env.MAIL_HOST, // host của email server
     port: process.env.MAIL_PORT, // cổng
     secure: true,
     auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
     },
});
const sendMail = async (to, subject, message, id) => {
     const info = await transporter.sendMail({
          from: `<${process.env.MAIL_USER}>`, // sender address
          to, // list of receivers
          subject, // Subject line
          subject, // plain text body
          html: `${message} <img src="http://localhost:3000/email/tracking-pixel.png/${id}" width="1" height="1" alt="tracking pixel">`, // html body
     });
     return info;
}
module.exports = sendMail;