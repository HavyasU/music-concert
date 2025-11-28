import songModel from "../models/songModel.js";
import { sendErrorResponse, sendSuccessResponse } from "../utils/responses.js";

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



export const deleteSong = async (req, res) => {
    try {
        const { songID } = req.body;

        const songDeleted = await songModel.findByIdAndDelete(songID);
        if (!songDeleted) {
            return sendErrorResponse(res, 404, "Song Not Found", error);
        }
        return sendSuccessResponse(res, 200, "Song Deleted");
    } catch (error) {
        console.log("Error while Deleting song ", error);
        return sendErrorResponse(res, 500, "Internal Server Error", error);
    }
};