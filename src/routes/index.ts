import express from "express";
import { getHealth } from "../controllers/health.controller";
import { createUser, listUsers } from "../controllers/users.controller";

const router = express.Router();

router.get("/health", getHealth);
router.get("/users", listUsers);
router.post("/users", createUser);

export default router;
