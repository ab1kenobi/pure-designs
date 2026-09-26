import nodemailer from "nodemailer";

let transport: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransport() {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return null;
  if (!transport) {
    transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });
  }
  return transport;
}

type PieceRequestNotification = {
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  productName: string;
  productPrice: number | null;
};

export async function sendPieceRequestNotification(request: PieceRequestNotification) {
  const to = process.env.MOM_NOTIFICATION_EMAIL;
  const mailer = getTransport();
  if (!to || !mailer) {
    console.warn("Skipping piece request notification email: GMAIL_USER/GMAIL_APP_PASSWORD or MOM_NOTIFICATION_EMAIL not set.");
    return;
  }

  const priceLabel = request.productPrice !== null ? `$${request.productPrice}` : "price not yet set";

  await mailer.sendMail({
    from: `Pure Designs by Batul <${process.env.GMAIL_USER}>`,
    to,
    replyTo: request.email,
    subject: `New piece request — ${request.productName} (${priceLabel})`,
    text: [
      `${request.name} requested a piece from the shop.`,
      "",
      `Piece: ${request.productName} (${priceLabel})`,
      `Email: ${request.email}`,
      `Phone: ${request.phone || "Not provided"}`,
      "",
      "Message:",
      request.message || "None"
    ].join("\n")
  });
}

export const BESPOKE_TYPE_LABELS: Record<string, string> = {
  scarf: "Bespoke scarf",
  purse: "Bespoke purse",
  set: "Bespoke scarf + purse set"
};

type BespokeNotification = {
  name: string;
  email: string;
  phone: string | null;
  type: string;
  price: number;
  colors: string | null;
  occasion: string | null;
  description: string;
  inspiration_url: string | null;
};

export async function sendBespokeNotification(request: BespokeNotification) {
  const to = process.env.MOM_NOTIFICATION_EMAIL;
  const mailer = getTransport();
  if (!to || !mailer) {
    console.warn("Skipping bespoke notification email: GMAIL_USER/GMAIL_APP_PASSWORD or MOM_NOTIFICATION_EMAIL not set.");
    return;
  }

  const typeLabel = BESPOKE_TYPE_LABELS[request.type] || request.type;

  await mailer.sendMail({
    from: `Pure Designs by Batul <${process.env.GMAIL_USER}>`,
    to,
    replyTo: request.email,
    subject: `New paid bespoke order — ${typeLabel} ($${request.price})`,
    text: [
      `${request.name} just paid for a bespoke order.`,
      "",
      `Type: ${typeLabel} ($${request.price})`,
      `Email: ${request.email}`,
      `Phone: ${request.phone || "Not provided"}`,
      `Colors: ${request.colors || "Not specified"}`,
      `Occasion: ${request.occasion || "Not specified"}`,
      request.inspiration_url ? `Inspiration: ${request.inspiration_url}` : "",
      "",
      "Description:",
      request.description
    ].filter(Boolean).join("\n")
  });
}
