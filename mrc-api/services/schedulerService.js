const schedule = require('node-schedule');
const Consultation = require('../models/Consultation');
const { sendAppointmentNotification } = require('../utils/notificationService');
const mongoose = require('mongoose');
const { sendEmail, sendSMS } = require('../utils/notificationService');


// Planifier tous les rappels au démarrage du serveur
exports.scheduleAllReminders = async () => {
  // Annuler tous les jobs existants
  schedule.gracefulShutdown();
  
  // Récupérer toutes les consultations futures avec nextAppointment
  const now = new Date();
  const futureConsultations = await Consultation.find({
    nextAppointment: { $gt: now },
    reminderScheduled: { $ne: true } // Seulement celles non déjà planifiées
  }).populate('patient doctor');

  futureConsultations.forEach(consultation => {
    exports.scheduleReminder(consultation);
  });
};

// Planifier un rappel pour une consultation spécifique
exports.scheduleReminder = (consultation) => {
  const reminderDate = new Date(consultation.nextAppointment);
  reminderDate.setHours(reminderDate.getHours() - 24); // Rappel 24h avant

  if (reminderDate > new Date()) {
    const job = schedule.scheduleJob(reminderDate, async () => {
      try {
        await sendAppointmentNotification({
          patient: consultation.patient,
          appointmentDate: consultation.nextAppointment,
          doctorId: consultation.doctor._id
        });
        
        await Consultation.findByIdAndUpdate(consultation._id, {
          reminderSent: true
        });
      } catch (err) {
        console.error('Erreur lors de l\'envoi du rappel:', err);
      }
    });

    Consultation.findByIdAndUpdate(consultation._id, {
      reminderJobId: job.name,
      reminderScheduled: true
    }).exec();
  }
};


// Annuler un rappel planifié
exports.cancelScheduledReminder = async (consultationId) => {
  const consultation = await Consultation.findById(consultationId);
  
  if (consultation?.reminderJobId) {
    const job = schedule.scheduledJobs[consultation.reminderJobId];
    if (job) {
      job.cancel();
    }
    
    await Consultation.findByIdAndUpdate(consultationId, {
      reminderJobId: null,
      reminderScheduled: false,
      reminderSent: false
    });
  }
};