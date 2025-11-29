import venueModel from "../models/venueModel.js";
import concertModel from "../models/concertModel.js";
import { sendErrorResponse, sendSuccessResponse } from "../utils/responses.js";

export const createVenue = async (req, res) => {
    try {
        const { name, address, capacity } = req.body;

        if (!name || !address || !capacity) {
            return sendErrorResponse(res, 400, "Missing required fields");
        }

        const newVenue = new venueModel({
            name,
            address,
            capacity
        });

        await newVenue.save();
        return sendSuccessResponse(res, 201, "Venue created successfully", newVenue);
    } catch (error) {
        console.log("Error creating venue:", error);
        return sendErrorResponse(res, 500, "Internal Server Error", error.message);
    }
};

export const getVenues = async (req, res) => {
    try {
        const venues = await venueModel.find({});
        return sendSuccessResponse(res, 200, "Venues fetched successfully", venues);
    } catch (error) {
        console.log("Error fetching venues:", error);
        return sendErrorResponse(res, 500, "Server Error", error.message);
    }
};

export const getVenueById = async (req, res) => {
    try {
        const { id } = req.params;
        const venue = await venueModel.findById(id);

        if (!venue) {
            return sendErrorResponse(res, 404, "Venue not found");
        }

        // Get concerts at this venue
        const concerts = await concertModel.find({ venue: id });

        const venueData = venue.toObject();
        venueData.concerts = concerts;

        return sendSuccessResponse(res, 200, "Venue retrieved successfully", venueData);
    } catch (error) {
        console.log("Error fetching venue:", error);
        return sendErrorResponse(res, 500, "Server Error", error.message);
    }
};




export const updateVenue = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const venue = await venueModel.findByIdAndUpdate(id, updates, { new: true });

        if (!venue) {
            return sendErrorResponse(res, 404, "Venue not found");
        }

        return sendSuccessResponse(res, 200, "Venue updated successfully", venue);
    } catch (error) {
        console.log("Error updating venue:", error);
        return sendErrorResponse(res, 500, "Internal Server Error", error.message);
    }
};

export const deleteVenue = async (req, res) => {
    try {
        const { id } = req.params;

        const venue = await venueModel.findByIdAndDelete(id);

        if (!venue) {
            return sendErrorResponse(res, 404, "Venue not found");
        }

        // Remove venue references from concerts
        await concertModel.updateMany(
            { venue: id },
            { $unset: { venue: 1 } }
        );

        return sendSuccessResponse(res, 200, "Venue deleted successfully");
    } catch (error) {
        console.log("Error deleting venue:", error);
        return sendErrorResponse(res, 500, "Internal Server Error", error.message);
    }
};

export const searchVenues = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return sendErrorResponse(res, 400, "Search query is required");
        }

        const venues = await venueModel.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { address: { $regex: query, $options: 'i' } }
            ]
        });

        return sendSuccessResponse(res, 200, "Search results", venues);
    } catch (error) {
        console.log("Error searching venues:", error);
        return sendErrorResponse(res, 500, "Internal Server Error", error.message);
    }
};

export const venuesWithMoreThan = (req, res) => {
    try {
        const { limit } = req.body;
        const venues = venueModel.find({}).limit(limit);
        return sendSuccessResponse(res, 200, "Concert Data Fetched.", { venues });
    } catch (error) {
        console.log("Error in getConcert Controller : ", error);
        return sendErrorResponse(res, 500, "Server Error", error);
    }
};