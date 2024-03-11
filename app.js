require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const bodyParser = require('body-parser');
// eslint-disable-next-line import/no-extraneous-dependencies
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const handleCenterError = require('./middlewares/centerError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/NotFoundError');
const router = require('./routes/index');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;
mongoose.connect(DB_URL);
const app = express();

app.use(cors());
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.use(router);

app.use('*', (req, res, next) => next(new NotFoundError('Страница не найдена')));

app.use(errorLogger);
app.use(errors());

app.use(handleCenterError);

app.listen(PORT, () => {
  console.log(`Server listen port ${PORT}`);
});
