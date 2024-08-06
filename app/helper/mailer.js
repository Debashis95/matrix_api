const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, message: 'Email sent successfully', messageId: info.messageId };
  } catch (error) {
    return { success: false, message: 'Error sending email', error: error.message };
  }
};

module.exports = sendEmail;
