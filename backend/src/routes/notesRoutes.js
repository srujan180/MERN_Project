import express from "express";
import { deleteRoutes, getRoutes, postRoutes, putRoutes, getRoutesbyid } from "../controllers/notesController.js";

const router = express.Router();
router.get("/", getRoutes)
router.get("/:id", getRoutesbyid)

router.post("/", postRoutes)
router.put("/:id", putRoutes)
router.delete("/:id", deleteRoutes)
export default router;