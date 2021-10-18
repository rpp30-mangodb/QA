const express = require('express');
const cors = require('cors');
const multer = require('multer');
const db = require('./database');

const PORT = 5000;
const app = express();

app.use(cors());
app.listen(PORT, function () {
  console.log(`CORS-enabled web server listening on port ${PORT}`);
});