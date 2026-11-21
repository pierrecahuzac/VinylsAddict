import { createHash, randomBytes } from "node:crypto";
import bcryptjs from "bcryptjs";
import prisma from "../database/prismaClient.js";
import { sendPasswordResetEmail } from "../services/mailer.service.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 heure

const hashToken = (token) => createHash("sha256").update(token).digest("hex");

const PasswordResetController = {
  forgotPassword: async (req, res) => {
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: "Adresse email invalide." });
    }

    try {
      const user = await prisma.user.findUnique({ where: { email } });
      // Réponse identique dans tous les cas : on ne révèle pas si le compte existe.
      const genericMessage = "Si un compte existe avec cette adresse, un lien de réinitialisation a été envoyé.";

      if (user) {
        const token = randomBytes(32).toString("hex");
        await prisma.passwordResetToken.create({
          data: {
            tokenHash: hashToken(token),
            userId: user.id,
            expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
          },
        });
        try {
          await sendPasswordResetEmail(user.email, token);
        } catch (emailError) {
          // L'email peut échouer (SMTP indisponible) : on garde la réponse générique.
          console.error("[password-reset] envoi impossible:", emailError.message);
        }
      }

      return res.status(200).json({ message: genericMessage });
    } catch (error) {
      console.error("forgotPassword error:", error);
      return res.status(500).json({ error: "Erreur lors de la demande de réinitialisation." });
    }
  },

  resetPassword: async (req, res) => {
    const { token, password, passwordConfirmation } = req.body || {};

    if (typeof token !== "string" || !token) {
      return res.status(400).json({ message: "Lien de réinitialisation invalide." });
    }
    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({ message: "Le mot de passe doit faire au moins 8 caractères." });
    }
    if (password !== passwordConfirmation) {
      return res.status(400).json({ message: "Les mots de passe ne correspondent pas." });
    }

    try {
      const resetToken = await prisma.passwordResetToken.findUnique({
        where: { tokenHash: hashToken(token) },
      });

      if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
        return res.status(400).json({ message: "Ce lien de réinitialisation est invalide ou expiré." });
      }

      const hashedPassword = await bcryptjs.hash(password, 10);

      await prisma.$transaction([
        prisma.user.update({ where: { id: resetToken.userId }, data: { password: hashedPassword } }),
        prisma.passwordResetToken.update({ where: { id: resetToken.id }, data: { usedAt: new Date() } }),
        prisma.passwordResetToken.updateMany({
          where: { userId: resetToken.userId, usedAt: null },
          data: { usedAt: new Date() },
        }),
      ]);

      return res.status(200).json({ message: "Mot de passe mis à jour. Vous pouvez vous connecter." });
    } catch (error) {
      console.error("resetPassword error:", error);
      return res.status(500).json({ error: "Erreur lors de la réinitialisation." });
    }
  },
};

export default PasswordResetController;
