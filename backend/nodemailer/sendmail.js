"use strict";
const nodemailer = require("nodemailer");
const axios = require("axios");

const transporter = nodemailer.createTransport({
  host: "localhost",
  port: 5001,
  secure: true,
  service: "gmail",
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: "dailyhypeteam2023@gmail.com",
    pass: "jkbx grst cgiq hdwy",
  },
});

const getPublicIpAddress = async () => {
    try {
      const response = await axios.get("https://api64.ipify.org?format=json");
      return response.data.ip;
    } catch (error) {
      console.error("Error fetching public IP address:", error.message);
      return null;
    }
  };

module.exports.sendEmail = async function sendEmail(email) {
    const generatedCode = Math.floor(100000 + Math.random() * 900000);
    const publicIpAddress = await getPublicIpAddress();
    const info = await transporter.sendMail({
        from: 'dailyhypeteam2023@gmail.com', // sender address
        to: email, // list of receivers
        subject: `${generatedCode} is your verification Code`,
        html: `
          <div style="font-family: 'Arial', sans-serif; padding: 20px; max-width: 500px; margin: 12px auto; background-color: #f4f4f4;">
            <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
              <h1 style="color: #333; text-align: center;">DailyHype</h1>
              <h2 style="color: #333; text-align: center;">Verification Code</h2>
              <p style="color: #333; text-align: center; font-size: 18px;">Enter the following verification code when prompted:</p>
              <div style="background-color: #007bff; max-width: 300px; margin: 0 auto; color: #fff; text-align: center; font-size: 32px; padding: 10px; border-radius: 4px;">
                ${generatedCode}
              </div>
              <p style="color: #333; text-align: center; font-size: 16px;">To protect your account, do not share this code.</p>
              <p style="color: #333; text-align: center; font-size: 16px;">Your IP Address: ${publicIpAddress}
              This is computer generated email.Please don't reply to this.
              </p>
            </div>
          </div>
        `,
        text: `DailyHype - Verification Code: ${generatedCode}`,
      });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  //
  // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
  //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
  //       <https://github.com/forwardemail/preview-email>
  //
}