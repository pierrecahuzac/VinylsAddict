import nodemailer from "nodemailer";

let transporter = null;

const getTransporter = () => {
  if (!process.env.SMTP_HOST) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_PORT === "465",
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    });
  }
  return transporter;
};

export const sendPasswordResetEmail = async (to, token) => {
  const frontendUrl = process.env.FRONTEND_URL || "https://app.partagetacollection.eu";
  const link = `${frontendUrl.replace(/\/$/, "")}/reset-password?token=${encodeURIComponent(token)}`;

  const mailer = getTransporter();
  if (!mailer) {
    // Pas de SMTP configuré : on log le lien (pratique en développement).
    console.warn("[password-reset] SMTP non configuré, lien de réinitialisation :", link);
    return false;
  }

  await mailer.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@partagetacollection.eu",
    to,
    subject: "Réinitialisez votre mot de passe Vinyls Addict",
    text: `Bonjour,\n\nUtilisez ce lien pour choisir un nouveau mot de passe (valable 1 heure) :\n${link}\n\nSi vous n'êtes pas à l'origine de cette demande, ignorez cet email.\n`,
    html: `<p>Bonjour,</p><p>Utilisez ce lien pour choisir un nouveau mot de passe (valable 1 heure) :</p><p><a href="${link}">Réinitialiser mon mot de passe</a></p><p>Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>`,
  });
  return true;
};
