import concertModel from "../models/concertModel";
import { sendErrorResponse, sendSuccessResponse } from "../utils/responses";

export const createConcert = async (req, res) => {
    try {
        const { name, venueID, concertDate, concertTime } = req.body;

        const newConcert = new concertModel({
            name,
            venue: venueID,
            concertDate,
            concertTime
        });

        await newConcert.save();
        return sendSuccessResponse(res, 201, "New Concert Created");
    } catch (error) {
        console.log(error);
        return sendErrorResponse(res, 200, "Server Error", error);
    }
};

export const getConcerts = async (req, res) => {
    try {
        const fieldToPopulate = ["artists", "sponsors", "playlist", "venues"];
        const concerts = await concertModel.find({}).populate(fieldToPopulate);
        return sendSuccessResponse(res, 200, "Concert Data Fetched.", { concerts });
    } catch (error) {
        console.log("Error in getConcert Controller : ", error);
        return sendErrorResponse(res, 500, "Server Error", error);
    }
};


export const addConcertSongs = async (req, res) => {
    try {
        const { concertID, songID } = req.body;

        const existingConcert = await concertModel.findById(concertID);
        if (!existingConcert) {
            return sendErrorResponse(res, 404, "Concert Not Found");
        }

        existingConcert.playlist.push(songID);

        await existingConcert.save();
        return sendSuccessResponse(res, 200, "Song Added to concert Playlist.");

    } catch (error) {
        console.log(error);
        return sendErrorResponse(res, 500, "Internal Server Error", error);
    }
};

export const addConcertSponsors = async (req, res) => {
    try {
        const { concertID, sponsorID } = req.body;

        const existingConcert = await concertModel.findById(concertID);
        if (!existingConcert) {
            return sendErrorResponse(res, 404, "Concert Not Found");
        }

        existingConcert.sponsors.push(sponsorID);

        await existingConcert.save();
        return sendSuccessResponse(res, 200, "Sponsor Added to concert.");

    } catch (error) {
        console.log(error);
        return sendErrorResponse(res, 500, "Internal Server Error", error);
    }
};



export const addConcertArtist = async (req, res) => {
    try {
        const { concertID, artistID } = req.body;

        const existingConcert = await concertModel.findById(concertID);
        if (!existingConcert) {
            return sendErrorResponse(res, 404, "Concert Not Found");
        }

        existingConcert.artists.push(artistID);

        await existingConcert.save();
        return sendSuccessResponse(res, 200, "Artist Added to concert.");

    } catch (error) {
        console.log("Error Adding Artist", error);
        return sendErrorResponse(res, 500, "Internal Server Error", error);
    }
};



