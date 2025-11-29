import songModel from "../models/songModel.js";
import concertModel from "../models/concertModel.js";
import { sendErrorResponse, sendSuccessResponse } from "../utils/responses.js";

export const createSong = async (req, res) => {
    try {
        const { title, artist, duration, genre } = req.body;

        if (!title) {
            return sendErrorResponse(res, 400, "Song title is required");
        }

        const newSong = new songModel({
            title,
            artist: artist || null,
            duration: duration || 0,
            genre: genre || 'general',
            playCount: 0
        });

        await newSong.save();
        return sendSuccessResponse(res, 201, "Song created successfully", newSong);
    } catch (error) {
        console.log("Error creating song:", error);
        return sendErrorResponse(res, 500, "Internal Server Error", error.message);
    }
};

export const getSongs = async (req, res) => {
    try {
        const songs = await songModel.find({}).populate('artist');
        return sendSuccessResponse(res, 200, "Songs fetched successfully", songs);
    } catch (error) {
        console.log("Error fetching songs:", error);
        return sendErrorResponse(res, 500, "Server Error", error.message);
    }
};

export const getSongById = async (req, res) => {
    try {
        const { id } = req.params;
        const song = await songModel.findById(id).populate('artist');

        if (!song) {
            return sendErrorResponse(res, 404, "Song not found");
        }

        // Get concerts where this song is played
        const concerts = await concertModel.find({ playlist: id });

        const songData = song.toObject();
        songData.concerts = concerts;

        return sendSuccessResponse(res, 200, "Song retrieved successfully", songData);
    } catch (error) {
        console.log("Error fetching song:", error);
        return sendErrorResponse(res, 500, "Server Error", error.message);
    }
};

export const updateSong = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const song = await songModel.findByIdAndUpdate(id, updates, { new: true }).populate('artist');

        if (!song) {
            return sendErrorResponse(res, 404, "Song not found");
        }

        return sendSuccessResponse(res, 200, "Song updated successfully", song);
    } catch (error) {
        console.log("Error updating song:", error);
        return sendErrorResponse(res, 500, "Internal Server Error", error.message);
    }
};

export const deleteSong = async (req, res) => {
    try {
        const { id } = req.params;

        const song = await songModel.findByIdAndDelete(id);

        if (!song) {
            return sendErrorResponse(res, 404, "Song not found");
        }

        // Remove song references from concerts
        await concertModel.updateMany(
            { playlist: id },
            { $pull: { playlist: id } }
        );

        return sendSuccessResponse(res, 200, "Song deleted successfully");
    } catch (error) {
        console.log("Error deleting song:", error);
        return sendErrorResponse(res, 500, "Internal Server Error", error.message);
    }
};

export const searchSongs = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return sendErrorResponse(res, 400, "Search query is required");
        }

        const songs = await songModel.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { genre: { $regex: query, $options: 'i' } }
            ]
        }).populate('artist');

        return sendSuccessResponse(res, 200, "Search results", songs);
    } catch (error) {
        console.log("Error searching songs:", error);
        return sendErrorResponse(res, 500, "Internal Server Error", error.message);
    }
};

// Legacy function - kept for backward compatibility
export const addNewSong = async (req, res) => {
    try {
        const { name, songUrl } = req.body;
        const newSong = new songModel({
            name,
            songUrl
        });
        await newSong.save();
        return sendSuccessResponse(res, 201, "Song Inserted");
    } catch (error) {
        console.log("Error while inserting song ", error);
        sendErrorResponse(res, 500, "Internal Server Error", error);
    }
};