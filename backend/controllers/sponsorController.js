import sponsorsModel from "../models/sponsorsModel.js";
import concertModel from "../models/concertModel.js";
import { sendErrorResponse, sendSuccessResponse } from "../utils/responses.js";

export const createSponsor = async (req, res) => {
    try {
        const { name, category, website, logo } = req.body;

        if (!name) {
            return sendErrorResponse(res, 400, "Sponsor name is required");
        }

        const newSponsor = new sponsorsModel({
            name,
            category: category || 'general',
            website,
            logo
        });

        await newSponsor.save();
        return sendSuccessResponse(res, 201, "Sponsor created successfully", newSponsor);
    } catch (error) {
        console.log("Error creating sponsor:", error);
        return sendErrorResponse(res, 500, "Internal Server Error", error.message);
    }
};

export const getSponsors = async (req, res) => {
    try {
        const sponsors = await sponsorsModel.find({});
        return sendSuccessResponse(res, 200, "Sponsors fetched successfully", sponsors);
    } catch (error) {
        console.log("Error fetching sponsors:", error);
        return sendErrorResponse(res, 500, "Server Error", error.message);
    }
};

export const getSponsorById = async (req, res) => {
    try {
        const { id } = req.params;
        const sponsor = await sponsorsModel.findById(id);

        if (!sponsor) {
            return sendErrorResponse(res, 404, "Sponsor not found");
        }

        // Get concerts sponsored by this sponsor
        const concerts = await concertModel.find({ sponsors: id });

        const sponsorData = sponsor.toObject();
        sponsorData.concerts = concerts;

        return sendSuccessResponse(res, 200, "Sponsor retrieved successfully", sponsorData);
    } catch (error) {
        console.log("Error fetching sponsor:", error);
        return sendErrorResponse(res, 500, "Server Error", error.message);
    }
};

export const updateSponsor = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const sponsor = await sponsorsModel.findByIdAndUpdate(id, updates, { new: true });

        if (!sponsor) {
            return sendErrorResponse(res, 404, "Sponsor not found");
        }

        return sendSuccessResponse(res, 200, "Sponsor updated successfully", sponsor);
    } catch (error) {
        console.log("Error updating sponsor:", error);
        return sendErrorResponse(res, 500, "Internal Server Error", error.message);
    }
};

export const deleteSponsor = async (req, res) => {
    try {
        const { id } = req.params;

        const sponsor = await sponsorsModel.findByIdAndDelete(id);

        if (!sponsor) {
            return sendErrorResponse(res, 404, "Sponsor not found");
        }

        // Remove sponsor references from concerts
        await concertModel.updateMany(
            { sponsors: id },
            { $pull: { sponsors: id } }
        );

        return sendSuccessResponse(res, 200, "Sponsor deleted successfully");
    } catch (error) {
        console.log("Error deleting sponsor:", error);
        return sendErrorResponse(res, 500, "Internal Server Error", error.message);
    }
};

export const searchSponsors = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return sendErrorResponse(res, 400, "Search query is required");
        }

        const sponsors = await sponsorsModel.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } }
            ]
        });

        return sendSuccessResponse(res, 200, "Search results", sponsors);
    } catch (error) {
        console.log("Error searching sponsors:", error);
        return sendErrorResponse(res, 500, "Internal Server Error", error.message);
    }
};
