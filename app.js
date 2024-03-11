require('dotenv').config();
const express = require('express');
const { urlencoded } = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
// eslint-disable-next-line import/no-extraneous-dependencies
const cors = require('cors');
const handleCenterError = require('./middlewares/centerError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/NotFoundError');
const router = require('./routes/index');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;
const app = express();

app.use(cors());
app.use(helmet());

app.use(requestLogger);

app.use(express.json());
app.use(urlencoded({ extended: true }));

mongoose.connect(DB_URL);

app.use(router);

app.use('*', (req, res, next) => next(new NotFoundError('Страница не найдена')));

app.use(errorLogger);
app.use(errors());

app.use(handleCenterError);

app.listen(PORT, () => {
  console.log(`Server listen port ${PORT}`);
});
