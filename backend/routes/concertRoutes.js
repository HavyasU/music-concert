import { Router } from "express";
import {
    createConcert,
    getConcerts,
    getConcertById,
    getConcertCollaborations,
    updateConcert,
    deleteConcert,
    searchConcerts,
    addConcertArtist,
    addConcertSponsors,
    addConcertSongs,
    getAttendeesWithMoreThan
} from "../controllers/concertController.js";

const concertRoutes = Router();

// Concert CRUD operations
concertRoutes.post('/create', createConcert);
concertRoutes.get('/', getConcerts);
concertRoutes.get('/search', searchConcerts);
concertRoutes.get('/:id', getConcertById);
concertRoutes.put('/:id', updateConcert);
concertRoutes.delete('/:id', deleteConcert);

// Concert collaborations
concertRoutes.get('/:concertId/collaborations', getConcertCollaborations);

// Add details to concerts
concertRoutes.post('/add-artist', addConcertArtist);
concertRoutes.post('/add-sponsor', addConcertSponsors);
concertRoutes.post('/add-song', addConcertSongs);

// Analytics
concertRoutes.post('/attendees-more-than', getAttendeesWithMoreThan);

export default concertRoutes;
