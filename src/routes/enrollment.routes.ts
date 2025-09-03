import { Router } from "express";
import * as enrollmentController from "../controllers/enrollment.controller";

const router = Router();

// Enroll in a course
router.post("/courses/:courseId/enroll", enrollmentController.enrollUserInCourse);

// Get all user enrollments
router.get("/users/:userId/enrollments", enrollmentController.getUserEnrollments);

// Get progress for a specific course
router.get("/users/:userId/courses/:courseId/progress", enrollmentController.getUserCourseProgress);

// Update progress (e.g. xp, streak, lastLessonId)
router.patch("/users/:userId/courses/:courseId/progress", enrollmentController.updateUserCourseProgress);

export default router;
