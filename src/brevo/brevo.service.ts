import { Injectable } from '@nestjs/common';
import * as SibApiV3Sdk from '@sendinblue/client';
import { ConfigService } from '@nestjs/config';
require('dotenv').config();

@Injectable()
export class BrevoService {
  private sendinBlueClient: SibApiV3Sdk.TransactionalEmailsApi;

  constructor(private configService: ConfigService) {
    this.sendinBlueClient = new SibApiV3Sdk.TransactionalEmailsApi();
    this.sendinBlueClient.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_KEY);
  }

  async sendEmail(to: string, subject: string, textContent: string) {
    const emailData: SibApiV3Sdk.SendSmtpEmail = {
      to: [{ email: to }],
      subject,
      textContent,
      sender: { email: 'rajeshdwivedi9830@gmail.com', name: 'Rentify' },
    };

    try {
      const response = await this.sendinBlueClient.sendTransacEmail(emailData);
      console.log('Email sent successfully:');
      return response;
    } catch (error) {
      console.error('Error sending email:');
      throw new Error('Failed to send email');
    }
  }
}