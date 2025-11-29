import merchendiseModel from "../models/merchendiseModel.js";
import concertModel from "../models/concertModel.js";
import { sendErrorResponse, sendSuccessResponse } from "../utils/responses.js";

export const createMerchandise = async (req, res) => {
    try {
        const { name, price, stockQuantity, concert } = req.body;

        if (!name || !price || !stockQuantity) {
            return sendErrorResponse(res, 400, "Missing required fields");
        }

        const newMerchandise = new merchendiseModel({
            name,
            price,
            stockQuantity,
            itemsSold: 0,
            isSoldOut: false,
            concert: concert || null
        });

        await newMerchandise.save();
        return sendSuccessResponse(res, 201, "Merchandise created successfully", newMerchandise);
    } catch (error) {
        console.log("Error creating merchandise:", error);
        return sendErrorResponse(res, 500, "Internal Server Error", error.message);
    }
};

export const getMerchandise = async (req, res) => {
    try {
        const merchandise = await merchendiseModel.find({}).populate('concert');
        return sendSuccessResponse(res, 200, "Merchandise fetched successfully", merchandise);
    } catch (error) {
        console.log("Error fetching merchandise:", error);
        return sendErrorResponse(res, 500, "Server Error", error.message);
    }
};

export const getMerchandiseById = async (req, res) => {
    try {
        const { id } = req.params;
        const merchandise = await merchendiseModel.findById(id).populate('concert');

        if (!merchandise) {
            return sendErrorResponse(res, 404, "Merchandise not found");
        }

        return sendSuccessResponse(res, 200, "Merchandise retrieved successfully", merchandise);
    } catch (error) {
        console.log("Error fetching merchandise:", error);
        return sendErrorResponse(res, 500, "Server Error", error.message);
    }
};

export const updateMerchandise = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Check if sold out
        if (updates.stockQuantity !== undefined && updates.stockQuantity <= 0) {
            updates.isSoldOut = true;
        } else if (updates.stockQuantity !== undefined && updates.stockQuantity > 0) {
            updates.isSoldOut = false;
        }

        const merchandise = await merchendiseModel.findByIdAndUpdate(id, updates, { new: true }).populate('concert');

        if (!merchandise) {
            return sendErrorResponse(res, 404, "Merchandise not found");
        }

        return sendSuccessResponse(res, 200, "Merchandise updated successfully", merchandise);
    } catch (error) {
        console.log("Error updating merchandise:", error);
        return sendErrorResponse(res, 500, "Internal Server Error", error.message);
    }
};

export const deleteMerchandise = async (req, res) => {
    try {
        const { id } = req.params;

        const merchandise = await merchendiseModel.findByIdAndDelete(id);

        if (!merchandise) {
            return sendErrorResponse(res, 404, "Merchandise not found");
        }

        return sendSuccessResponse(res, 200, "Merchandise deleted successfully");
    } catch (error) {
        console.log("Error deleting merchandise:", error);
        return sendErrorResponse(res, 500, "Internal Server Error", error.message);
    }
};

export const searchMerchandise = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return sendErrorResponse(res, 400, "Search query is required");
        }

        const merchandise = await merchendiseModel.find({
            $or: [
                { name: { $regex: query, $options: 'i' } }
            ]
        }).populate('concert');

        return sendSuccessResponse(res, 200, "Search results", merchandise);
    } catch (error) {
        console.log("Error searching merchandise:", error);
        return sendErrorResponse(res, 500, "Internal Server Error", error.message);
    }
};
