import nodemailer from "nodemailer";

export async function sendBookingEmail(
  toEmail: string,
  userName: string,
  tokenId: string,
  tokenNumber: string,
  branchName: string,
  serviceName: string,
  estimatedServeTime: Date
) {
  try {
    let transporter;

    // Use Gmail if provided, else use Ethereal for testing
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      console.log(`📡 Attempting to send email to ${toEmail} using Gmail...`);
      transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // Use SSL
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    } else {
      console.warn("⚠️ No EMAIL_USER and EMAIL_PASS provided in .env, falling back to Ethereal mock email.");
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    // High quality QR code via QRServer API
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
      JSON.stringify({ id: tokenId, token: tokenNumber, branch: branchName, timestamp: Date.now() })
    )}&color=0742a1`;

    const htmlContent = `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #0f172a; margin-bottom: 4px; font-size: 28px;">Booking Confirmed!</h1>
          <p style="color: #64748b; font-size: 16px;">Hi ${userName}, you're successfully added to the virtual queue.</p>
        </div>

        <div style="background-color: white; border-radius: 12px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #f1f5f9; padding-bottom: 16px; margin-bottom: 16px;">
            <div>
              <p style="margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: bold;">Token Number</p>
              <h2 style="margin: 4px 0 0; color: #2563eb; font-size: 32px; font-weight: 900; letter-spacing: 2px;">${tokenNumber}</h2>
            </div>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; color: #475569; font-weight: 600; width: 40%;">Branch</td>
              <td style="padding: 8px 0; color: #0f172a;">${branchName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #475569; font-weight: 600;">Service</td>
              <td style="padding: 8px 0; color: #0f172a;">${serviceName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #475569; font-weight: 600;">Estimated Arrival Time</td>
              <td style="padding: 8px 0; color: #0f172a;">${new Date(estimatedServeTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
            </tr>
          </table>

          <div style="text-align: center; padding-top: 24px; border-top: 1px solid #f1f5f9;">
            <p style="color: #64748b; font-size: 14px; margin-bottom: 16px;">Scan this QR code securely upon arrival</p>
            <img src="${qrCodeUrl}" alt="Secure Access QR Code" style="width: 200px; height: 200px; border-radius: 12px; border: 4px solid white; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);"/>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 24px; color: #94a3b8; font-size: 12px;">
          <p>© ${new Date().getFullYear()} IntelliQueue Inc. All rights reserved.</p>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: '"IntelliQueue Operations" <noreply@intelliqueue.com>',
      to: toEmail,
      subject: `Your Booking is Confirmed | Token ${tokenNumber}`,
      html: htmlContent,
    });

    if (!process.env.EMAIL_USER) {
      console.log("💌 MOCK EMAIL PREVIEW URL: %s", nodemailer.getTestMessageUrl(info));
    }

    return info;
  } catch (error) {
    console.error("Nodemailer routing exception:", error);
    throw error;
  }
}
