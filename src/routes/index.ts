import express from "express";
import { HealthController } from "../controllers/health.controller";
import { UserController } from "../controllers/users.controller";
import { ConversationController } from "../controllers/conversations.controller";
import { MessageController } from "../controllers/messages.controller";
import { FileController } from "../controllers/files.controller";

const router = express.Router();

router.get("/health", HealthController.getHealth);
router.get("/users", UserController.listUsers);
router.post("/users", UserController.createUser);

// Conversations
router.get("/conversations", ConversationController.listConversations);
router.post("/conversations", ConversationController.createConversationHandler);
router.get("/conversations/:id", ConversationController.getConversationById);
router.patch("/conversations/:id", ConversationController.updateConversationHandler);
router.delete("/conversations/:id", ConversationController.deleteConversationHandler);
// Messages
router.get("/messages", MessageController.listMessages);
router.post("/messages", MessageController.createMessageHandler);
router.post("/messages/reply", MessageController.generateMessageHandler);

// Files
router.get("/files", FileController.listFiles);
router.post("/files", FileController.createFileHandler);
router.delete("/files/:id", FileController.deleteFileHandler);

export default router;
