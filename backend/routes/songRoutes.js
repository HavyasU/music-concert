import { Router } from "express";
import {
    createSong,
    getSongs,
    getSongById,
    updateSong,
    deleteSong,
    searchSongs
} from "../controllers/songController.js";

const songRoutes = Router();

// Song CRUD operations
songRoutes.post('/create', createSong);
songRoutes.get('/', getSongs);
songRoutes.get('/search', searchSongs);
songRoutes.get('/:id', getSongById);
songRoutes.put('/:id', updateSong);
songRoutes.delete('/:id', deleteSong);

export default songRoutes;
