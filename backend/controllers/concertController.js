import concertModel from "../models/concertModel.js";
import ticketModel from "../models/ticketModel.js";
import collaborationsModel from "../models/collabModel.js";
import { sendErrorResponse, sendSuccessResponse } from "../utils/responses.js";

export const createConcert = async (req, res) => {
    try {
        const { name, venue, concertDate, concertTime, description, artists, sponsors, playlist, ticketPrice, capacity } = req.body;

        if (!name || !venue || !concertDate || !concertTime || !ticketPrice || !capacity) {
            return sendErrorResponse(res, 400, "Missing required fields");
        }

        const newConcert = new concertModel({
            name,
            venue,
            concertDate,
            concertTime,
            description,
            artists: artists || [],
            sponsors: sponsors || [],
            playlist: playlist || [],
            ticketPrice,
            capacity
        });

        await newConcert.save();
        await newConcert.populate(['artists', 'sponsors', 'playlist', 'venue']);

        // If multiple artists, create collaboration record
        if (artists && artists.length > 1) {
            const collaboration = new collaborationsModel({
                artists,
                concertId: newConcert._id
            });
            await collaboration.save();
        }

        return sendSuccessResponse(res, 201, "Concert created successfully", newConcert);
    } catch (error) {
        console.log("Error creating concert:", error);
        return sendErrorResponse(res, 500, "Internal Server Error", error.message);
    }
};

export const getConcerts = async (req, res) => {
    try {
        const concerts = await concertModel.find().populate(['artists', 'sponsors', 'playlist', 'venue']);
        return sendSuccessResponse(res, 200, "Concert Data Fetched.", concerts);
    } catch (error) {
        console.log("Error in getConcert Controller : ", error);
        return sendErrorResponse(res, 500, "Server Error", error.message);
    }
};

export const getAttendeesWithMoreThan = async (req, res) => {
    const { attendeesCount } = req.body;
    try {
        const attendees = await ticketModel.aggregate([
            {
                $group: {
                    _id: "$concert",
                    totalAttendees: { $sum: 1 }
                }
            },
            {
                $match: {
                    totalAttendees: { $gte: Number(attendeesCount) }
                }
            },
            {
                $lookup: {
                    from: "concerts",
                    localField: "_id",
                    foreignField: "_id",
                    as: "concertDetails"
                }
            }
        ]);

        return sendSuccessResponse(res, 200, "Attendees Data Fetched.", attendees);
    } catch (error) {

        console.log("Error in getConcert Controller : ", error);
        return sendErrorResponse(res, 500, "Server Error", error.message);
    }
};

export const getConcertById = async (req, res) => {
    try {
        const { id } = req.params;
        const concert = await concertModel.findById(id).populate(['artists', 'sponsors', 'playlist', 'venue']);

        if (!concert) {
            return sendErrorResponse(res, 404, "Concert not found");
        }

        // Get attendee count
        const attendeeCount = await ticketModel.countDocuments({ concert: id });
        const concertData = concert.toObject();
        concertData.attendeeCount = attendeeCount;

        return sendSuccessResponse(res, 200, "Concert Data Fetched.", concertData);
    } catch (error) {
        console.log("Error in getConcertById Controller : ", error);
        return sendErrorResponse(res, 500, "Server Error", error.message);
    }
};

export const getConcertCollaborations = async (req, res) => {
    try {
        const { concertId } = req.params;

        const concert = await concertModel.findById(concertId)
            .populate({
                path: 'artists',
                select: 'name type genres bio'
            });

        if (!concert) {
            return sendErrorResponse(res, 404, "Concert not found");
        }

        if (concert.artists.length < 2) {
            return sendSuccessResponse(res, 200, "No collaborations in this concert", []);
        }

        const collaboration = await collaborationsModel.findOne({ concertId })
            .populate('artists', 'name type genres bio');

        return sendSuccessResponse(res, 200, "Collaborations retrieved successfully", {
            concert: concert.name,
            artists: concert.artists,
            collaboration: collaboration || { artists: concert.artists }
        });
    } catch (error) {
        console.log("Error fetching collaborations:", error);
        return sendErrorResponse(res, 500, "Internal Server Error", error.message);
    }
};

export const updateConcert = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const concert = await concertModel.findByIdAndUpdate(id, updates, { new: true })
            .populate(['artists', 'sponsors', 'playlist', 'venue']);

        if (!concert) {
            return sendErrorResponse(res, 404, "Concert not found");
        }

        return sendSuccessResponse(res, 200, "Concert updated successfully", concert);
    } catch (error) {
        console.log("Error updating concert:", error);
        return sendErrorResponse(res, 500, "Internal Server Error", error.message);
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


export const deleteConcert = async (req, res) => {
    try {
        const { id } = req.params;

        const concertDeleted = await concertModel.findByIdAndDelete(id);
        if (!concertDeleted) {
            return sendErrorResponse(res, 404, "Concert Not Found");
        }

        // Delete related collaborations
        await collaborationsModel.deleteMany({ concertId: id });

        return sendSuccessResponse(res, 200, "Concert Deleted");
    } catch (error) {
        console.log("Error while Deleting Concert ", error);
        return sendErrorResponse(res, 500, "Internal Server Error", error.message);
    }
};

export const searchConcerts = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return sendErrorResponse(res, 400, "Search query is required");
        }

        const concerts = await concertModel.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        }).populate(['artists', 'sponsors', 'playlist', 'venue']);

        return sendSuccessResponse(res, 200, "Search results", concerts);
    } catch (error) {
        console.log("Error searching concerts:", error);
        return sendErrorResponse(res, 500, "Internal Server Error", error.message);
    }
};