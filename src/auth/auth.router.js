import express from "express";
import { check } from "express-validator";
import { getUser, login, register } from "./auth.controller.js";

const router = express.Router();

router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  register
);

router.post(
  "/login",
  [check("email").isEmail(), check("password").isLength({ min: 6 })],
  login
);

router.get("/:email", getUser);

export default router;
