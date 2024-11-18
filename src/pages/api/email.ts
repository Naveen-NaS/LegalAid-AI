// // pages/api/emails.ts

// import { Resend } from 'resend';
// import { NextApiRequest, NextApiResponse } from 'next';
// import { p } from 'framer-motion/client';

// const resend = new Resend(process.env.RESEND_API_KEY); 

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     const { name, email, subject, message } = req.body;

//     try {
//       await resend.emails.send({
//         from: 'onboarding@resend.dev', 
//         to: 'ekansh.20004@gmail.com', 
//         subject: subject || 'New Contact Form Submission',
//         html: `
//           <h3>New Contact Form Submission</h3>
//           <p><strong>Name:</strong> ${name}</p>
//           <p><strong>Email:</strong> ${email}</p>
//           <p><strong>Subject:</strong> ${subject}</p>
//           <p><strong>Message:</strong></p>
//           <p>${message}</p>
//         `,
//       });

//       return res.status(200).json({ success: true });
//     } catch (error) {
//       console.error('Error sending email:', error);
//       return res.status(500).json({ success: false });
//     }
//   }

//   return res.status(405).json({ message: 'Method not allowed' });
// }


import { NextApiRequest, NextApiResponse } from 'next';

// Import the EmailJS SDK
import emailjs from 'emailjs-com';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, email, subject, message } = req.body;

    // Define your EmailJS service, template ID, and public key
    const EMAIL_JS_SERVICE_ID = process.env.EMAIL_JS_SERVICE_ID as string;
    const EMAIL_JS_TEMPLATE_ID = process.env.EMAIL_JS_TEMPLATE_ID as string;
    const EMAIL_JS_PUBLIC_KEY = process.env.EMAIL_JS_PUBLIC_KEY as string;

    // Prepare the data for EmailJS
    const templateParams = {
      from_name: name,
      from_email: email,
      subject: subject || 'New Contact Form Submission',
      message: message,
    };

    try {
      // Send email using EmailJS
      await emailjs.send(EMAIL_JS_SERVICE_ID, EMAIL_JS_TEMPLATE_ID, templateParams, EMAIL_JS_PUBLIC_KEY);

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error sending email via EmailJS:', error);
      return res.status(500).json({ success: false });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}