import nodemailer, { Transporter } from 'nodemailer';

export type ComplaintDetails = {
  userName: string;
  userEmail: string;
  orderId?: string;
  problemDescription: string;
  originalUserMessage: string;
  category: string;
  contact: { name: string; email: string };
};

export class MailService {
  private transporter!: Transporter;
  private testAccount: { user: string; pass: string } | null = null;

  private async createTestAccount() {
    if (!this.testAccount) {
      this.testAccount = await nodemailer.createTestAccount();
      console.log('Ethereal test account created:', this.testAccount);

      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: this.testAccount.user,
          pass: this.testAccount.pass,
        },
      });
    }
  }

  public async sendVerificationEmail(toEmail: string, name: string, token: string): Promise<void> {
    await this.createTestAccount();

    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

    const mailOptions = {
      from: `"Tastely" <${this.testAccount!.user}>`,
      to: toEmail,
      subject: 'Please Verify Your Email Address for Tastely',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; text-align: center; padding: 20px;">
          <h2>Hi ${name},</h2>
          <p>Thanks for registering with Tastely! To complete your registration, please verify your email address by clicking the button below.</p>
          <a href="${verificationUrl}" style="background-color: #EB5E28; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px;">
            Verify My Email
          </a>
          <p style="margin-top: 20px;">This link will expire in 1 hour.</p>
          <p>If you did not create this account, you can safely ignore this email.</p>
        </div>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`[MailService] Verification email sent: ${info.messageId}`);
      console.log(`[MailService] Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    } catch (error) {
      console.error(`[MailService] Error sending verification email:`, error);
    }
  }

  public async sendComplaintNotification(details: ComplaintDetails): Promise<void> {
    await this.createTestAccount();

    const { userName, userEmail, orderId, problemDescription, category, contact } = details;

    const subject = `[New Complaint] Category: ${category} | Order: ${orderId || 'N/A'}`;
    const mailOptions = {
      from: `"Tastely Support" <${this.testAccount!.user}>`,
      to: contact.email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; border: 1px solid #ddd;">
          <h2>Hello ${contact.name},</h2>
          <p>A new user complaint has been received and requires your attention:</p>
          <hr>
          <ul style="list-style-type: none; padding: 0;">
            <li><strong>User:</strong> ${userName} (${userEmail})</li>
            <li><strong>Order ID:</strong> ${orderId || 'Not provided'}</li>
            <li><strong>Complaint Category:</strong> ${category}</li>
          </ul>
          <h3>Problem Description:</h3>
          <p style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
            <em>${problemDescription}</em>
          </p>
          <hr>
          <p>Please follow up with the user as soon as possible to resolve this issue.</p>
        </div>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`[MailService] Complaint notification sent: ${info.messageId}`);
      console.log(`[MailService] Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    } catch (error) {
      console.error(`[MailService] Error sending complaint notification:`, error);
    }
  }
}
