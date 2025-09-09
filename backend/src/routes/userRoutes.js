import express from "express";
import { getUsers, getUserById, updateUser, deleteUser } from "../controllers/userController.js";
import { protect, adminonly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, adminonly, getUsers);
router.get("/:id", protect, getUserById);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, adminonly, deleteUser);

export default router;