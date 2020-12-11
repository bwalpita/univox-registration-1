'use strict';

const nodemailer = require("nodemailer");

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
  async update(params, data, { files } = {}) {
    const entry = await strapi.query('students').update(params, data);

    if (files) {
      await strapi.entityService.uploadFiles(entry, files, {
        model: 'students',
      });
      this.sendEmail(entry);
      return this.findOne({ id: entry.id });
    }

    try {
      this.sendEmail(entry);
    } catch (e) {
      console.log(`Email sender faild! ` + e);
    }

    return entry;
  },

  async sendEmail(entry) {
    console.log('Start send an email!');

    // get emails
    const emails = await strapi.query('emails').findOne();

    // email transpoter
    let transporter = nodemailer.createTransport({
      host: "mail.privateemail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: 'no-reply@univox.site',
        pass: 'Fr8yc9R96DujeYw',
      }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: 'no-reply@univox.site',
      to: emails.values,
      subject: `New Student Registration - ${entry.nic_no}`,
      text: `Hi Admin, \n\n ${entry.full_name} with NIC No: ${entry.nic_no} has successfully registered in the system ${entry.update_at}. Please send an E-mail to ${entry.email} or call him/her on ${entry.mobile_contact} / ${entry.residence_contact} for confirmation.`,
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml" lang="en-GB">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Student Registration</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <style type="text/css">
          a[x-apple-data-detectors] {color: inherit !important;}
        </style>
      </head>
      <body style="margin: 0; padding: 0; background: #fbfbfb">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td style="padding: 20px 0 30px 0;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; border: 1px solid #CCCCCC;">
        <tr>
          <td bgcolor="#FFFFFF" style="padding: 40px 30px 40px 30px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
              <tr>
                <td width="260" style="color: #153643; font-family: Arial, sans-serif;">
                  <h1 style="font-size: 24px; margin: 0;">New Student Been Registered</h1>
                </td>
              </tr>
              <tr>
                <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; padding: 20px 0 30px 0;">
                  <p style="margin: 0;">Hi Admin,</p>
                  <p style="margin: 0;"><br>
                  ${entry.full_name} with NIC No: ${entry.nic_no} has successfully registered in the system ${entry.updated_at}.
                    Please send an E-mail to ${entry.email} Email or call him/her on ${this.getContacts(entry.mobile_contact, entry.residence_contact)} for confirmation.</p>
                  <p style="margin: 0;">&nbsp;</p>
                  <p style="margin: 0;">System Generated Message.</p></td>
              </tr>
              <tr>
                <td>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td bgcolor="#003B8A" style="padding: 30px 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
              <tr>
                <td width="77%" style="color: #FFFFFF; font-family: Arial, sans-serif; font-size: 14px;">
                  <p style="margin: 0;">© 2020-2021 University of Vocational Technology | Registration System, All rights reserved.</p>
                </td>
                <td width="23%" align="right" style="color: #FFFFFF; font-family: Arial, sans-serif; font-size: 14px;">
                  <p>UnivoX Registration V1.0.7</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
            </td>
          </tr>
        </table>
      </body>
      </html>`
    });

    // message sent
    console.log("Message sent: %s", info.messageId);
  },

  getContacts(no1, no2) {
    if (no1 != null && no2 != null) {
      return `${no1} / ${no2}`;
    } else if (no1 != null) {
      return no1;
    } else if (no2 != null) {
      return no2;
    } else {
      return "";
    }
  }
};
