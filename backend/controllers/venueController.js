import venueModel from "../models/venueModel.js";
import { sendErrorResponse } from "../utils/responses";

export const createVenue = async (req, res) => {
    try {
        const { name, city, state, pin_code } = req.body;
        const newVenue = new venueModel({
            name,
            Address: {
                city,
                state,
                pin_code
            }
        });

        await newVenue.save();

        return sendSuccessResponse(res, 201, "Venue Created");
    } catch (error) {
        console.log("Error Creating Venue! : ", error);
        return sendErrorResponse(res, 500, "Internal Server Error", error);
    }
};

export const getVenues = async (req, res) => {
    try {
        const fieldToPopulate = ["artists", "sponsors", "playlist", "venues"];
        const concerts = await venueModel.find({}).populate(fieldToPopulate);
        return sendSuccessResponse(res, 200, "Concert Data Fetched.", { concerts });
    } catch (error) {
        console.log("Error in getConcert Controller : ", error);
        return sendErrorResponse(res, 500, "Server Error", error);
    }
};


export const getVenueById = async (req, res) => {
    try {
        const { venueID } = req.body;
        const fieldToPopulate = ["artists", "sponsors", "playlist", "venues"];
        const concert = await venueModel.find(venueID).populate(fieldToPopulate);
        return sendSuccessResponse(res, 200, "Concert Data Fetched.", { concert });
    } catch (error) {
        console.log("Error in getConcertById Controller : ", error);
        return sendErrorResponse(res, 500, "Server Error", error);
    }
};







export const deleteVenue = async (req, res) => {
    try {
        const { venueID } = req.body;

        const venueDeleted = await venueModel.findByIdAndDelete(venueID);
        if (!venueDeleted) {
            return sendErrorResponse(res, 404, "Song Not Found", error);
        }
        return sendSuccessResponse(res, 200, "Song Deleted");
    } catch (error) {
        console.log("Error while Deleting song ", error);
        return sendErrorResponse(res, 500, "Internal Server Error", error);
    }
};