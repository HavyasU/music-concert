import { sendErrorResponse, sendSuccessResponse } from "../utils/responses";


//Register Attendee
export const registerAttendee = (req, res) => {
    try {
        const { name, email, phone } = req.body;

        if (!name || !email || !phone) {
            return sendErrorResponse(res, null, "All fields are required");
        }

    } catch (error) {

    }
};