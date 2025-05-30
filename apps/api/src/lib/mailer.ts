import * as aws from "@aws-sdk/client-ses";
import { createTransport } from "nodemailer";

import env from "./env";

// configuring AWS SDK
const ses = new aws.SES({
    apiVersion: "2010-12-01",
    region: env.AWS_REGION,
    credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
});

// create Nodemailer SES transporter
const transporter = createTransport({
    SES: { ses, aws },
    sendingRate: 1, // max 1 messages/second,
    maxConnections: 1,
});

/**
 * Sends an email using the configured email transporter
 * @param options - Object containing email options
 * @param options.toAddresses - Email address(es) of the recipient(s)
 * @param options.subject - Subject line of the email
 * @param options.emailBody - HTML content of the email body
 * @returns Promise that resolves to true when email is sent
 */
export function sendMail(options: {
    toAddresses: string;
    subject: string;
    emailBody: string;
}) {
    return new Promise((resolve, _reject) => {
        transporter.sendMail(
            {
                from: env.FROM_EMAIL_ADDR,
                to: options.toAddresses,
                subject: options.subject,
                html: options.emailBody,
            },
            (err, info) => {
                transporter.close();
                resolve(true);
                if (err) {
                    console.error(err);
                } else {
                    console.error(new Date().toLocaleString(), info.envelope);
                    console.error(info.messageId);
                }
            }
        );
        resolve(true);
    });
}
