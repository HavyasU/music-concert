import ticketModel from "../models/ticketModel.js";
import concertModel from "../models/concertModel.js";
import { sendErrorResponse, sendSuccessResponse } from "../utils/responses.js";

export const registerAttendee = async (req, res) => {
    try {
        const { attendeeName, attendeeEmail, attendeePhone, venue, concert, price } = req.body;

        // Validate required fields
        if (!attendeeName || !attendeeEmail || !attendeePhone || !venue || !concert || !price) {
            return sendErrorResponse(res, 400, "Missing required fields");
        }

        const newAttendee = new ticketModel({
            attendeeName,
            attendeeEmail,
            attendeePhone,
            venue,
            concert,
            price,
            ticketDate: new Date()
        });

        await newAttendee.save();

        return sendSuccessResponse(res, 201, "Attendee Registered Successfully", newAttendee);
    } catch (error) {
        console.log("Error while registering attendee ", error);
        return sendErrorResponse(res, 500, "Internal Server Error", error.message);
    }
};

// Get all attendees for a concert
export const getAttendeesByConcert = async (req, res) => {
    try {
        const { concertId } = req.params;

        const attendees = await ticketModel.find({ concert: concertId })
            .populate('concert')
            .populate('venue');

        return sendSuccessResponse(res, 200, "Attendees retrieved successfully", attendees);
    } catch (error) {
        console.log("Error while fetching attendees ", error);
        return sendErrorResponse(res, 500, "Internal Server Error", error.message);
    }
};

// Get all attendees
export const getAllAttendees = async (req, res) => {
    try {
        const attendees = await ticketModel.find()
            .populate('concert')
            .populate('venue');

        return sendSuccessResponse(res, 200, "All attendees retrieved successfully", attendees);
    } catch (error) {
        console.log("Error while fetching attendees ", error);
        return sendErrorResponse(res, 500, "Internal Server Error", error.message);
    }
};
