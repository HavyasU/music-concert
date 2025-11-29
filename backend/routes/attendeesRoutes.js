import { Router } from "express";
import {
    registerAttendee,
    getAttendeesByConcert,
    getAllAttendees
} from "../controllers/attendeesController.js";

const attendeesRoutes = Router();

// Attendee operations
attendeesRoutes.post('/register', registerAttendee);
attendeesRoutes.get('/', getAllAttendees);
attendeesRoutes.get('/concert/:concertId', getAttendeesByConcert);

export default attendeesRoutes;