const nodemailer = require("nodemailer");

module.exports = async (userEmail, subject, htmlTemplate) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.APP_EMAIL_ADDRESS,
        pass: process.env.APP_EMAIL_PASSWORD,
      },
    });

    const options = {
      to: userEmail,
      subject,
      html: htmlTemplate,
    };

    await transporter.sendMail(options);
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new Error("Internal server error (nodemailer)");
  }
};
