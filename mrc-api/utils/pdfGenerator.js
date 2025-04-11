const PDFDocument = require('pdfkit');
const fs = require('fs');

async function generatePatientPDF(data) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        margin: 50,
        size: 'A4',
        info: {
          Title: `Dossier Médical - ${data.patient.firstName} ${data.patient.lastName}`,
          Author: 'Système Médical',
          CreationDate: new Date()
        }
      });
      
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // En-tête professionnel
      doc.image('logo.png', 50, 45, { width: 50 })
         .fillColor('#444444')
         .fontSize(20)
         .text('DOSSIER MÉDICAL', 110, 57, { align: 'left' })
         .fontSize(10)
         .text('Dr. Charbel SANNI', 200, 50, { align: 'right' })
         .text(`Généré le: ${new Date().toLocaleDateString()}`, 200, 65, { align: 'right' })
         .moveDown(3);

      // Section Identification du Patient
      doc.fillColor('#0066cc')
         .fontSize(14)
         .text('1. IDENTIFICATION DU PATIENT', { underline: true })
         .moveDown(0.5);
      
      doc.fillColor('#000000')
         .fontSize(12)
         .text(`ID Patient: ${data.patient._id || 'Non spécifié'}`)
         .text(`Nom complet: ${data.patient.firstName} ${data.patient.lastName}`)
         .text(`Email: ${data.patient.email || 'Non spécifié'}`)
         .moveDown();

      // Tableau Informations Personnelles
      doc.fontSize(12).text('Informations Personnelles:');
      const personalInfoTop = doc.y;
      doc.font('Helvetica-Bold').text('Nom complet:', 50, doc.y + 20);
      doc.font('Helvetica').text(`${data.patient.firstName} ${data.patient.lastName}`, 150, doc.y);
      doc.font('Helvetica-Bold').text('Téléphone:', 50, doc.y + 20);
      doc.font('Helvetica').text(data.patient.phone || 'Non spécifié', 150, doc.y);
      doc.font('Helvetica-Bold').text('Âge:', 300, personalInfoTop + 20);
      doc.font('Helvetica').text(`${data.patient.age || '0'} ans`, 350, doc.y);
      doc.font('Helvetica-Bold').text('Adresse:', 300, doc.y + 20);
      doc.font('Helvetica').text(data.patient.address || 'Non spécifié', 350, doc.y);
      doc.moveTo(50, doc.y + 20).lineTo(550, doc.y + 20).stroke();
      doc.moveDown();

      // Section Historique Médical
      doc.fillColor('#0066cc')
         .fontSize(14)
         .text('2. HISTORIQUE MÉDICAL', { underline: true })
         .moveDown(0.5);
      
      doc.fillColor('#000000');
      if (data.patient.diseases && data.patient.diseases.length > 0) {
        data.patient.diseases.forEach((disease, index) => {
          doc.font('Helvetica-Bold').text(`Maladie ${index + 1}:`);
          doc.font('Helvetica').text(`- Nom: ${disease.name}`);
          if (disease.stage) doc.text(`- Stade: ${disease.stage}`);
          if (disease.diagnosisDate) {
            doc.text(`- Diagnostiqué le: ${new Date(disease.diagnosisDate).toLocaleDateString()}`);
          }
          doc.moveDown(0.5);
        });
      } else {
        doc.text('Aucune maladie enregistrée').moveDown();
      }

      // Section Résultats de Laboratoire
      doc.fillColor('#0066cc')
         .fontSize(14)
         .text('3. RÉSULTATS DE LABORATOIRE', { underline: true })
         .moveDown(0.5);
      
      if (data.exams && data.exams.length > 0) {
        // Tableau des résultats
        const examTableTop = doc.y + 20;
        let examTableY = examTableTop;
        
        // En-tête du tableau
        doc.font('Helvetica-Bold')
           .text('Test', 50, examTableY)
           .text('Résultat', 200, examTableY)
           .text('Plage Normale', 300, examTableY)
           .text('Statut', 400, examTableY)
           .text('Date', 470, examTableY);
        
        examTableY += 25;
        doc.moveTo(50, examTableY).lineTo(550, examTableY).stroke();
        examTableY += 10;
        
        // Remplissage des données
        doc.font('Helvetica');
        data.exams.forEach(exam => {
          if (exam.type === 'blood') {
            if (exam.albumin) addExamRow('Albumine', `${exam.albumin} g/L`, '35-50 g/L', getStatus(exam.albumin, 35, 50), exam.examDate);
            if (exam.hemoglobin) addExamRow('Hémoglobine', `${exam.hemoglobin} g/dL`, '13-17 g/dL', getStatus(exam.hemoglobin, 13, 17), exam.examDate);
            if (exam.calcium) addExamRow('Calcium', `${exam.calcium} mmol/L`, '2.1-2.6 mmol/L', getStatus(exam.calcium, 2.1, 2.6), exam.examDate);
          }
          if (exam.type === 'urin') {
            if (exam.bicarbonates) addExamRow('Bicarbonates', `${exam.bicarbonates} mmol/L`, '22-30 mmol/L', getStatus(exam.bicarbonates, 22, 30), exam.examDate);
          }
        });
        
        doc.y = examTableY + 10;
      } else {
        doc.text('Aucun examen récent').moveDown();
      }

      // Fonction helper pour ajouter des lignes au tableau
      function addExamRow(test, result, normalRange, status, date) {
        if (examTableY > 700) { // Nouvelle page si nécessaire
          doc.addPage();
          examTableY = 50;
        }
        
        doc.text(test, 50, examTableY)
           .text(result, 200, examTableY)
           .text(normalRange, 300, examTableY)
           .text(status, 400, examTableY)
           .text(new Date(date).toLocaleDateString(), 470, examTableY);
        
        examTableY += 20;
      }
      
      // Fonction helper pour déterminer le statut
      function getStatus(value, min, max) {
        if (value < min) return 'Below Normal';
        if (value > max) return 'Above Normal';
        return 'Normal';
      }

      // Pied de page
      doc.fontSize(10)
         .text(`Dossier Médical Confidential - ${data.patient.firstName} ${data.patient.lastName}`, 50, 750, { align: 'left' })
         .text(`Page ${doc.bufferedPageRange().count} sur ${doc.bufferedPageRange().count}`, 500, 750, { align: 'right' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { generatePatientPDF };