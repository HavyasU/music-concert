import merchandiseModel from "../models/merchendiseModel.js";

export const addMerchendise = async (req, res) => {
    try {
        const { name, price, stockQuantity, isSoldOut, concert } = req.body;
        const newMerchendise = new merchandiseModel({
            name,
            price,
            stockQuantity,
            isSoldOut,
            concert
        });
        await newMerchendise.save();
        return sendSuccessResponse(res, 201, "Merchendise Inserted");
    } catch (error) {
        console.log("Error while inserting merchendise ", error);
        sendErrorResponse(res, 500, "Internal Server Error", error);
    }
};


export const getMerchendise = async (req, res) => {
    try {
        const { concertID } = req.body;
        const fieldToPopulate = ["concert"];
        const merchendises = await merchandiseModel.find({ concert: concertID }).populate(fieldToPopulate);
        return sendSuccessResponse(res, 200, "Merchendise Data Fetched.", { merchendises });
    } catch (error) {
        console.log("Error in getMerchendise Controller : ", error);
        return sendErrorResponse(res, 500, "Server Error", error);
    }
};


export const updateMerchendise = async (req, res) => {
    try {
        const { merchandiseID, stockQuantity, isSoldOut } = req.body;
        const merchandise = await merchandiseModel.findById(merchandiseID);
        if (!merchandise) {
            return sendErrorResponse(res, 404, "Merchendise Not Found");
        }
        merchandise.stockQuantity = stockQuantity;
        merchandise.isSoldOut = isSoldOut;
        await merchandise.save();
        return sendSuccessResponse(res, 200, "Merchendise Updated");
    } catch (error) {
        console.log("Error while updating merchendise ", error);
        sendErrorResponse(res, 500, "Internal Server Error", error);
    }
};