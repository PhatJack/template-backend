import express from "express";
import { HealthController } from "../controllers/health.controller.js";
import { UserController } from "../controllers/users.controller.js";
import { ConversationController } from "../controllers/conversations.controller.js";
import { MessageController } from "../controllers/messages.controller.js";
import { FileController } from "../controllers/files.controller.js";
import { AuthController } from "../controllers/auth.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { uploadMessageFiles } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.get("/health", HealthController.getHealth);
router.get("/users", UserController.listUsers);
router.post("/users", UserController.createUser);

router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);
router.get("/auth/me", authenticateToken, AuthController.me);

// Conversations
router.get("/conversations", ConversationController.listConversations);
router.post("/conversations", ConversationController.createConversationHandler);
router.get("/conversations/:id", ConversationController.getConversationById);
router.patch("/conversations/:id", ConversationController.updateConversationHandler);
router.delete("/conversations/:id", ConversationController.deleteConversationHandler);
// Messages
router.get("/messages", MessageController.listMessages);
router.post("/messages", MessageController.createMessageHandler);
router.get("/messages/reply/stream", MessageController.streamMessageHandler);
router.post(
  "/messages/reply",
  uploadMessageFiles,
  MessageController.generateMessageHandler,
);

// Files
router.get("/files", FileController.listFiles);
router.post("/files", uploadMessageFiles, FileController.createFileHandler);
router.delete("/files/:id", FileController.deleteFileHandler);

export default router;
