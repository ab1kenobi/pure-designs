import { Resend } from "resend";

type PieceRequestNotification = {
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  productName: string;
  productPrice: number;
};

export async function sendPieceRequestNotification(request: PieceRequestNotification) {
  const to = process.env.MOM_NOTIFICATION_EMAIL;
  if (!to || !process.env.RESEND_API_KEY) {
    console.warn("Skipping piece request notification email: RESEND_API_KEY or MOM_NOTIFICATION_EMAIL not set.");
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "Pure Designs by Batul <onboarding@resend.dev>",
    to,
    replyTo: request.email,
    subject: `New piece request — ${request.productName} ($${request.productPrice})`,
    text: [
      `${request.name} requested a piece from the shop.`,
      "",
      `Piece: ${request.productName} ($${request.productPrice})`,
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
  if (!to || !process.env.RESEND_API_KEY) {
    console.warn("Skipping bespoke notification email: RESEND_API_KEY or MOM_NOTIFICATION_EMAIL not set.");
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const typeLabel = BESPOKE_TYPE_LABELS[request.type] || request.type;

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "Pure Designs by Batul <onboarding@resend.dev>",
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
