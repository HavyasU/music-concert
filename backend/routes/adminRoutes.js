import { Router } from "express";
import { loginAdmin, registerAdmin } from "../controllers/adminControllers.js";

const adminRoutes = Router();

// Admin authentication
adminRoutes.post('/login', loginAdmin);
adminRoutes.post('/register', registerAdmin);

export default adminRoutes;