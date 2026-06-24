import nodemailer from 'nodemailer'
import 'dotenv/config'

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})

export interface iCreateMail {
    to: string,
    subject: string,
    text: string
}

export const sendEmail = async ({ to, subject, text }: iCreateMail) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject,
            text
        })
        console.log("Email sent:", info.messageId);

        return info
    } catch (error) {
        console.error("Failed to send email:", error)
        throw error
    }
}