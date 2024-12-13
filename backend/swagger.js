// swagger.js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Trend Core API',
      version: '1.0.0',
      description: 'Trend Core 쇼핑몰 API 문서',
      contact: {
        name: 'Trend Core',
        email: 'zmfltmvl@jbnu.ac.kr'
      }
    },
    servers: [
      {
        url: 'https://trendcore.store',
        description: '트렌드 코어'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'https',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: [
    './app.js',
    './routes/*.js'
  ]
};

const specs = swaggerJsdoc(options);

module.exports = specs;