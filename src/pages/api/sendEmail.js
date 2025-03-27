import nodemailer from 'nodemailer';
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false, 
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form:", err);
        return res.status(500).json({ message: "Error parsing form" });
      }

      console.log("Fields:", fields);
      console.log("Files:", files);

      const { name, vorname, email, region, questions } = fields;

      // Validate required fields
      if (!name ||!vorname || !email || !region || !questions) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Create transporter for sending email using Nodemailer
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
        // Verify the connection configuration for Nodemailer
        await transporter.verify();

        // Prepare the email HTML body
        const htmlContent = `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
            <h2 style="color: #2c3e50; text-align: center;">Neues Formular aus dem Jobs-Kontaktformular</h2>
            <p style="color: #34495e; text-align: center;">Nachfolgend finden Sie die Details:</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Name:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${name}</td>
              </tr>
                 <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Vorname:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${vorname}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Email:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Region:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${region}</td>
              </tr>
            </table>
            <p style="margin-top: 20px; color: #34495e; text-align: center;">Vielen Dank!</p>
          </div>
        `;

        // Prepare the attachments array, checking if CV exists
        let attachments = [];
        if (files.cv && Array.isArray(files.cv) && files.cv[0]?.filepath) {
          const cvFile = files.cv[0]; // Get the first file from the list
          const cvFileContent = fs.readFileSync(cvFile.filepath, { encoding: "base64" });
          attachments.push({
            filename: cvFile.originalFilename,
            content: cvFileContent,
            encoding: 'base64',
          });
        }

        // Send the email with the form data and attachment (if available)
        const info = await transporter.sendMail({
          from: `"Jobs Landing Page" <landingpage@phc.ch>`,
          to: 'landingpage@phc.ch',
          cc: ['jobs@phc.ch'],
          subject: `Formular: Jobs Landing Page ${name}`,
          html: htmlContent,
          attachments: attachments,
        });

        console.log("Message sent: %s", info.messageId);
        console.log("Message sent details: ", info);  // Log the details of the sent email

        res.status(200).json({ message: 'Email sent successfully!' });

      } catch (error) {
        console.error('Error sending email:', error.message);
        res.status(500).json({ error: `Failed to send email: ${error.message}` });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: 'Method not allowed' });
  }
}


