import { Injectable, Logger } from '@nestjs/common';
import Mail from 'nodemailer/lib/mailer';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs-extra';
import * as nodemailer from 'nodemailer';
import * as mustache from 'mustache';
import * as showdown from 'showdown';
import { UserDocument } from '../users/models/users.model';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transport: Mail;

  constructor(private configService: ConfigService) {
    this.transport = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      customAuth: {},
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false,
      },
    });
  }

  async send(
    mailOptions: Omit<Mail.Options, 'from'> & {
      template: string;
      user: UserDocument;
      data: { [key: string]: any };
    },
  ) {
    const { data, template, user, ...options } = mailOptions;
    const converter = new showdown.Converter();
    const plain = await this.readTemplate(template);
    const markdown = mustache.render(plain, data);
    const html = converter.makeHtml(markdown);

    await this.transport.sendMail({
      ...options,
      from: `Ora <${this.configService.get<string>('SMTP_USER')}>`,
      to: `${user.firstName} ${user.lastName} <${user.email}>`,
      html,
      text: markdown,
      alternatives: [
        {
          contentType: 'text/x-web-markdown',
          content: markdown,
        },
      ],
    });
  }

  async readTemplate(name: string) {
    if (!name.endsWith('.html')) name = `${name}.md`;
    const template = await fs.readFile(`./src/templates/${name}`);
    return template.toString();
  }
}
