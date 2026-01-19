"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// netlify/functions/contact.ts
var contact_exports = {};
__export(contact_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(contact_exports);

// netlify/functions/utils/ses.ts
var import_client_ses = require("@aws-sdk/client-ses");
var sesClient = new import_client_ses.SESClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});
function generateContactEmailHTML(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 20px; }
        .label { font-weight: bold; color: #667eea; margin-bottom: 5px; }
        .value { background: white; padding: 12px; border-radius: 4px; border-left: 3px solid #667eea; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>\u{1F4E7} New Contact Form Submission</h1>
          <p>Devnzo Support</p>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">\u{1F464} Name:</div>
            <div class="value">${data.name}</div>
          </div>
          <div class="field">
            <div class="label">\u{1F4E7} Email:</div>
            <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
          </div>
          ${data.phone ? `
          <div class="field">
            <div class="label">\u{1F4F1} Phone:</div>
            <div class="value">${data.phone}</div>
          </div>
          ` : ""}
          ${data.company ? `
          <div class="field">
            <div class="label">\u{1F3E2} Company:</div>
            <div class="value">${data.company}</div>
          </div>
          ` : ""}
          <div class="field">
            <div class="label">\u{1F4DD} Subject:</div>
            <div class="value">${data.subject}</div>
          </div>
          <div class="field">
            <div class="label">\u{1F4AC} Message:</div>
            <div class="value">${data.message.replace(/\n/g, "<br>")}</div>
          </div>
          <div class="footer">
            <p>Sent via Devnzo Contact Form \u2022 ${(/* @__PURE__ */ new Date()).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}
async function sendContactEmail(data) {
  try {
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_REGION) {
      throw new Error("AWS SES environment variables are required");
    }
    if (!process.env.SES_FROM_EMAIL) {
      throw new Error("SES_FROM_EMAIL environment variable is required");
    }
    const htmlContent = generateContactEmailHTML(data);
    console.log("\u{1F4E7} Preparing to send email...");
    console.log("From:", process.env.SES_FROM_EMAIL);
    console.log("To:", process.env.SES_FROM_EMAIL);
    console.log("Reply-To:", data.email);
    const params = {
      Destination: {
        ToAddresses: [process.env.SES_FROM_EMAIL]
        // Send to verified email
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: htmlContent
          }
        },
        Subject: {
          Charset: "UTF-8",
          Data: `New Contact: ${data.subject}`
        }
      },
      Source: process.env.SES_FROM_EMAIL,
      ReplyToAddresses: [data.email]
      // Allow direct reply to customer
    };
    console.log("\u{1F4E4} Sending email via AWS SES...");
    const command = new import_client_ses.SendEmailCommand(params);
    const response = await sesClient.send(command);
    console.log("\u{1F4EC} AWS SES Response received:", response);
    console.log("\u2705 Contact form email sent successfully");
    console.log("\u{1F4E7} From:", data.email);
    console.log("\u{1F4EC} Subject:", data.subject);
    console.log("\u{1F194} Message ID:", response.MessageId);
    return {
      success: true,
      messageId: response.MessageId
    };
  } catch (error) {
    console.error("\u274C AWS SES email sending failed:", error);
    console.error("Error type:", typeof error);
    console.error("Error name:", error instanceof Error ? error.name : "unknown");
    console.error("Error message:", error instanceof Error ? error.message : String(error));
    console.error("Full error object:", JSON.stringify(error, null, 2));
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

// netlify/functions/contact.ts
var handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json"
  };
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }
  try {
    console.log("\u{1F4E7} Contact form submission received");
    const data = JSON.parse(event.body || "{}");
    console.log("\u{1F4DD} Form data:", { name: data.name, email: data.email, subject: data.subject });
    const { name, email, subject, message } = data;
    if (!name || !email || !subject || !message) {
      console.log("\u274C Missing required fields");
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing required fields" })
      };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("\u274C Invalid email format");
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Invalid email address" })
      };
    }
    console.log("\u{1F4E4} Attempting to send email via AWS SES...");
    const result = await sendContactEmail(data);
    console.log("\u{1F4EC} SES result:", result);
    if (result.success) {
      console.log("\u2705 Email sent successfully!");
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: "Email sent successfully",
          messageId: result.messageId
        })
      };
    } else {
      console.log("\u274C Failed to send email:", result.error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: result.error || "Failed to send email"
        })
      };
    }
  } catch (error) {
    console.error("\u274C Contact form error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    console.error("Error details:", errorMessage);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Internal server error",
        details: errorMessage
      })
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=contact.js.map
