const { Resend } = require('resend');

class EmailService {
  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) this.resend = new Resend(apiKey);
  }

  async sendWelcomeEmail({ lead, campaign, owner, landingPage, baseUrl }) {
    if (!this.resend) {
      console.warn('Resend not configured — skipping welcome email');
      return;
    }
    const panelLink = `${baseUrl}/referral/${lead.uuid}`;
    const referralLink = `${baseUrl}/c/${campaign.slug}?ref=${lead.referralCode}`;
    const creatorName = owner?.company || owner?.fullName || 'SG Referidos';
    const from = process.env.RESEND_FROM || 'SG Referidos <onboarding@sgreferidos.com>';

    const lp = landingPage || {};
    let subject = lp.emailSubject || '🎁 ¡{NOMBRE} ya puedes descargar tu PDF!';
    let bodyHtml = lp.emailBody || '';

    const replacements = {
      '{NOMBRE}': lead.fullName,
      '{ENLACE_REFERIDO}': referralLink,
      '{ENLACE_PANEL}': panelLink,
      '{CREADOR}': creatorName,
    };

    for (const [key, val] of Object.entries(replacements)) {
      subject = subject.split(key).join(val);
      bodyHtml = bodyHtml.split(key).join(val);
    }

    // If no custom template, use default plain-text fallback
    if (!lp.emailBody) {
      bodyHtml = this._defaultHtml(referralLink, panelLink, lead.fullName, creatorName);
    }

    const htmlBody = this._wrapHtml(bodyHtml);

    try {
      const { error } = await this.resend.emails.send({
        from,
        to: lead.email,
        subject,
        html: htmlBody,
      });
      if (error) console.error('Resend send error:', error);
    } catch (e) {
      console.error('Failed to send welcome email:', e.message);
    }
  }

  _wrapHtml(bodyContent) {
    return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="font-family:'Segoe UI',Arial,sans-serif;margin:0;padding:0;background:#f4f4f4">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="max-width:600px;width:100%;margin:24px auto;background:#ffffff;border-radius:8px">
    <tr><td style="padding:30px 20px 10px;text-align:center">
      <img src="https://sgreferidos.com/logo.png" alt="SG Referidos" style="max-height:48px" />
    </td></tr>
    <tr><td style="padding:10px 30px 30px">
      ${bodyContent}
    </td></tr>
    <tr><td style="padding:20px 30px;text-align:center;border-top:1px solid #eee">
      <p style="font-size:12px;color:#999;margin:0">SG Referidos — Programa de referidos</p>
    </td></tr>
  </table>
</body></html>`;
  }

  _defaultHtml(refLink, panelLink, name, creator) {
    return `<p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#333">Hola, <strong>${name}</strong>:</p>
<p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#333">¡Qué gran alegría tenerte con nosotros! Tu cuenta ya está completamente activa.</p>
<p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#333">Copia tu enlace único y compártelo con tus amigos para empezar a sumar recompensas:</p>
<table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:24px auto">
  <tr><td style="border-radius:6px;background:#0d6efd;padding:12px 28px;text-align:center">
    <a href="${refLink}" target="_blank" style="color:#ffffff;text-decoration:none;font-size:16px;font-weight:600;display:inline-block">🔗 COMPARTIR MI ENLACE Y VER PREMIOS</a>
  </td></tr>
</table>
<p style="margin:24px 0 0 0;font-size:15px;line-height:1.6;color:#333">Un fuerte abrazo,<br />El equipo de <strong>${creator}</strong></p>`;
  }
}

module.exports = new EmailService();
