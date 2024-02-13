import { Joi, celebrate } from "celebrate";
import { Router } from "express";
import { emailRegex } from "../utils/constants";
import { login } from "../controllers/users";

const signInRouter = Router();

signInRouter.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email().pattern(emailRegex),
      password: Joi.string().required(),
    }),
  }),
  login,
);

export default signInRouter;