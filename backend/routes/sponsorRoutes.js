import { Router } from "express";
import {
    createSponsor,
    getSponsors,
    getSponsorById,
    updateSponsor,
    deleteSponsor,
    searchSponsors
} from "../controllers/sponsorController.js";

const sponsorRoutes = Router();

// Sponsor CRUD operations
sponsorRoutes.post('/create', createSponsor);
sponsorRoutes.get('/', getSponsors);
sponsorRoutes.get('/search', searchSponsors);
sponsorRoutes.get('/:id', getSponsorById);
sponsorRoutes.put('/:id', updateSponsor);
sponsorRoutes.delete('/:id', deleteSponsor);

export default sponsorRoutes;
