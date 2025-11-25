import { Router } from "express";
import { sayHello } from "../controllers/homeController.js";
export const homeRouter = Router();

homeRouter.get('/', sayHello);