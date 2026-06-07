const { Resend } = require('resend');

class EmailService {
  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) this.resend = new Resend(apiKey);
  }

  async sendWelcomeEmail({ lead, campaign, owner, landingPage, baseUrl }) {
    if (!this.resend) return;
    const panelLink = `${baseUrl}/referral/${lead.uuid}`;
    const referralLink = `${baseUrl}/c/${campaign.slug}?ref=${lead.referralCode}`;
    const creatorName = owner.company || owner.fullName || 'SG Referidos';

    let subject = landingPage.emailSubject || '🎁 ¡{NOMBRE} ya puedes descargar tu PDF!';
    let body = landingPage.emailBody || this._defaultBody();

    const replacements = {
      '{NOMBRE}': lead.fullName,
      '{ENLACE_REFERIDO}': referralLink,
      '{ENLACE_PANEL}': panelLink,
      '{CREADOR}': creatorName,
    };

    for (const [key, val] of Object.entries(replacements)) {
      subject = subject.split(key).join(val);
      body = body.split(key).join(val);
    }

    const htmlBody = this._toHtml(body);

    try {
      const { error } = await this.resend.emails.send({
        from: 'SG Referidos <onboarding@sgreferidos.com>',
        to: lead.email,
        subject,
        html: htmlBody,
      });
      if (error) console.error('Resend error:', error);
    } catch (e) {
      console.error('Failed to send welcome email:', e.message);
    }
  }

  _toHtml(text) {
    const lines = text.split('\n').filter(Boolean);
    const paragraphs = lines.map((l) => {
      let line = l.trim();
      line = line.replace(/https?:\/\/[^\s<]+/g, (url) => `<a href="${url}" target="_blank" style="color:#0d6efd;text-decoration:underline">${url}</a>`);
      if (!line) return '';
      return `<p style="margin:0 0 12px 0;font-size:15px;line-height:1.6;color:#333">${line}</p>`;
    }).join('');
    return `<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;padding:30px 20px;background:#fff">
      <div style="text-align:center;margin-bottom:24px">
        <img src="https://sgreferidos.com/logo.png" alt="SG Referidos" style="max-height:48px" />
      </div>
      ${paragraphs}
      <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0" />
      <p style="font-size:12px;color:#999;text-align:center">SG Referidos — Programa de referidos</p>
    </div>`;
  }

  _defaultBody() {
    return `Hola, {NOMBRE}:

¡Qué gran alegría tenerte con nosotros!
Tu cuenta ya está completamente activa.

Copia tu enlace único: {ENLACE_REFERIDO}
Compártelo con tus amigos y empieza a sumar recompensas.

Un fuerte abrazo,
El equipo de {CREADOR}`;
  }
}

module.exports = new EmailService();
