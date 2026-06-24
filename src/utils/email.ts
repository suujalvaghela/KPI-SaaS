import nodemailer from 'nodemailer'
import 'dotenv/config'

console.log({
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS
})

const transporter = nodemailer.createTransport({
    service: 'gmail',
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