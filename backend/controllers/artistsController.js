import artistsModel from "../models/artistsModel.js";
import concertModel from "../models/concertModel.js";
import { sendErrorResponse, sendSuccessResponse } from "../utils/responses.js";

export const createArtist = async (req, res) => {
    try {
        const { name, type, genres, bio } = req.body;

        if (!name) {
            return sendErrorResponse(res, 400, "Artist name is required");
        }

        const newArtist = new artistsModel({
            name,
            type: type || 'solo',
            genres: genres || [],
            bio
        });

        await newArtist.save();
        return sendSuccessResponse(res, 201, "Artist created successfully", newArtist);
    } catch (error) {
        console.log("Error creating artist:", error);
        return sendErrorResponse(res, 500, "Internal Server Error", error.message);
    }
};

export const getArtists = async (req, res) => {
    try {
        const artists = await artistsModel.find({});
        return sendSuccessResponse(res, 200, "Artists fetched successfully", artists);
    } catch (error) {
        console.log("Error fetching artists:", error);
        return sendErrorResponse(res, 500, "Server Error", error.message);
    }
};

export const getArtistById = async (req, res) => {
    try {
        const { id } = req.params;
        const artist = await artistsModel.findById(id);

        if (!artist) {
            return sendErrorResponse(res, 404, "Artist not found");
        }

        // Get concerts where this artist performed
        const concerts = await concertModel.find({ artists: id })
            .populate('venue')
            .populate('artists');

        const artistData = artist.toObject();
        artistData.concerts = concerts;

        return sendSuccessResponse(res, 200, "Artist retrieved successfully", artistData);
    } catch (error) {
        console.log("Error fetching artist:", error);
        return sendErrorResponse(res, 500, "Server Error", error.message);
    }
};

export const updateArtist = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const artist = await artistsModel.findByIdAndUpdate(id, updates, { new: true });

        if (!artist) {
            return sendErrorResponse(res, 404, "Artist not found");
        }

        return sendSuccessResponse(res, 200, "Artist updated successfully", artist);
    } catch (error) {
        console.log("Error updating artist:", error);
        return sendErrorResponse(res, 500, "Internal Server Error", error.message);
    }
};

export const deleteArtist = async (req, res) => {
    try {
        const { id } = req.params;

        const artist = await artistsModel.findByIdAndDelete(id);

        if (!artist) {
            return sendErrorResponse(res, 404, "Artist not found");
        }

        // Remove artist from all concerts
        await concertModel.updateMany(
            { artists: id },
            { $pull: { artists: id } }
        );

        return sendSuccessResponse(res, 200, "Artist deleted successfully");
    } catch (error) {
        console.log("Error deleting artist:", error);
        return sendErrorResponse(res, 500, "Internal Server Error", error.message);
    }
};

export const searchArtists = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return sendErrorResponse(res, 400, "Search query is required");
        }

        const artists = await artistsModel.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { genres: { $regex: query, $options: 'i' } },
                { bio: { $regex: query, $options: 'i' } }
            ]
        });

        return sendSuccessResponse(res, 200, "Search results", artists);
    } catch (error) {
        console.log("Error searching artists:", error);
        return sendErrorResponse(res, 500, "Internal Server Error", error.message);
    }
};