import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

export const sendOrderEmail = async (order, items, status) => {
  const isApproved = status === 'approved';

  const subject = isApproved
    ? `Your Order ${order.order_number} is Confirmed`
    : `Your Order ${order.order_number} ${status === 'declined' ? 'Declined' : 'Failed'}`;

  const itemListHTML = items.map(item => {
    // Convert price to a number (float)
    const price = parseFloat(item.price) || 0;
    const quantity = item.quantity || 0;
    return `
        <li>
        ${item.title} - Variant: ${JSON.stringify(item.variant)} × ${quantity}<br/>
        Price: $${price.toFixed(2)} | Total: $${(price * quantity).toFixed(2)}
        </li>
        `;
    }).join('');

    const totalAmount = items.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * (item.quantity || 0), 0);


  const template = isApproved
    ? `
      <h1>Thank you for your purchase!</h1>
      <p>Order Number: ${order.order_number}</p>
      <ul>${itemListHTML}</ul>
      <p><strong>Total: $${totalAmount.toFixed(2)}</strong></p>
    `
    : `
      <h1>Oops! Your transaction ${status}</h1>
      <p>Order Number: ${order.order_number}</p>
      <p>Please retry or contact support.</p>
    `;

  await transporter.sendMail({
    from: `"Mini Shop" <no-reply@minishop.local>`,
    to: order.email,
    subject,
    html: template
  });
};
