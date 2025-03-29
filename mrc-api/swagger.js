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
        url: 'http://localhost:3000/api',
        description: 'Serveur de développement',
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
  }
};

module.exports = swaggerSpec;