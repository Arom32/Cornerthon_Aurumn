const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger/swagger');
const app = express();
const port = 3000;
const dbConnect = require("./config/dbConnect")

// db 연결
dbConnect()

// 미들웨어 설정
app.use(express.json());

// Swagger 연동
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// KOPIS 테스트 라우트
const testRouter = require('./routes/kopisTest');
app.use('/test', testRouter);

// 기본 라우트
app.get('/', (req, res) => {
  res.send('Cornerthon Team 2 Server is Running!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Swagger Docs available at http://localhost:${port}/api-docs`);
});