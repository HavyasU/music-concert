import { Router } from "express";
import {
    createMerchandise,
    getMerchandise,
    getMerchandiseById,
    updateMerchandise,
    deleteMerchandise,
    searchMerchandise
} from "../controllers/merchandiseController.js";

const merchandiseRoutes = Router();

// Merchandise CRUD operations
merchandiseRoutes.post('/create', createMerchandise);
merchandiseRoutes.get('/', getMerchandise);
merchandiseRoutes.get('/search', searchMerchandise);
merchandiseRoutes.get('/:id', getMerchandiseById);
merchandiseRoutes.put('/:id', updateMerchandise);
merchandiseRoutes.delete('/:id', deleteMerchandise);

export default merchandiseRoutes;
