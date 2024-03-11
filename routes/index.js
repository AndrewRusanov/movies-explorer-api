import { Router } from "express";
import userRouter from "./users.js";
import moviesRouter from "./movies.js";
import auth from "../middlewares/auth.js";
import signInRouter from "./signin.js";
import signUpRouter from "./signup.js";

const router = Router();

router.use("/signin", signInRouter);
router.use("/signup", signUpRouter);
router.use(auth);
router.use("/users", userRouter);
router.use("/movies", moviesRouter);

export default router;
