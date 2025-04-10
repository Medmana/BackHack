// utils/notificationService.js

const nodemailer = require('nodemailer');
const twilio = require('twilio');
const User = require('../models/User');

// Configuration (à mettre dans vos variables d'environnement)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'eventtick14@gmail.com',
    pass: 'eyst yjsw ifrw jkmj'
  }
});

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

exports.sendEmail = async ({ to, subject, text }) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text
    });
    return true;
  } catch (err) {
    console.error('Erreur d\'envoi d\'email:', err);
    return false;
  }
};

exports.sendSMS = async ({ to, message }) => {
  try {
    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to
    });
    return true;
  } catch (err) {
    console.error('Erreur d\'envoi de SMS:', err);
    return false;
  }
};
// utils/notificationService.js

exports.sendAppointmentNotification = async ({ patient, appointmentDate, doctorId }) => {
    try {
      // Récupérer les infos du médecin
      const doctor = await User.findById(doctorId).select('firstName lastName');
      
      if (!doctor) {
        console.error('Médecin non trouvé');
        return;
      }
      
      // Formater la date
      const formattedDate = new Date(appointmentDate).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      // Créer le contenu du message
      const subject = "Rappel de votre prochain rendez-vous";
      const content = `Bonjour ${patient.firstName},\n\n` +
        `Votre prochain rendez-vous avec Dr ${doctor.lastName} est prévu pour le ${formattedDate}.\n\n` +
        `Merci de nous contacter en cas d'empêchement.\n\n` +
        `Cordialement,\nL'équipe médicale`;
      
      // Envoyer le message
      if (patient.email) {
        await exports.sendEmail({
          to: patient.email,
          subject,
          text: content
        });
      }
      
      if (patient.phone) {
        await exports.sendSMS({
          to: patient.phone,
          message: content
        });
      }
      
      // Enregistrer dans l'historique des messages
      const Message = require('../models/Message');
      await Message.create({
        subject,
        content,
        recipients: [patient._id],
        sentBy: doctorId,
        channel: patient.email && patient.phone ? 'both' : patient.email ? 'email' : 'sms',
        status: 'sent'
      });
      
    } catch (err) {
      console.error('Erreur lors de l\'envoi de la notification:', err);
    }
  }