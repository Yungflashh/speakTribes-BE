import { Router } from "express";
import * as courseController from "../controllers/courseController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

router.post("/courses", authenticateToken, courseController.createCourse);
router.get("/courses", authenticateToken, courseController.getAllCourses);
router.get("/courses/:id", authenticateToken, courseController.getCourseById);
router.put("/courses/:id", authenticateToken, courseController.updateCourse);
router.delete("/courses/:id", authenticateToken, courseController.deleteCourse);
export default router;
