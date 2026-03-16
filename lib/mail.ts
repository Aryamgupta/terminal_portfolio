import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendOTP(email: string, otp: string) {
  const mailOptions = {
    from: `"Aryam Portfolio" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "Your Admin Access OTP",
    text: `Your OTP for admin access is: ${otp}. It will expire in 10 minutes.`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
          <h2 style="color: #333;">Admin Access OTP</h2>
          <p style="color: #666;">You've requested access to the admin dashboard. Use the OTP below to complete your login:</p>
          <div style="font-size: 32px; font-weight: bold; color: #FEA55F; text-align: center; margin: 30px 0; letter-spacing: 5px;">
            ${otp}
          </div>
          <p style="color: #999; font-size: 12px;">This OTP will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}
