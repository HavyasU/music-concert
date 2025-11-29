import { Router } from "express";
import {
    createVenue,
    getVenues,
    getVenueById,
    updateVenue,
    deleteVenue,
    searchVenues
} from "../controllers/venueController.js";

const venueRoutes = Router();

// Venue CRUD operations
venueRoutes.post('/create', createVenue);
venueRoutes.get('/', getVenues);
venueRoutes.get('/search', searchVenues);
venueRoutes.get('/:id', getVenueById);
venueRoutes.put('/:id', updateVenue);
venueRoutes.delete('/:id', deleteVenue);

export default venueRoutes;
