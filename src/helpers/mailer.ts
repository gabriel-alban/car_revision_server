import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

export async function sendWelcomeEmail(to: string, username: string) {
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject: "Welcome to Car Revision",
    text: `Hi ${username}, your account is ready.`,
    html: `<p>Hi <b>${username}</b>, your account is ready.</p>`
  });
}