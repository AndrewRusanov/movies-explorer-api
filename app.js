import express, { urlencoded } from 'express';
import mongoose from 'mongoose';
import handleCenterError from './middlewares/centerError';

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb');

app.use(handleCenterError);

app.listen(PORT, () => {
  console.log(`Server listen port ${PORT}`);
});
