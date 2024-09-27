import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "Gmail",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
});

export const sendEmail = async (userEmail: string, postContent: string) => {
  const info = await transporter.sendMail({
    from: '"Social Media Scheduler" <no-reply@example.com>', 
    to: userEmail,
    subject: 'Scheduled Post Reminder', 
    html: `Your post is scheduled: "${postContent}"`, 
  });
};
