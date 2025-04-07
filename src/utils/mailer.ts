// src/utils/mailer.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInvite(email: string, teamName: string) {
    try {
        await resend.emails.send({
            from: 'BuddyBook <onboarding@resend.dev>', // or your domain if verified
            to: email,
            subject: `You've been invited to ${teamName}!`,
            html: `
        <p>Hello,</p>
        <p>You’ve been invited to join <strong>${teamName}</strong> on BuddyBook.</p>
        <p><a href="http://localhost:5173/">Click here to join</a></p>
        <p>See you there!</p>
      `,
        });
    } catch (error) {
        console.error('Failed to send invite:', error);
        throw error;
    }
}
