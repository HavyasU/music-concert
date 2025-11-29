import { Router } from "express";
import {
    createArtist,
    getArtists,
    getArtistById,
    updateArtist,
    deleteArtist,
    searchArtists
} from "../controllers/artistsController.js";

const artistRoutes = Router();

// Artist CRUD operations
artistRoutes.post('/create', createArtist);
artistRoutes.get('/', getArtists);
artistRoutes.get('/search', searchArtists);
artistRoutes.get('/:id', getArtistById);
artistRoutes.put('/:id', updateArtist);
artistRoutes.delete('/:id', deleteArtist);

export default artistRoutes;
