import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { AdminNotification } from '@/emails/AdminNotification';
import { AutoResponder } from '@/emails/AutoResponder';
import * as React from 'react';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const name = data.name as string;
    const email = data.email as string;
    const message = data.message as string;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (name.length > 100 || email.length > 100 || message.length > 2000) {
      return NextResponse.json({ error: 'Payload too large. Please keep your message concise.' }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY || 'dummy_key_for_build';
    const resend = new Resend(resendApiKey);
    const adminEmail = process.env.EMAIL_USER as string;

    // Use custom domain if available, fallback to onboarding for testing
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Harshit Jaiswal <hello@harshitj183.in>';

    // Send the notification to the admin (you)
    const { data: adminData, error: adminError } = await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `New Portfolio Message from ${name}`,
      replyTo: email,
      react: AdminNotification({ name, email, message }) as React.ReactElement,
    });

    if (adminError) {
      console.error('Error sending admin email:', adminError);
      return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
    }

    // Send autoresponder to the user
    try {
      await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: `Thanks for reaching out, ${name}!`,
        react: AutoResponder({ name }) as React.ReactElement,
      });
    } catch (autoResponderError) {
      console.warn('Autoresponder skipped (likely unverified domain on free tier):', autoResponderError);
    }

    return NextResponse.json({ success: true, data: adminData });
  } catch (err) {
    console.error('Unexpected error in contact route:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
