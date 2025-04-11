const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestion des Patients MRC - Bénin',
      version: '1.0.0',
      description: 'API pour la plateforme web de gestion des patients atteints de maladie rénale chronique au Bénin',
    },
    servers: [
      {
      url: 'http://localhost:3000/api', description: 'Serveur de développement' ,
      
      },
      {
      
      url: 'https://backhack-production.up.railway.app/api', description: 'Serveur de production', 
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      security: [{
         bearerAuth: []
      }],
      schemas: {

        Patient: {
          type: 'object',
          properties: {
            firstName: { type: 'string', example: 'Jean' },
            lastName: { type: 'string', example: 'Doe' },
            birthDate: { type: 'string', format: 'date', example: '1980-05-15' },
            gender: { type: 'string', enum: ['male', 'female', 'other'], example: 'male' },
            address: {
              type: 'object',
              properties: {
                street: { type: 'string', example: '123 Rue des Cocotiers' },
                city: { type: 'string', example: 'Cotonou' },
                postalCode: { type: 'string', example: '00229' },
              },
            },
            phone: { type: 'string', example: '+22912345678' },
            email: { type: 'string', format: 'email', example: 'jean.doe@example.com' },
            medicalHistory: {
              type: 'object',
              properties: {
                chronicDiseases: { type: 'array', items: { type: 'string' }, example: ['Hypertension', 'Diabète'] },
                allergies: { type: 'array', items: { type: 'string' }, example: ['Pénicilline'] },
              },
            },
            kidneyDisease: {
              type: 'object',
              properties: {
                stage: { type: 'number', minimum: 1, maximum: 5, example: 3 },
                diagnosisDate: { type: 'string', format: 'date', example: '2020-01-10' },
                comorbidities: { type: 'array', items: { type: 'string' }, example: ['Hypertension'] },
              },
            },
            currentTreatments: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Enalapril' },
                  dosage: { type: 'string', example: '10mg' },
                  frequency: { type: 'string', example: '1 fois par jour' },
                },
              },
            },
          },
          required: ['firstName', 'lastName', 'birthDate', 'gender', 'phone'],
        },
        // Schémas pour les Prescriptions
        Prescription: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            patientId: { type: 'string', example: '507f1f77bcf86cd799439012' },
            doctorId: { type: 'string', example: '507f1f77bcf86cd799439013' },
            date: { type: 'string', format: 'date-time', example: '2023-04-01T10:00:00Z' },
            expirationDate: { type: 'string', format: 'date-time', example: '2023-05-01T10:00:00Z' },
            medications: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Paracétamol' },
                  dosage: { type: 'string', example: '500mg' },
                  frequency: { type: 'string', example: '3 fois par jour' },
                  duration: { type: 'string', example: '7 jours' },
                  instructions: { type: 'string', example: 'Prendre après les repas' }
                }
              }
            },
            notes: { type: 'string', example: "Éviter la prise d'alcool" },
            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },

        // Schémas pour les Examens
        BloodExam: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            patientId: { type: 'string', example: '507f1f77bcf86cd799439012' },
            doctorId: { type: 'string', example: '507f1f77bcf86cd799439013' },
            examDate: { type: 'string', format: 'date-time', example: '2023-06-15T09:30:00Z' },
            redBloodCells: { type: 'number', example: 4.5 },
            hemoglobin: { type: 'number', example: 14.2 },
            whiteBloodCells: { type: 'number', example: 6.8 },
            platelets: {
              type: 'object',
              properties: {
                value: { type: 'number', example: 250000 },
                comment: { type: 'string', example: 'Dans la norme' }
              }
            },
            glucose: { type: 'number', example: 5.2 },
            creatinine: { type: 'number', example: 0.9 },
            sodium: { type: 'number', example: 140 },
            potassium: { type: 'number', example: 4.2 },
            labNotes: { type: 'string', example: 'Prélèvement effectué à jeun' },
            interpretation: { type: 'string', example: 'Résultats normaux' },
            isAbnormal: { type: 'boolean', example: false },
            followUpRequired: { type: 'boolean', example: false },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },

        UrinExam: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439021' },
            patientId: { type: 'string', example: '507f1f77bcf86cd799439012' },
            doctorId: { type: 'string', example: '507f1f77bcf86cd799439013' },
            examDate: { type: 'string', format: 'date-time', example: '2023-06-15T09:30:00Z' },
            appearance: { type: 'string', example: 'Claire' },
            color: { type: 'string', example: 'Jaune pâle' },
            leukocytes: { type: 'number', example: 2 },
            erythrocytes: { type: 'number', example: 0 },
            germCount: { type: 'number', example: 0 },
            identifiedBacteria: { type: 'string', example: 'Aucune' },
            conclusion: { type: 'string', example: 'Examen normal' },
            isAbnormal: { type: 'boolean', example: false },
            requiresFollowUp: { type: 'boolean', example: false },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },

        // Schémas pour les Alertes
        Alert: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            patient: {
              type: 'object',
              properties: {
                _id: { type: 'string', example: '507f1f77bcf86cd799439012' },
                firstName: { type: 'string', example: 'Jean' },
                lastName: { type: 'string', example: 'Dupont' },
                fileNumber: { type: 'string', example: 'PAT12345' }
              }
            },
            doctor: {
              type: 'object',
              properties: {
                _id: { type: 'string', example: '507f1f77bcf86cd799439013' },
                firstName: { type: 'string', example: 'Marie' },
                lastName: { type: 'string', example: 'Martin' }
              }
            },
            reason: { 
              type: 'string', 
              enum: ['chronique', 'avancé', 'autre'],
              example: 'chronique'
            },
            creatinineLevel: { type: 'number', example: 2.5 },
            consultation: { type: 'string', example: '507f1f77bcf86cd799439014' },
            isActive: { type: 'boolean', example: true },
            isRead: { type: 'boolean', example: false },
            createdAt: { type: 'string', format: 'date-time', example: '2023-06-15T09:30:00Z' }
          }
        },

        // Schémas pour les Antécédents
        Antecedent: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            patientId: { type: 'string', example: '507f1f77bcf86cd799439012' },
            type: {
              type: 'string',
              enum: ['familial', 'personnel', 'chirurgical', 'allergie', 'traitement', 'autre'],
              example: 'personnel'
            },
            description: { type: 'string', example: 'Hypertension artérielle diagnostiquée en 2015' },
            severity: {
              type: 'string',
              enum: ['léger', 'modéré', 'sévère'],
              nullable: true,
              example: 'modéré'
            },
            diagnosisDate: { type: 'string', format: 'date', example: '2015-06-15' },
            createdBy: {
              type: 'object',
              properties: {
                _id: { type: 'string' },
                firstName: { type: 'string', example: 'Jean' },
                lastName: { type: 'string', example: 'Dupont' }
              }
            },
            updatedBy: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }    
    },
        Consultation: {
          type: 'object',
          properties: {
            date: { type: 'string', format: 'date-time', example: '2023-04-15T09:30:00Z' },
            reason: { type: 'string', example: 'Suivi trimestriel' },
            observations: { type: 'string', example: 'Patient stable' },
            bloodPressure: {
              type: 'object',
              properties: {
                systolic: { type: 'number', example: 120 },
                diastolic: { type: 'number', example: 80 },
              },
            },
            creatinineLevel: { type: 'number', example: 1.8 },
            gfr: { type: 'number', example: 45 },
            treatment: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  medication: { type: 'string', example: 'Enalapril' },
                  dosage: { type: 'string', example: '10mg' },
                  duration: { type: 'string', example: '30 jours' },
                },
              },
            },
            nextAppointment: { type: 'string', format: 'date-time', example: '2023-07-15T09:30:00Z' },
          },
        },
        User: {
          type: 'object',
          properties: {
            firstName: { type: 'string', example: 'Marie' },
            lastName: { type: 'string', example: 'Dupont' },
            email: { type: 'string', format: 'email', example: 'marie.dupont@example.com' },
            role: { type: 'string', enum: ['admin', 'doctor'], example: 'doctor' },
            phone: { type: 'string', example: '+22998765432' },
            specialty: { type: 'string', example: 'Néphrologie' },
          },
          required: ['firstName', 'lastName', 'email', 'role'],
        },
        Login: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email', example: 'marie.dupont@example.com' },
            password: { type: 'string', example: 'motdepasse123' },
          },
          required: ['email', 'password'],
        },
        RegisterAdmin: {
          type: 'object',
          properties: {
            firstName: { type: 'string', example: 'Admin' },
            lastName: { type: 'string', example: 'System' },
            email: { type: 'string', format: 'email', example: 'admin@mrc.bj' },
            password: { type: 'string', example: 'MotDePasseSecure123' },
          },
          required: ['firstName', 'lastName', 'email', 'password'],
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Erreur de validation' },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Token invalide ou manquant',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        ForbiddenError: {
          description: 'Permissions insuffisantes',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        NotFoundError: {
          description: 'Ressource non trouvée',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        ValidationError: {
          description: 'Erreur de validation',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Authentification',
        description: 'Opérations liées à l\'authentification',
      },
      {
        name: 'Patients',
        description: 'Gestion des patients atteints de MRC',
      },
      {
        name: 'Consultations',
        description: 'Gestion des consultations médicales',
      },
      
      {
        name: 'Administration',
        description: 'Opérations réservées aux administrateurs',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

// Ajout manuel des paths
swaggerSpec.paths = {
  '/auth/register-admin': {
    post: {
      tags: ['Authentification'],
      summary: 'Enregistrement du premier administrateur',
      description: 'Route publique pour créer le compte admin initial (disponible seulement si aucun admin existe)',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/RegisterAdmin',
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Compte admin créé avec succès',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Compte administrateur créé avec succès' },
                  user: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', example: '5f8d0d55b54764421b7156c3' },
                      email: { type: 'string', example: 'admin@mrc.bj' },
                      role: { type: 'string', example: 'admin' },
                    },
                  },
                },
              },
            },
          },
        },
        403: {
          description: 'Un administrateur existe déjà',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        500: {
          description: 'Erreur serveur',
        },
      },
    },
  },
  '/auth/login': {
    post: {
      tags: ['Authentification'],
      summary: 'Connexion d\'un utilisateur',
      description: 'Authentifie un professionnel de santé et retourne un token JWT',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Login',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Authentification réussie',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                  user: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', example: '5f8d0d55b54764421b7156c3' },
                      firstName: { type: 'string', example: 'Marie' },
                      lastName: { type: 'string', example: 'Dupont' },
                      email: { type: 'string', example: 'marie.dupont@example.com' },
                      role: { type: 'string', example: 'doctor' },
                    },
                  },
                },
              },
            },
          },
        },
        401: {
          $ref: '#/components/responses/UnauthorizedError',
        },
        500: {
          description: 'Erreur serveur',
        },
      },
    },
  },
  '/auth/profile': {
    get: {
      tags: ['Authentification'],
      summary: 'Récupère le profil de l\'utilisateur connecté',
      description: 'Retourne les informations du professionnel de santé authentifié',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Profil utilisateur',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/User',
              },
            },
          },
        },
        401: {
          $ref: '#/components/responses/UnauthorizedError',
        },
        500: {
          description: 'Erreur serveur',
        },
      },
    },
  },
  '/admin/users': {
    post: {
      tags: ['Administration'],
      summary: 'Créer un utilisateur (admin ou médecin)',
      description: 'Crée un nouveau compte utilisateur (admin seulement)',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/User',
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Utilisateur créé avec succès',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Utilisateur créé avec succès' },
                  user: {
                    $ref: '#/components/schemas/User'
                  }
                },
              },
            },
          },
        },
        400: {
          $ref: '#/components/responses/ValidationError',
        },
        401: {
          $ref: '#/components/responses/UnauthorizedError',
        },
        403: {
          $ref: '#/components/responses/ForbiddenError',
        },
        500: {
          description: 'Erreur serveur',
        },
      },
    },
    get: {
      tags: ['Administration'],
      summary: 'Liste tous les utilisateurs',
      description: 'Retourne la liste de tous les utilisateurs (admin seulement)',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Liste des utilisateurs',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/User',
                },
              },
            },
          },
        },
        401: {
          $ref: '#/components/responses/UnauthorizedError',
        },
        403: {
          $ref: '#/components/responses/ForbiddenError',
        },
        500: {
          description: 'Erreur serveur',
        },
      },
    },
  },
  '/admin/users/:id': {
    delete: {
      tags: ['Administration'],
      summary: 'Supprimer un utilisateur',
      description: 'Supprime un utilisateur du système (admin seulement)',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID de l\'utilisateur à supprimer',
          schema: {
            type: 'string',
          },
        },
      ],
      responses: {
        200: {
          description: 'Utilisateur supprimé',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Utilisateur supprimé avec succès' },
                },
              },
            },
          },
        },
        401: {
          $ref: '#/components/responses/UnauthorizedError',
        },
        403: {
          $ref: '#/components/responses/ForbiddenError',
        },
        404: {
          $ref: '#/components/responses/NotFoundError',
        },
        500: {
          description: 'Erreur serveur',
        },
      },
    },
    put: {
      tags: ['Administration'],
      summary: 'Mettre à jour les permissions d\'un utilisateur',
      description: 'Modifie les permissions d\'un utilisateur (admin seulement)',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID de l\'utilisateur à modifier',
          schema: {
            type: 'string',
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                permissions: {
                  type: 'object',
                  example: { canEditPatients: true, canDeletePatients: false }
                }
              }
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Permissions mises à jour',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Permissions mises à jour avec succès' },
                  user: {
                    $ref: '#/components/schemas/User'
                  }
                },
              },
            },
          },
        },
        400: {
          $ref: '#/components/responses/ValidationError',
        },
        401: {
          $ref: '#/components/responses/UnauthorizedError',
        },
        403: {
          $ref: '#/components/responses/ForbiddenError',
        },
        404: {
          $ref: '#/components/responses/NotFoundError',
        },
        500: {
          description: 'Erreur serveur',
        },
      },
    },
  },
  '/patients': {
    get: {
      tags: ['Patients'],
      summary: 'Liste des patients',
      description: 'Retourne la liste des patients pour le médecin connecté ou tous les patients pour un admin',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Liste des patients',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/Patient',
                },
              },
            },
          },
        },
        401: {
          $ref: '#/components/responses/UnauthorizedError',
        },
        403: {
          $ref: '#/components/responses/ForbiddenError',
        },
        500: {
          description: 'Erreur serveur',
        },
      },
    },
    post: {
      tags: ['Patients'],
      summary: 'Créer un nouveau patient',
      description: 'Enregistre un nouveau patient dans le système (médecin seulement)',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Patient',
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Patient créé avec succès',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Patient',
              },
            },
          },
        },
        400: {
          $ref: '#/components/responses/ValidationError',
        },
        401: {
          $ref: '#/components/responses/UnauthorizedError',
        },
        403: {
          $ref: '#/components/responses/ForbiddenError',
        },
        500: {
          description: 'Erreur serveur',
        },
      },
    },
  },
  '/patients/{id}': {
    get: {
      tags: ['Patients'],
      summary: 'Récupérer un patient',
      description: 'Retourne les informations complètes d\'un patient',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID du patient',
          schema: {
            type: 'string',
          },
        },
      ],
      responses: {
        200: {
          description: 'Détails du patient',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Patient',
              },
            },
          },
        },
        401: {
          $ref: '#/components/responses/UnauthorizedError',
        },
        403: {
          $ref: '#/components/responses/ForbiddenError',
        },
        404: {
          $ref: '#/components/responses/NotFoundError',
        },
        500: {
          description: 'Erreur serveur',
        },
      },
    },
    put: {
      tags: ['Patients'],
      summary: 'Mettre à jour un patient',
      description: 'Modifie les informations d\'un patient existant',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID du patient',
          schema: {
            type: 'string',
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Patient',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Patient mis à jour',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Patient',
              },
            },
          },
        },
        400: {
          $ref: '#/components/responses/ValidationError',
        },
        401: {
          $ref: '#/components/responses/UnauthorizedError',
        },
        403: {
          $ref: '#/components/responses/ForbiddenError',
        },
        404: {
          $ref: '#/components/responses/NotFoundError',
        },
        500: {
          description: 'Erreur serveur',
        },
      },
    },
    delete: {
      tags: ['Patients'],
      summary: 'Supprimer un patient',
      description: 'Supprime logiquement un patient (archivage)',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID du patient',
          schema: {
            type: 'string',
          },
        },
      ],
      responses: {
        200: {
          description: 'Patient supprimé',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Patient archivé avec succès' },
                },
              },
            },
          },
        },
        401: {
          $ref: '#/components/responses/UnauthorizedError',
        },
        403: {
          $ref: '#/components/responses/ForbiddenError',
        },
        404: {
          $ref: '#/components/responses/NotFoundError',
        },
        500: {
          description: 'Erreur serveur',
        },
      },
    },
  },
  '/patients/{id}/summary': {
    get: {
      tags: ['Patients'],
      summary: 'Générer une synthèse médicale',
      description: 'Génère un PDF avec les informations médicales du patient',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID du patient',
          schema: {
            type: 'string',
          },
        },
      ],
      responses: {
        200: {
          description: 'PDF généré',
          content: {
            'application/pdf': {
              schema: {
                type: 'string',
                format: 'binary',
              },
            },
          },
        },
        401: {
          $ref: '#/components/responses/UnauthorizedError',
        },
        403: {
          $ref: '#/components/responses/ForbiddenError',
        },
        404: {
          $ref: '#/components/responses/NotFoundError',
        },
        500: {
          description: 'Erreur serveur',
        },
      },
    },
  },
  '/consultations/{patientId}': {
    post: {
      tags: ['Consultations'],
      summary: 'Créer une consultation',
      description: 'Enregistre une nouvelle consultation pour un patient',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'patientId',
          in: 'path',
          required: true,
          description: 'ID du patient',
          schema: {
            type: 'string',
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Consultation',
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Consultation créée',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Consultation',
              },
            },
          },
        },
        400: {
          $ref: '#/components/responses/ValidationError',
        },
        401: {
          $ref: '#/components/responses/UnauthorizedError',
        },
        403: {
          $ref: '#/components/responses/ForbiddenError',
        },
        404: {
          $ref: '#/components/responses/NotFoundError',
        },
        500: {
          description: 'Erreur serveur',
        },
      },
    },
    get: {
      tags: ['Consultations'],
      summary: 'Liste des consultations',
      description: 'Retourne l\'historique des consultations pour un patient',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'patientId',
          in: 'path',
          required: true,
          description: 'ID du patient',
          schema: {
            type: 'string',
          },
        },
      ],
      responses: {
        200: {
          description: 'Liste des consultations',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/Consultation',
                },
              },
            },
          },
        },
        401: {
          $ref: '#/components/responses/UnauthorizedError',
        },
        403: {
          $ref: '#/components/responses/ForbiddenError',
        },
        404: {
          $ref: '#/components/responses/NotFoundError',
        },
        500: {
          description: 'Erreur serveur',
        },
      },
    },
  },

  '/patients/{patientId}/prescriptions': {
    post: {
      tags: ['Prescriptions'],
      summary: 'Créer une nouvelle prescription',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'patientId',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                medications: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      dosage: { type: 'string' },
                      frequency: { type: 'string' },
                      duration: { type: 'string' }
                    }
                  }
                },
                expirationDate: { type: 'string', format: 'date-time' },
                notes: { type: 'string' }
              },
              required: ['medications', 'expirationDate']
            }
          }
        }
      },
      responses: {
        '201': {
          description: 'Prescription créée avec succès',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Prescription' }
            }
          }
        },
        '400': { $ref: '#/components/schemas/ErrorResponse' },
        '401': { description: 'Non autorisé' },
        '403': { description: 'Accès refusé' }
      }
    },
    get: {
      tags: ['Prescriptions'],
      summary: 'Lister les prescriptions d\'un patient',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'patientId',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        '200': {
          description: 'Liste des prescriptions',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/Prescription' }
              }
            }
          }
        },
        '400': { $ref: '#/components/schemas/ErrorResponse' },
        '401': { description: 'Non autorisé' }
      }
    }
  },

  '/prescriptions/{id}': {
    get: {
      tags: ['Prescriptions'],
      summary: 'Récupérer une prescription spécifique',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        '200': {
          description: 'Détails de la prescription',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Prescription' }
            }
          }
        },
        '404': { $ref: '#/components/schemas/ErrorResponse' },
        '401': { description: 'Non autorisé' }
      }
    },
    put: {
      tags: ['Prescriptions'],
      summary: 'Mettre à jour une prescription',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                medications: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      dosage: { type: 'string' },
                      frequency: { type: 'string' },
                      duration: { type: 'string' }
                    }
                  }
                },
                expirationDate: { type: 'string', format: 'date-time' },
                notes: { type: 'string' },
                isActive: { type: 'boolean' }
              }
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Prescription mise à jour',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Prescription' }
            }
          }
        },
        '400': { $ref: '#/components/schemas/ErrorResponse' },
        '404': { $ref: '#/components/schemas/ErrorResponse' },
        '401': { description: 'Non autorisé' }
      }
    },
    delete: {
      tags: ['Prescriptions'],
      summary: 'Désactiver une prescription',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        '200': {
          description: 'Prescription désactivée',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Prescription désactivée avec succès' }
                }
              }
            }
          }
        },
        '404': { $ref: '#/components/schemas/ErrorResponse' },
        '401': { description: 'Non autorisé' }
      }
    }
  },

  // ==============================================
  // ROUTES POUR LES EXAMENS MÉDICAUX
  // ==============================================
  '/blood': {
    post: {
      tags: ['Examens Sanguins'],
      summary: 'Créer un nouvel examen sanguin',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                patientId: { type: 'string', required: true },
                redBloodCells: { type: 'number' },
                hemoglobin: { type: 'number' },
                whiteBloodCells: { type: 'number' },
                glucose: { type: 'number' },
                interpretation: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        '201': {
          description: 'Examen sanguin créé',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/BloodExam' }
            }
          }
        },
        '400': { $ref: '#/components/schemas/ErrorResponse' },
        '401': { description: 'Non autorisé' }
      }
    }
  },

  '/blood/{patientId}': {
    get: {
      tags: ['Examens Sanguins'],
      summary: 'Lister les examens sanguins d\'un patient',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'patientId',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        '200': {
          description: 'Liste des examens sanguins',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/BloodExam' }
              }
            }
          }
        },
        '400': { $ref: '#/components/schemas/ErrorResponse' },
        '401': { description: 'Non autorisé' }
      }
    }
  },

  '/blood/exam/{id}': {
    get: {
      tags: ['Examens Sanguins'],
      summary: 'Obtenir un examen sanguin spécifique',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        '200': {
          description: 'Détails de l\'examen sanguin',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/BloodExam' }
            }
          }
        },
        '404': { $ref: '#/components/schemas/ErrorResponse' },
        '401': { description: 'Non autorisé' }
      }
    },
    put: {
      tags: ['Examens Sanguins'],
      summary: 'Mettre à jour un examen sanguin',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                hemoglobin: { type: 'number' },
                interpretation: { type: 'string' },
                isAbnormal: { type: 'boolean' }
              }
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Examen sanguin mis à jour',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/BloodExam' }
            }
          }
        },
        '400': { $ref: '#/components/schemas/ErrorResponse' },
        '404': { $ref: '#/components/schemas/ErrorResponse' },
        '401': { description: 'Non autorisé' }
      }
    },
    delete: {
      tags: ['Examens Sanguins'],
      summary: 'Supprimer un examen sanguin',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        '200': {
          description: 'Examen sanguin supprimé',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Examen supprimé avec succès' }
                }
              }
            }
          }
        },
        '404': { $ref: '#/components/schemas/ErrorResponse' },
        '401': { description: 'Non autorisé' }
      }
    }
  },

  '/urin': {
    post: {
      tags: ['Examens Urinaires'],
      summary: 'Créer un nouvel examen urinaire',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                patientId: { type: 'string', required: true },
                appearance: { type: 'string' },
                leukocytes: { type: 'number' },
                conclusion: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        '201': {
          description: 'Examen urinaire créé',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UrinExam' }
            }
          }
        },
        '400': { $ref: '#/components/schemas/ErrorResponse' },
        '401': { description: 'Non autorisé' }
      }
    }
  },

  '/urin/{patientId}': {
    get: {
      tags: ['Examens Urinaires'],
      summary: 'Lister les examens urinaires d\'un patient',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'patientId',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        '200': {
          description: 'Liste des examens urinaires',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/UrinExam' }
              }
            }
          }
        },
        '400': { $ref: '#/components/schemas/ErrorResponse' },
        '401': { description: 'Non autorisé' }
      }
    }
  },

  '/urin/exam/{id}': {
    get: {
      tags: ['Examens Urinaires'],
      summary: 'Obtenir un examen urinaire spécifique',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        '200': {
          description: 'Détails de l\'examen urinaire',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UrinExam' }
            }
          }
        },
        '404': { $ref: '#/components/schemas/ErrorResponse' },
        '401': { description: 'Non autorisé' }
      }
    },
    put: {
      tags: ['Examens Urinaires'],
      summary: 'Mettre à jour un examen urinaire',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                leukocytes: { type: 'number' },
                conclusion: { type: 'string' },
                requiresFollowUp: { type: 'boolean' }
              }
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Examen urinaire mis à jour',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UrinExam' }
            }
          }
        },
        '400': { $ref: '#/components/schemas/ErrorResponse' },
        '404': { $ref: '#/components/schemas/ErrorResponse' },
        '401': { description: 'Non autorisé' }
      }
    },
    delete: {
      tags: ['Examens Urinaires'],
      summary: 'Supprimer un examen urinaire',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        '200': {
          description: 'Examen urinaire supprimé',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Examen supprimé avec succès' }
                }
              }
            }
          }
        },
        '404': { $ref: '#/components/schemas/ErrorResponse' },
        '401': { description: 'Non autorisé' }
      }
    }
  },

  // ==============================================
  // ROUTES POUR LES ALERTES
  // ==============================================
  '/alerts': {
    get: {
      tags: ['Alertes'],
      summary: 'Lister toutes les alertes',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'status',
          in: 'query',
          schema: { type: 'string', enum: ['active', 'inactive'] }
        },
        {
          name: 'readStatus',
          in: 'query',
          schema: { type: 'string', enum: ['read', 'unread'] }
        }
      ],
      responses: {
        '200': {
          description: 'Liste des alertes',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/Alert' }
              }
            }
          }
        },
        '401': { description: 'Non autorisé' },
        '500': { description: 'Erreur serveur' }
      }
    }
  },

  '/alerts/unread-count': {
    get: {
      tags: ['Alertes'],
      summary: 'Nombre d\'alertes non lues',
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          description: 'Nombre d\'alertes non lues',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  count: { type: 'integer', example: 5 }
                }
              }
            }
          }
        },
        '401': { description: 'Non autorisé' },
        '500': { description: 'Erreur serveur' }
      }
    }
  },

  '/alerts/{id}/read': {
    put: {
      tags: ['Alertes'],
      summary: 'Marquer une alerte comme lue',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        '200': {
          description: 'Alerte marquée comme lue',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Alerte marquée comme lue' },
                  alert: { $ref: '#/components/schemas/Alert' }
                }
              }
            }
          }
        },
        '404': { $ref: '#/components/schemas/ErrorResponse' },
        '401': { description: 'Non autorisé' },
        '500': { description: 'Erreur serveur' }
      }
    }
  },

  '/alerts/{id}/resolve': {
    put: {
      tags: ['Alertes'],
      summary: 'Résoudre une alerte',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        '200': {
          description: 'Alerte résolue',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Alerte résolue' },
                  alert: { $ref: '#/components/schemas/Alert' }
                }
              }
            }
          }
        },
        '404': { $ref: '#/components/schemas/ErrorResponse' },
        '401': { description: 'Non autorisé' },
        '500': { description: 'Erreur serveur' }
      }
    }
  },

  '/alerts/{id}': {
    delete: {
      tags: ['Alertes'],
      summary: 'Supprimer une alerte',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        '200': {
          description: 'Alerte supprimée',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Alerte supprimée avec succès' }
                }
              }
            }
          }
        },
        '404': { $ref: '#/components/schemas/ErrorResponse' },
        '401': { description: 'Non autorisé' },
        '500': { description: 'Erreur serveur' }
      }
    }
  },

  '/alerts/mark-all-read': {
    put: {
      tags: ['Alertes'],
      summary: 'Marquer toutes les alertes comme lues',
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          description: 'Toutes les alertes marquées comme lues',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Toutes les alertes marquées comme lues' }
                }
              }
            }
          }
        },
        '401': { description: 'Non autorisé' },
        '500': { description: 'Erreur serveur' }
      }
    }
  },

  // ==============================================
  // ROUTES POUR LES ANTÉCÉDENTS
  // ==============================================
  '/patients/{patientId}/antecedents': {
    post: {
      tags: ['Antécédents'],
      summary: 'Créer un nouvel antécédent',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'patientId',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                type: { type: 'string', required: true },
                description: { type: 'string', required: true },
                severity: { type: 'string' },
                diagnosisDate: { type: 'string', format: 'date' }
              }
            }
          }
        }
      },
      responses: {
        '201': {
          description: 'Antécédent créé',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Antecedent' }
            }
          }
        },
        '400': { $ref: '#/components/schemas/ErrorResponse' },
        '401': { description: 'Non autorisé' },
        '403': { description: 'Accès refusé' }
      }
    },
    get: {
      tags: ['Antécédents'],
      summary: 'Lister les antécédents d\'un patient',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'patientId',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        '200': {
          description: 'Liste des antécédents',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Antecedent' }
                  }
                }
              }
            }
          }
        },
        '400': { $ref: '#/components/schemas/ErrorResponse' },
        '401': { description: 'Non autorisé' }
      }
    }
  },

  '/patients/{patientId}/antecedents/bulk': {
    post: {
      tags: ['Antécédents'],
      summary: 'Création multiple d\'antécédents',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'patientId',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: { type: 'string', required: true },
                  description: { type: 'string', required: true },
                  severity: { type: 'string' }
                }
              }
            }
          }
        }
      },
      responses: {
        '201': {
          description: 'Antécédents créés',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Antecedent' }
                  }
                }
              }
            }
          }
        },
        '400': { $ref: '#/components/schemas/ErrorResponse' },
        '401': { description: 'Non autorisé' }
      }
    }
  },

  '/antecedents/{antecedentId}': {
    put: {
      tags: ['Antécédents'],
      summary: 'Mettre à jour un antécédent',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'antecedentId',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                type: { type: 'string' },
                description: { type: 'string' },
                severity: { type: 'string' },
                diagnosisDate: { type: 'string', format: 'date' }
              }
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Antécédent mis à jour',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/Antecedent' }
                }
              }
            }
          }
        },
        '400': { $ref: '#/components/schemas/ErrorResponse' },
        '404': { $ref: '#/components/schemas/ErrorResponse' },
        '401': { description: 'Non autorisé' }
      }
    },
    delete: {
      tags: ['Antécédents'],
      summary: 'Supprimer un antécédent',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'antecedentId',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        '200': {
          description: 'Antécédent supprimé',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Antécédent supprimé avec succès' }
                    }
                  }
                }
              }
            }
          }
        },
        '404': { $ref: '#/components/schemas/ErrorResponse' },
        '401': { description: 'Non autorisé' }
      }
    }
  }



};

module.exports = swaggerSpec;