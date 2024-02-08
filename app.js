import express, { urlencoded } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { errorLogger } from 'express-winston';
import { errors } from 'celebrate';
import handleCenterError from './middlewares/centerError';
import NotFoundError from './errors/NotFoundError';
import router from './routes';
import { requestLogger } from './middlewares/logger';

const { PORT = 3000 } = process.env;
const app = express();
app.use(cors());
app.use(requestLogger);

app.use(express.json());
app.use(urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb');

app.use(router);
app.use('*', (req, res, next) => next(new NotFoundError('Страница не найдена')));
app.use(errorLogger);
app.use(errors());

app.use(handleCenterError);

app.listen(PORT, () => {
  console.log(`Server listen port ${PORT}`);
});
