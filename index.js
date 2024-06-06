const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();

process.loadEnvFile();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer().none());

try{
  const web = require('./routes/web');
  app.use('/', web);
}catch(e){
  console.log(e.message);
}

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

