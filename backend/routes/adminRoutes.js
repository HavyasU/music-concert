import { Router } from "express";
import { loginAdmin } from "../controllers/adminControllers.js";
const adminRoutes = Router();


adminRoutes.post('/login', loginAdmin); //    /admin/login


export default adminRoutes;