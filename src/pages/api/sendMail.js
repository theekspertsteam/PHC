import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, message } = req.body;  // Extract fields from request body

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create transporter for sending email
    const transporter = nodemailer.createTransport({
      host: 'asmtp.mail.hostpoint.ch',
      port: 465,
      secure: true,
      auth: {
        user: 'landingpage@phc.ch',
        pass: '45uYjTaR_N!x4AE',
      },
    });

    try {
      // Verify connection configuration
      await transporter.verify();

      // Send the email with the form data
      const info = await transporter.sendMail({
        from: `"Contact Form" <landingpage@phc.ch>`,
    
        to: 'landingpage@phc.ch',  // Send email to your address
        cc: ['info@phc.ch', 'edita.latifi@the-eksperts.com',],
        subject: `New Contact Form Submission from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
            <h2 style="color: #2c3e50; text-align: center;">New Message from Contact Form</h2>
            <p style="color: #34495e;">You have received a new message from the contact form. Below are the details:</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Name:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Email:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Message:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${message}</td>
              </tr>
            </table>
            <p style="margin-top: 20px; color: #34495e; text-align: center;">Thank you for contacting us!</p>
          </div>
        `,
      });

      // Log the sent email details
      console.log("Message sent: %s", info.messageId);  // Logging messageId
      console.log("Message sent details: ", info);  // Detailed info about the email

      // Send success response
      res.status(200).json({ message: 'Email sent successfully!' });

    } catch (error) {
      console.error('Error sending email:', error.message);
      res.status(500).json({ error: `Failed to send email: ${error.message}` });
    }
  } else {
    // Handle non-POST methods
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: 'Method not allowed' });
  }
}