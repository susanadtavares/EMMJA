import 'dotenv/config';
import nodemailer from 'nodemailer';

/**
 * EmailService
 * 
 * Serviço para enviar emails
 * Suporta:
 * - Gmail SMTP
 * - SMTP customizado
 * - Mailtrap para testes
 */
class EmailService {
  constructor() {
    this.transporter = this.createTransporter();
  }

  /**
   * Cria transportador de email baseado em ENV
   * @returns {nodemailer.Transporter}
   */
  createTransporter() {
    // Se for development, usa Mailtrap ou console log
    if (process.env.NODE_ENV === 'development') {
      console.log(
        '📧 EmailService em modo desenvolvimento - emails não serão enviados'
      );

      // Retornar um transporter fake que apenas loga
      return {
        sendMail: async (mailOptions) => {
          console.log('\n----- EMAIL (DEV MODE) -----');
          console.log('To:', mailOptions.to);
          console.log('Subject:', mailOptions.subject);
          console.log('HTML:');
          console.log(mailOptions.html);
          console.log('---------------------------\n');
          return { messageId: 'dev-mode' };
        },
      };
    }

    // Produção: usar Gmail SMTP
    if (process.env.EMAIL_SERVICE === 'gmail') {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    }

    // Ou SMTP customizado
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === 'true', // true para 465, false para 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  /**
   * Envia email de boas-vindas com credenciais
   * @param {string} email - Email do utilizador
   * @param {string} fullName - Nome completo
   * @param {string} password - Password temporária
   * @returns {Promise<Object>} - { success, message, messageId }
   */
  async sendWelcomeEmail(email, fullName, password) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@escola-musica.pt',
        to: email,
        subject: 'Bem-vindo à Escola de Música - Credenciais de Acesso',
        html: this.getWelcomeEmailTemplate(fullName, email, password),
      };

      const result = await this.transporter.sendMail(mailOptions);

      return {
        success: true,
        message: 'Email enviado com sucesso!',
        messageId: result.messageId,
      };
    } catch (error) {
      console.error('Erro ao enviar email:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Template HTML para email de boas-vindas
   * @private
   */
  getWelcomeEmailTemplate(fullName, email, password) {
    return `
      <!DOCTYPE html>
      <html lang="pt-PT">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bem-vindo</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; border-radius: 8px; }
          .header { background-color: #2c3e50; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { padding: 20px; }
          .credentials { background-color: #ecf0f1; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .credentials p { margin: 10px 0; }
          .label { font-weight: bold; color: #2c3e50; }
          .value { font-family: monospace; background-color: #fff; padding: 5px 10px; border-radius: 3px; }
          .warning { background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107; }
          .footer { text-align: center; color: #7f8c8d; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ecf0f1; }
          .button { display: inline-block; background-color: #3498db; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎵 Bem-vindo à Escola de Música</h1>
          </div>
          
          <div class="content">
            <p>Olá <strong>${fullName}</strong>,</p>
            
            <p>A sua conta foi criada com sucesso! Aqui estão as suas credenciais de acesso:</p>
            
            <div class="credentials">
              <p><span class="label">Username (Email):</span><br>
              <span class="value">${email}</span></p>
              
              <p><span class="label">Password Temporária:</span><br>
              <span class="value">${password}</span></p>
            </div>
            
            <div class="warning">
              <strong>⚠️ Importante:</strong>
              <ul>
                <li><strong>Esta é uma password temporária.</strong> Deverá alterá-la no seu primeiro login.</li>
                <li>Guarde estas credenciais num local seguro.</li>
                <li>Não partilhe a sua password com ninguém.</li>
              </ul>
            </div>
            
            <p>Para aceder à plataforma, visite:</p>
            <center>
              <a href="${process.env.FRONTEND_URL}" class="button">Aceder à Plataforma</a>
            </center>
            
            <p>Se tiver dúvidas ou necessitar de support, contacte:</p>
            <p><strong>Email de Support:</strong> support@escola-musica.pt</p>
          </div>
          
          <div class="footer">
            <p>&copy; 2026 Escola de Música. Todos os direitos reservados.</p>
            <p>Este é um email automático, por favor não responda. Se não solicitou esta conta, ignore este email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Envia email de reset de password
   * @param {string} email - Email do utilizador
   * @param {string} fullName - Nome completo
   * @param {string} resetLink - Link para reset
   * @returns {Promise<Object>}
   */
  async sendPasswordResetEmail(email, fullName, resetLink) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@escola-musica.pt',
        to: email,
        subject: 'Reset de Password - Escola de Música',
        html: `
          <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
            <h2>Reset de Password</h2>
            <p>Olá ${fullName},</p>
            <p>Recebemos um pedido para resetar a sua password. Clique no link abaixo:</p>
            <p><a href="${resetLink}" style="background-color: #3498db; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Reset Password</a></p>
            <p>Se não pediu isto, ignore este email.</p>
            <p>Link expira em 1 hora.</p>
          </div>
        `,
      };

      const result = await this.transporter.sendMail(mailOptions);

      return {
        success: true,
        messageId: result.messageId,
      };
    } catch (error) {
      console.error('Erro ao enviar email reset:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Testa envio de email
   * @returns {Promise<Object>} - { success, message }
   */
  async testEmail() {
    try {
      const result = await this.transporter.verify();
      return {
        success: result,
        message: result ? 'Email service OK ✅' : 'Email service ERROR ❌',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

export default new EmailService();
