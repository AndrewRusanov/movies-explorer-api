import express, { urlencoded } from "express";
import cors from "cors";
import mongoose from "mongoose";

import { errors } from "celebrate";
import dotenv from "dotenv";

import helmet from "helmet";
import handleCenterError from "./middlewares/centerError.js";
import NotFoundError from "./errors/NotFoundError.js";
import router from "./routes/index.js";
import { requestLogger, errorLogger } from "./middlewares/logger.js";

dotenv.config();
const { PORT = 3000, DB_URL = "mongodb://127.0.0.1:27017/bitfilmsdb" } =
  process.env;
const app = express();
app.use(cors());
app.use(helmet());
app.use(requestLogger);

app.use(express.json());
app.use(urlencoded({ extended: true }));

mongoose.connect(DB_URL);

app.use(router);
app.use("*", (req, res, next) =>
  next(new NotFoundError("Страница не найдена"))
);
app.use(errorLogger);
app.use(errors());

app.use(handleCenterError);

app.listen(PORT, () => {
  console.log(`Server listen port ${PORT}`);
});
