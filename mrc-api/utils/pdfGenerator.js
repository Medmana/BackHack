const PDFDocument = require('pdfkit');
const fs = require('fs');

async function generatePatientPDF(data) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];
      
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // En-tête du document
      doc.fontSize(20)
         .text('DOSSIER MÉDICAL', { align: 'center' })
         .moveDown();

      doc.fontSize(12)
         .text(`Patient: ${data.patient.firstName} ${data.patient.lastName}`)
         .text(`Numéro de dossier: ${data.patient.fileNumber}`)
         .text(`Date de naissance: ${new Date(data.patient.birthDate).toLocaleDateString()}`)
         .text(`Groupe sanguin: ${data.patient.bloodGroup || 'Non spécifié'}`)
         .moveDown();

      // Section 1: Informations médicales
      doc.fontSize(14)
         .text('1. INFORMATIONS MÉDICALES', { underline: true })
         .moveDown(0.5);

      doc.fontSize(12)
         .text(`Maladie: ${data.patient.diseases.name}`)
         .text(`Stade: ${data.patient.diseases.stage}`)
         .text(`Diagnostiqué le: ${data.patient.diseases.diagnosisDate ? new Date(data.patient.diseases.diagnosisDate).toLocaleDateString() : 'Non spécifié'}`)
         .moveDown();

      // Section 2: Antécédents
      doc.fontSize(14)
         .text('2. ANTÉCÉDENTS', { underline: true })
         .moveDown(0.5);

      if (data.antecedents.length > 0) {
        data.antecedents.forEach((antecedent, index) => {
          doc.text(`${index + 1}. ${antecedent.type.toUpperCase()}: ${antecedent.description}`);
          if (antecedent.severity) {
            doc.text(`   Sévérité: ${antecedent.severity}`);
          }
          if (antecedent.diagnosisDate) {
            doc.text(`   Date: ${new Date(antecedent.diagnosisDate).toLocaleDateString()}`);
          }
          doc.moveDown(0.5);
        });
      } else {
        doc.text('Aucun antécédent enregistré').moveDown();
      }

      // Section 3: Dernières prescriptions
      doc.fontSize(14)
         .text('3. DERNIÈRES PRESCRIPTIONS', { underline: true })
         .moveDown(0.5);

      if (data.prescriptions.length > 0) {
        data.prescriptions.forEach((prescription, index) => {
          doc.text(`${index + 1}. Prescription du ${new Date(prescription.date).toLocaleDateString()}`);
          prescription.medications.forEach(med => {
            doc.text(`   - ${med.name}: ${med.dosage}, ${med.frequency}, ${med.duration}`);
            if (med.instructions) {
              doc.text(`     Instructions: ${med.instructions}`);
            }
          });
          doc.moveDown(0.5);
        });
      } else {
        doc.text('Aucune prescription récente').moveDown();
      }

      // Section 4: Derniers examens
      doc.fontSize(14)
         .text('4. DERNIERS EXAMENS', { underline: true })
         .moveDown(0.5);

      // Examens sanguins
      doc.fontSize(12)
         .text('Sanguins:', { underline: true })
         .moveDown(0.5);

      const bloodExams = data.exams.filter(e => e.constructor.modelName === 'BloodExam');
      if (bloodExams.length > 0) {
        bloodExams.forEach((exam, index) => {
          doc.text(`${index + 1}. Examen du ${new Date(exam.examDate).toLocaleDateString()}`);
          doc.text(`   Créatinine: ${exam.creatinine || 'Non spécifié'}`);
          doc.text(`   Hémoglobine: ${exam.hemoglobin || 'Non spécifié'}`);
          doc.text(`   Globules blancs: ${exam.whiteBloodCells || 'Non spécifié'}`);
          doc.moveDown(0.5);
        });
      } else {
        doc.text('Aucun examen sanguin récent').moveDown();
      }

      // Examens urinaires
      doc.fontSize(12)
         .text('Urinaires:', { underline: true })
         .moveDown(0.5);

      const urinExams = data.exams.filter(e => e.constructor.modelName === 'UrinExam');
      if (urinExams.length > 0) {
        urinExams.forEach((exam, index) => {
          doc.text(`${index + 1}. Examen du ${new Date(exam.examDate).toLocaleDateString()}`);
          doc.text(`   Leucocytes: ${exam.leukocytes || 'Non spécifié'}`);
          doc.text(`   Érythrocytes: ${exam.erythrocytes || 'Non spécifié'}`);
          doc.moveDown(0.5);
        });
      } else {
        doc.text('Aucun examen urinaire récent').moveDown();
      }

      // Section 5: Dernières consultations
      doc.fontSize(14)
         .text('5. DERNIÈRES CONSULTATIONS', { underline: true })
         .moveDown(0.5);

      if (data.consultations.length > 0) {
        data.consultations.forEach((consult, index) => {
          doc.text(`${index + 1}. Consultation du ${new Date(consult.date).toLocaleDateString()}`);
          if (consult.reason) {
            doc.text(`   Motif: ${consult.reason}`);
          }
          if (consult.creatinineLevel) {
            doc.text(`   Créatinine: ${consult.creatinineLevel}`);
          }
          if (consult.notes) {
            doc.text(`   Notes: ${consult.notes}`);
          }
          doc.moveDown(0.5);
        });
      } else {
        doc.text('Aucune consultation récente').moveDown();
      }

      // Pied de page
      doc.fontSize(10)
         .text(`Généré le ${new Date().toLocaleDateString()}`, { align: 'right' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { generatePatientPDF };