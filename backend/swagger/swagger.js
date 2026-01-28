const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cornerthon Aurumn API',
      version: '1.0.0',
      description: '문화예술 커뮤니티 플랫폼 아우름 API',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Local Server' },
    ],
  },
  apis: ['./routes/*.js'], // routes 폴더 내의 파일을 스캔
};

const specs = swaggerJsdoc(options);
module.exports = specs;