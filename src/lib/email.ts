import { Resend } from 'resend';

const resendApiKey = process.env.EMAIL_PROVIDER_API_KEY;
const adminEmailAddress = process.env.ADMIN_NOTIFICATION_EMAIL || 'sarvamanghalarakshai@gmail.com';

const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Helper to check configuration
export const isEmailConfigured = () => {
  return !!resend;
};

// Generic sender wrapper that handles fallback console logging
async function sendMail({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (resend) {
    try {
      const response = await resend.emails.send({
        from: 'Sarvamanghala Rakshai <orders@sarvamanghalarakshai.com>',
        to,
        subject,
        html,
      });
      console.log(`Email successfully sent via Resend. ID: ${response.data?.id}`);
      return response;
    } catch (err) {
      console.error('Failed to send email via Resend SDK:', err);
      throw err;
    }
  } else {
    console.warn(`
====== MOCK EMAIL DISPATCH LOG ======
To:      ${to}
Subject: ${subject}
Content:
${html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').substring(0, 500)}...
====================================
    `);
    return { data: { id: 'mock_email_id' } };
  }
}

// 1. Send Order Confirmation to Customer
export async function sendNewOrderEmail(order: any, customer: any) {
  const subject = `Order Confirmed: ${order.order_number} - Sarvamanghala Rakshai`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1A1A1A; border: 1px solid #D4AF37; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #800020; color: #FFFFFF; padding: 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; font-family: Georgia, serif;">Om Namah Shivaya</h1>
        <p style="margin: 8px 0 0 0; font-size: 14px; color: #D4AF37; tracking: 1px;">Sarvamanghala Rakshai Consecrated Protection</p>
      </div>
      <div style="padding: 24px; background-color: #FAF6EE;">
        <p>Dear <strong>${customer.full_name}</strong>,</p>
        <p>Your purchase of the blessed <strong>Sarvamanghala Rakshai</strong> is confirmed. Below are your transaction details:</p>
        
        <div style="background-color: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 6px; padding: 16px; margin: 20px 0;">
          <p style="margin: 0 0 8px 0;"><strong>Order Number:</strong> <span style="color: #800020;">${order.order_number}</span></p>
          <p style="margin: 0 0 8px 0;"><strong>Quantity:</strong> ${order.quantity}</p>
          <p style="margin: 0 0 8px 0;"><strong>Astro Cards:</strong> ${order.additional_astro_cards + 1} total (1 included free + ${order.additional_astro_cards} family additions)</p>
          <p style="margin: 0 0 8px 0;"><strong>Shipping:</strong> FREE (India)</p>
          <p style="margin: 0; font-size: 16px; font-weight: bold; border-top: 1px solid #F3F4F6; padding-top: 8px;">Total Paid: ₹${order.total_amount}</p>
        </div>

        <h3 style="color: #800020; border-bottom: 1px solid #D4AF37; padding-bottom: 4px;">Primary Astro Details</h3>
        <p style="margin: 4px 0;"><strong>Birth Star:</strong> ${customer.birth_star}</p>
        <p style="margin: 4px 0;"><strong>Zodiac Sign:</strong> ${customer.zodiac_sign}</p>
        <p style="margin: 4px 0;"><strong>Birth Coordinate:</strong> ${customer.dob} at ${customer.birth_time} in ${customer.birth_place}</p>

        <h3 style="color: #800020; border-bottom: 1px solid #D4AF37; padding-bottom: 4px; margin-top: 24px;">Next Consecration Steps</h3>
        <ul style="padding-left: 20px;">
          <li>Your sacred herbal paste is being prepared and will be energized in an upcoming Lord Murugan prayer cycle.</li>
          <li>Our Vedic scholars are calculating the precise Nakshatra analysis for all cards.</li>
          <li>Your package will be dispatched with free express delivery in 5-8 business days.</li>
        </ul>

        <p style="margin-top: 24px;">If you have any questions or corrections for your birth details, please email us directly at <a href="mailto:sarvamanghalarakshai@gmail.com" style="color: #800020; font-weight: bold;">sarvamanghalarakshai@gmail.com</a>.</p>
        <p>May Lord Murugan shower you and your family with divine guidance and blessings.</p>
        <br/>
        <p style="font-size: 12px; color: #9CA3AF;">Sarvamanghala Rakshai, Consecrated in Tamil Nadu, India.</p>
      </div>
    </div>
  `;

  return sendMail({ to: customer.email, subject, html });
}

// 2. Send Status Change Update to Customer
export async function sendOrderStatusUpdateEmail(order: any, customer: any, newStatus: string) {
  const subject = `Order Update: ${order.order_number} is now ${newStatus.toUpperCase()}`;
  
  const statusDescriptions: Record<string, string> = {
    processing: "Our priests have successfully completed the energization prayers and Pujas for your Rakshai sacred paste, and our Vedic experts have compiled your Astro Cards. Your order has entered the packaging phase.",
    shipped: "Your blessed Sarvamanghala Rakshai package has been dispatched from our sanctum. You will receive a separate tracking notification shortly.",
    delivered: "Your package has been marked as delivered by our shipping courier. We hope the Rakshai sacred herbal paste and personalized Astro Cards bring you positive energies and blessings.",
    cancelled: "Your order has been marked as cancelled. If a refund is applicable, it will be processed back via your original Razorpay payment method within 5-7 business days."
  };

  const currentDesc = statusDescriptions[newStatus] || `Your order status has changed to: ${newStatus}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1A1A1A; border: 1px solid #D4AF37; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #800020; color: #FFFFFF; padding: 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; font-family: Georgia, serif;">Order Update</h1>
        <p style="margin: 8px 0 0 0; font-size: 14px; color: #D4AF37; tracking: 1px;">Sarvamanghala Rakshai Notification</p>
      </div>
      <div style="padding: 24px; background-color: #FAF6EE;">
        <p>Dear <strong>${customer.full_name}</strong>,</p>
        <p>Your order <strong style="color: #800020;">${order.order_number}</strong> status has been updated to: <strong style="text-transform: uppercase; color: #800020;">${newStatus}</strong>.</p>
        
        <div style="background-color: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 6px; padding: 16px; margin: 20px 0; line-height: 1.6;">
          ${currentDesc}
        </div>

        <p>Order Summary:</p>
        <ul>
          <li>Product: 1x Consecrated Sarvamanghala Rakshai package</li>
          <li>Quantity: ${order.quantity}</li>
          <li>Total Cards: ${order.additional_astro_cards + 1}</li>
        </ul>

        <p style="margin-top: 24px;">For support or shipping queries, contact us at <a href="mailto:sarvamanghalarakshai@gmail.com" style="color: #800020; font-weight: bold;">sarvamanghalarakshai@gmail.com</a>.</p>
        <p>Sincerely,<br/>Sarvamanghala Rakshai Admin Team</p>
      </div>
    </div>
  `;

  return sendMail({ to: customer.email, subject, html });
}

// 3. Send New Order Alert to Admin
export async function sendAdminNewOrderAlert(order: any, customer: any) {
  const subject = `[New Order Alert] ${order.order_number} - ₹${order.total_amount}`;
  const html = `
    <div style="font-family: Arial, sans-serif; color: #1A1A1A; padding: 20px; border: 2px solid #800020; max-width: 600px;">
      <h2 style="color: #800020; margin-top: 0; font-family: Georgia, serif;">New Customer Purchase Consecrated</h2>
      <p>A new order has been paid and captured via Razorpay:</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr style="border-bottom: 1px solid #EEE;"><td style="padding: 8px 0; font-weight: bold;">Order Number:</td><td>${order.order_number}</td></tr>
        <tr style="border-bottom: 1px solid #EEE;"><td style="padding: 8px 0; font-weight: bold;">Customer Name:</td><td>${customer.full_name}</td></tr>
        <tr style="border-bottom: 1px solid #EEE;"><td style="padding: 8px 0; font-weight: bold;">Customer Email:</td><td>${customer.email}</td></tr>
        <tr style="border-bottom: 1px solid #EEE;"><td style="padding: 8px 0; font-weight: bold;">Customer Phone:</td><td>${customer.phone}</td></tr>
        <tr style="border-bottom: 1px solid #EEE;"><td style="padding: 8px 0; font-weight: bold;">Total Amount:</td><td>₹${order.total_amount}</td></tr>
        <tr style="border-bottom: 1px solid #EEE;"><td style="padding: 8px 0; font-weight: bold;">Rakshai Qty:</td><td>${order.quantity}</td></tr>
        <tr style="border-bottom: 1px solid #EEE;"><td style="padding: 8px 0; font-weight: bold;">Add-on Cards:</td><td>${order.additional_astro_cards}</td></tr>
      </table>

      <h3 style="color: #800020; margin-bottom: 8px;">Customer Birth Info (For Primary Astro Card)</h3>
      <p style="margin: 4px 0;"><strong>DOB:</strong> ${customer.dob}</p>
      <p style="margin: 4px 0;"><strong>Time:</strong> ${customer.birth_time}</p>
      <p style="margin: 4px 0;"><strong>Place:</strong> ${customer.birth_place}</p>
      <p style="margin: 4px 0;"><strong>Zodiac:</strong> ${customer.zodiac_sign}</p>
      <p style="margin: 4px 0;"><strong>Nakshatra:</strong> ${customer.birth_star}</p>
      
      <h3 style="color: #800020; margin-bottom: 8px; margin-top: 20px;">Shipping Details</h3>
      <p style="margin: 4px 0;"><strong>Address:</strong> ${customer.address}</p>
      <p style="margin: 4px 0;"><strong>City / State / Pin:</strong> ${customer.city}, ${customer.state} - ${customer.pincode}</p>

      <p style="margin-top: 20px; font-size: 12px; color: #888;">Manage this order at the admin dashboard panel: /admin/orders</p>
    </div>
  `;

  return sendMail({ to: adminEmailAddress, subject, html });
}

// 4. Send Cancellation Alert to Admin
export async function sendAdminOrderCancelledAlert(order: any, customer: any, refundStatus: string) {
  const subject = `[Order Cancelled Alert] ${order.order_number} - ₹${order.total_amount}`;
  const html = `
    <div style="font-family: Arial, sans-serif; color: #1A1A1A; padding: 20px; border: 2px solid #800020; max-width: 600px;">
      <h2 style="color: #AA0000; margin-top: 0; font-family: Georgia, serif;">Order Cancelled Notification</h2>
      <p>The following order has been marked as cancelled in the dashboard:</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr style="border-bottom: 1px solid #EEE;"><td style="padding: 8px 0; font-weight: bold;">Order Number:</td><td>${order.order_number}</td></tr>
        <tr style="border-bottom: 1px solid #EEE;"><td style="padding: 8px 0; font-weight: bold;">Customer Name:</td><td>${customer.full_name}</td></tr>
        <tr style="border-bottom: 1px solid #EEE;"><td style="padding: 8px 0; font-weight: bold;">Total Amount:</td><td>₹${order.total_amount}</td></tr>
        <tr style="border-bottom: 1px solid #EEE;"><td style="padding: 8px 0; font-weight: bold;">Cancellation Date:</td><td>${new Date().toLocaleDateString('en-IN')}</td></tr>
        <tr style="border-bottom: 1px solid #EEE;"><td style="padding: 8px 0; font-weight: bold;">Refund Status:</td><td>${refundStatus}</td></tr>
      </table>

      <p style="margin-top: 20px; font-size: 12px; color: #888;">Order cancel processed successfully.</p>
    </div>
  `;

  return sendMail({ to: adminEmailAddress, subject, html });
}
