// server/utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,     
        pass: process.env.EMAIL_PASS,     
      },
    });

    const info = await transporter.sendMail({
      from: `"WebPost Builder" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log('✅ Email sent:', info.response);
  } catch (err) {
    console.error('❌ Email send error:', err.message);
    throw new Error('Email could not be sent');
  }
};

module.exports = sendEmail;
