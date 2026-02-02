import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { animalName, phone, email, message } = await request.json();

    // Validate required fields
    if (!phone && !email) {
      return NextResponse.json(
        { error: 'Phone or email is required' },
        { status: 400 }
      );
    }

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Build the email content
    const subject = `Diehonnemense.co.za Enquiry : ${animalName}`;
    const body = `
New enquiry about ${animalName}

Contact Details:
${phone ? `Phone: ${phone}` : ''}
${email ? `Email: ${email}` : ''}

Message:
${message}
    `.trim();

    // Log the enquiry (for debugging/backup)
    console.log('=== New Enquiry ===');
    console.log('Subject:', subject);
    console.log('Body:', body);
    console.log('==================');

    // For now, we'll use a mailto link approach on the client side
    // In production, you would integrate with an email service like:
    // - SendGrid
    // - Mailgun
    // - AWS SES
    // - Nodemailer with SMTP

    // If you have nodemailer configured, uncomment and configure:
    /*
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@diehonnemense.co.za',
      to: 'diehonnemense@gmail.com',
      subject,
      text: body,
      replyTo: email || undefined,
    });
    */

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Enquiry error:', error);
    return NextResponse.json(
      { error: 'Failed to send enquiry' },
      { status: 500 }
    );
  }
}
