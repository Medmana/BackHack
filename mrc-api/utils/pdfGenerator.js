const PDFDocument = require('pdfkit');

exports.generatePDF = async (patient, consultations) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const buffers = [];
      
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
      
      // En-tête du document
      doc.fontSize(18).text('Synthèse Médicale', { align: 'center' });
      doc.moveDown();
      
      // Informations patient
      doc.fontSize(14).text('Informations Patient:');
      doc.fontSize(12).text(`Nom: ${patient.lastName} ${patient.firstName}`);
      doc.text(`Date de naissance: ${patient.birthDate.toLocaleDateString()}`);
      doc.text(`Sexe: ${patient.gender === 'male' ? 'Masculin' : 'Féminin'}`);
      doc.text(`Numéro de dossier: ${patient.fileNumber}`);
      doc.moveDown();
      
      // Stade de la maladie rénale
      if (patient.kidneyDisease?.stage) {
        doc.fontSize(14).text('Maladie Rénale Chronique:');
        doc.fontSize(12).text(`Stade: ${patient.kidneyDisease.stage}`);
        if (patient.kidneyDisease.diagnosisDate) {
          doc.text(`Date de diagnostic: ${patient.kidneyDisease.diagnosisDate.toLocaleDateString()}`);
        }
        doc.moveDown();
      }
      
      // Dernières consultations
      if (consultations.length > 0) {
        doc.fontSize(14).text('Dernières Consultations:');
        consultations.forEach(consult => {
          doc.fontSize(12).text(`Date: ${consult.date.toLocaleDateString()}`);
          doc.text(`Médecin: Dr ${consult.doctor.lastName}`);
          if (consult.creatinineLevel) {
            doc.text(`Créatinine: ${consult.creatinineLevel} mg/dL`);
          }
          if (consult.observations) {
            doc.text(`Observations: ${consult.observations}`);
          }
          doc.moveDown(0.5);
        });
      }
      
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};