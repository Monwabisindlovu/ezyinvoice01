// src/utils/sendEmail.ts
import nodemailer from 'nodemailer';

// Email configuration (adjust this to your email service provider)
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Can be any email service like Gmail, SendGrid, etc.
  auth: {
    user: process.env.EMAIL_USER,  // Use environment variables for sensitive data
    pass: process.env.EMAIL_PASS,  // Make sure to store this in a secure place
  },
});

// Function to send an email
export const sendEmail = async (to: string, subject: string, text: string, html: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,  // Sender email (use environment variable)
    to,  // Recipient email
    subject,  // Email subject
    text,  // Plain text body
    html,  // HTML formatted body (can include links, styling, etc.)
  };

  try {
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email: ', error);
  }
};

// Function to send a password reset email
export const sendPasswordResetEmail = async (to: string, resetToken: string) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const subject = 'Password Reset Request';
  const text = `You requested a password reset. Please click the following link to reset your password: ${resetLink}`;
  const html = `
    <p>You requested a password reset. Please click the following link to reset your password:</p>
    <a href="${resetLink}">Reset Password</a>
  `;

  await sendEmail(to, subject, text, html);
};

// Add a default export for sendPasswordResetEmail
export default sendPasswordResetEmail;
