const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends an order confirmation email to the customer.
 */
async function sendOrderConfirmationEmail(toEmail, customerName, order) {
  const itemRows = (order.items || [])
    .map(
      (item) => `
        <tr>
          <td style="padding: 8px 12px; border-bottom: 1px solid #f0f0f0;">${item.name}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #f0f0f0; text-align:center;">${item.quantity}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #f0f0f0; text-align:right;">₹${item.price}</td>
        </tr>`
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Order Confirmation</title>
      </head>
      <body style="margin:0; padding:0; font-family: 'Segoe UI', Arial, sans-serif; background:#f9f9f9; color:#333;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">
                <tr>
                  <td style="background: linear-gradient(135deg, #2ecc71, #27ae60); padding: 32px 40px; text-align:center;">
                    <h1 style="margin:0; color:#fff; font-size:26px; letter-spacing:1px;">🛒 GoGrocers</h1>
                    <p style="margin:8px 0 0; color:rgba(255,255,255,0.85); font-size:14px;">Your order has been placed!</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 32px 40px;">
                    <p style="font-size:16px; margin-top:0;">Hi <strong>${customerName}</strong>,</p>
                    <p style="font-size:15px; color:#555;">
                      Thank you for your order! We've received it and are getting it ready for you. 🎉
                    </p>
                    <div style="background:#f4fbf6; border-left: 4px solid #2ecc71; padding: 12px 16px; border-radius:4px; margin: 20px 0;">
                      <strong>Order ID:</strong> <span style="color:#27ae60;">${order.id || "N/A"}</span>
                    </div>
                    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; margin-top:16px;">
                      <thead>
                        <tr style="background:#f4fbf6;">
                          <th style="padding: 10px 12px; text-align:left; font-size:13px; color:#888; font-weight:600; border-bottom: 2px solid #e8e8e8;">Item</th>
                          <th style="padding: 10px 12px; text-align:center; font-size:13px; color:#888; font-weight:600; border-bottom: 2px solid #e8e8e8;">Qty</th>
                          <th style="padding: 10px 12px; text-align:right; font-size:13px; color:#888; font-weight:600; border-bottom: 2px solid #e8e8e8;">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${itemRows}
                      </tbody>
                    </table>
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
                      <tr>
                        <td style="padding: 12px; text-align:right; font-size:16px;">
                          <strong>Total: ₹${order.total || "0"}</strong>
                        </td>
                      </tr>
                    </table>
                    ${
                      order.address
                        ? `<div style="margin-top:20px; padding: 12px 16px; background:#fafafa; border-radius:8px; font-size:14px; color:#555;">
                        <strong>📍 Delivery Address:</strong><br/>${order.address}
                       </div>`
                        : ""
                    }
                    <p style="font-size:14px; color:#888; margin-top:28px;">
                      We'll notify you once your order is out for delivery.<br/>
                      For any queries, reply to this email or contact our support.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background:#f4f4f4; padding: 20px 40px; text-align:center; font-size:12px; color:#aaa;">
                    © ${new Date().getFullYear()} GoGrocers. All rights reserved.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "GoGrocers <orders@yourdomain.com>",
    to: [toEmail],
    subject: `✅ Order Confirmed – GoGrocers (#${order.id || "N/A"})`,
    html,
  });

  if (error) {
    console.error("[emailService] Failed to send order confirmation:", error);
    throw error;
  }

  console.log(`[emailService] Order confirmation sent to ${toEmail}`, data);
  return data;
}

module.exports = { sendOrderConfirmationEmail };
