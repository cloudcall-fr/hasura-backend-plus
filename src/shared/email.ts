import { APPLICATION } from '@shared/config'

import Email from 'email-templates'
import nodemailer from 'nodemailer'
import path from 'path'

import { dlString } from '@shared/queries'
import { request } from '@shared/request'

import httpContext from 'express-http-context'

/**
 * SMTP transport.
 */
const transport = nodemailer.createTransport({
  host: APPLICATION.SMTP_HOST,
  port: Number(APPLICATION.SMTP_PORT),
  secure: Boolean(APPLICATION.SMTP_SECURE),
  auth: {
    pass: APPLICATION.SMTP_PASS,
    user: APPLICATION.SMTP_USER
  },
  authMethod: APPLICATION.SMTP_AUTH_METHOD
})

interface HasuraData {
  string: [{ value: string }]
}

class DlEmail extends Email {

  public async send(options: any): Promise<any> {
    options.locals.async = true;
    options.locals.string = async (code: string, language: string | null) => {
      if (!language) {
        if (httpContext.get('language')) {
          language = httpContext.get('language');
        }
      }
      const hasura_data: HasuraData = await request(dlString, {
        code,
        ...language && { language }
      })
      if (hasura_data.string.length) {
        return hasura_data.string[0].value;
      }
      else {
        console.warn(`[WARN] localisation issue: ${language} - ${code}`);
        return code;
      }
    }
    return super.send(options);
  }
}

/**
 * Reusable email client.
 */
export const emailClient = new DlEmail({
  transport,
  message: { from: APPLICATION.SMTP_SENDER },
  send: APPLICATION.EMAILS_ENABLE,
  views: {
    root: path.resolve(process.env.PWD || '.', 'custom/emails'),
    options: {
      extension: 'ejs'
    }
  }
})
