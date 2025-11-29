import concertModel from "../models/concertModel.js";
import artistsModel from "../models/artistsModel.js";
import venueModel from "../models/venueModel.js";
import merchandiseModel from "../models/merchendiseModel.js";
import ticketModel from "../models/ticketModel.js";
import sponsorsModel from "../models/sponsorsModel.js";
import songModel from "../models/songModel.js";
import collaborationsModel from "../models/collabModel.js";

// Q1: List concerts with more than 1000 attendees
export const getConcertsWithHighAttendance = async (req, res) => {
    try {
        const concerts = await concertModel.aggregate([
            {
                $lookup: {
                    from: 'tickets',
                    localField: '_id',
                    foreignField: 'concert',
                    as: 'attendees'
                }
            },
            {
                $match: {
                    'attendees.1': { $exists: true } // Has more than 1000 documents would need size check
                }
            },
            {
                $addFields: {
                    attendeeCount: { $size: '$attendees' }
                }
            },
            {
                $match: {
                    attendeeCount: { $gt: 1000 }
                }
            },
            {
                $lookup: {
                    from: 'venues',
                    localField: 'venue',
                    foreignField: '_id',
                    as: 'venueDetails'
                }
            },
            {
                $project: {
                    name: 1,
                    concertDate: 1,
                    concertTime: 1,
                    attendeeCount: 1,
                    venueDetails: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: concerts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Q2: Find the band with the most ticket sales overall
export const getBandWithMostTicketSales = async (req, res) => {
    try {
        const result = await concertModel.aggregate([
            {
                $lookup: {
                    from: 'tickets',
                    localField: '_id',
                    foreignField: 'concert',
                    as: 'tickets'
                }
            },
            {
                $unwind: '$artists'
            },
            {
                $lookup: {
                    from: 'artists',
                    localField: 'artists',
                    foreignField: '_id',
                    as: 'artistDetails'
                }
            },
            {
                $group: {
                    _id: '$artists',
                    artistName: { $first: { $arrayElemAt: ['$artistDetails.name', 0] } },
                    totalTicketsSold: {
                        $sum: { $size: '$tickets' }
                    },
                    totalRevenue: {
                        $sum: { $sum: '$tickets.price' }
                    }
                }
            },
            {
                $sort: { totalTicketsSold: -1 }
            },
            {
                $limit: 1
            }
        ]);

        res.status(200).json({
            success: true,
            data: result[0] || null
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Q3: Retrieve venues that hosted more than 5 concerts
export const getVenuesWithMultipleConcerts = async (req, res) => {
    try {
        const venues = await venueModel.aggregate([
            {
                $lookup: {
                    from: 'concerts',
                    localField: '_id',
                    foreignField: 'venue',
                    as: 'concerts'
                }
            },
            {
                $addFields: {
                    concertCount: { $size: '$concerts' }
                }
            },
            {
                $match: {
                    concertCount: { $gt: 5 }
                }
            },
            {
                $project: {
                    name: 1,
                    capacity: 1,
                    address: 1,
                    concertCount: 1,
                    concerts: {
                        $map: {
                            input: '$concerts',
                            as: 'concert',
                            in: {
                                _id: '$$concert._id',
                                name: '$$concert.name',
                                date: '$$concert.concertDate'
                            }
                        }
                    }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: venues
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Q4: Show merchandise items that sold out
export const getSoldOutMerchandise = async (req, res) => {
    try {
        const merchandise = await merchandiseModel.aggregate([
            {
                $match: {
                    isSoldOut: true
                }
            },
            {
                $lookup: {
                    from: 'concerts',
                    localField: 'concert',
                    foreignField: '_id',
                    as: 'concertDetails'
                }
            },
            {
                $project: {
                    name: 1,
                    price: 1,
                    stockQuantity: 1,
                    itemsSold: 1,
                    concertDetails: {
                        $arrayElemAt: ['$concertDetails', 0]
                    }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: merchandise
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Q5: Identify guest artists who performed in multiple concerts
export const getGuestArtistsWithMultipleConcerts = async (req, res) => {
    try {
        const artists = await concertModel.aggregate([
            {
                $unwind: '$artists'
            },
            {
                $group: {
                    _id: '$artists',
                    concertCount: { $sum: 1 },
                    concerts: { $push: '$name' }
                }
            },
            {
                $match: {
                    concertCount: { $gt: 1 }
                }
            },
            {
                $lookup: {
                    from: 'artists',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'artistDetails'
                }
            },
            {
                $project: {
                    artistName: { $arrayElemAt: ['$artistDetails.name', 0] },
                    concertCount: 1,
                    concerts: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: artists
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Q6: Calculate average ticket sales per venue
export const getAverageTicketSalesPerVenue = async (req, res) => {
    try {
        const venues = await venueModel.aggregate([
            {
                $lookup: {
                    from: 'concerts',
                    localField: '_id',
                    foreignField: 'venue',
                    as: 'concerts'
                }
            },
            {
                $unwind: {
                    path: '$concerts',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'tickets',
                    localField: 'concerts._id',
                    foreignField: 'concert',
                    as: 'tickets'
                }
            },
            {
                $group: {
                    _id: '$_id',
                    venueName: { $first: '$name' },
                    totalConcerts: { $sum: 1 },
                    totalTickets: { $sum: { $size: '$tickets' } },
                    totalRevenue: { $sum: { $sum: '$tickets.price' } }
                }
            },
            {
                $addFields: {
                    averageTicketsPerConcert: {
                        $cond: [
                            { $eq: ['$totalConcerts', 0] },
                            0,
                            { $divide: ['$totalTickets', '$totalConcerts'] }
                        ]
                    },
                    averageRevenuePerConcert: {
                        $cond: [
                            { $eq: ['$totalConcerts', 0] },
                            0,
                            { $divide: ['$totalRevenue', '$totalConcerts'] }
                        ]
                    }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: venues
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Q7: Find concerts where collaborations between two or more artists happened
export const getConcertsWithCollaborations = async (req, res) => {
    try {
        const collaborations = await concertModel.aggregate([
            {
                $addFields: {
                    artistCount: { $size: '$artists' }
                }
            },
            {
                $match: {
                    artistCount: { $gte: 2 }
                }
            },
            {
                $lookup: {
                    from: 'artists',
                    localField: 'artists',
                    foreignField: '_id',
                    as: 'artistDetails'
                }
            },
            {
                $lookup: {
                    from: 'venues',
                    localField: 'venue',
                    foreignField: '_id',
                    as: 'venueDetails'
                }
            },
            {
                $project: {
                    name: 1,
                    concertDate: 1,
                    concertTime: 1,
                    artistCount: 1,
                    artistDetails: {
                        $map: {
                            input: '$artistDetails',
                            as: 'artist',
                            in: {
                                _id: '$$artist._id',
                                name: '$$artist.name',
                                type: '$$artist.type'
                            }
                        }
                    },
                    venueDetails: { $arrayElemAt: ['$venueDetails', 0] }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: collaborations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Q8: Show sponsors who supported more than 3 concerts
export const getSponsorsWithMultipleConcerts = async (req, res) => {
    try {
        const sponsors = await sponsorsModel.aggregate([
            {
                $lookup: {
                    from: 'concerts',
                    localField: '_id',
                    foreignField: 'sponsors',
                    as: 'concerts'
                }
            },
            {
                $addFields: {
                    concertCount: { $size: '$concerts' }
                }
            },
            {
                $match: {
                    concertCount: { $gt: 3 }
                }
            },
            {
                $project: {
                    name: 1,
                    category: 1,
                    website: 1,
                    concertCount: 1,
                    concerts: {
                        $map: {
                            input: '$concerts',
                            as: 'concert',
                            in: {
                                _id: '$$concert._id',
                                name: '$$concert.name',
                                date: '$$concert.concertDate'
                            }
                        }
                    }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: sponsors
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Q9: Retrieve fans who attended at least 3 concerts
export const getFansWithMultipleConcertAttendance = async (req, res) => {
    try {
        const fans = await ticketModel.aggregate([
            {
                $group: {
                    _id: '$attendeeEmail',
                    attendeeName: { $first: '$attendeeName' },
                    attendeePhone: { $first: '$attendeePhone' },
                    concertCount: { $sum: 1 },
                    concerts: { $push: '$concert' },
                    totalSpent: { $sum: '$price' }
                }
            },
            {
                $match: {
                    concertCount: { $gte: 3 }
                }
            },
            {
                $lookup: {
                    from: 'concerts',
                    localField: 'concerts',
                    foreignField: '_id',
                    as: 'concertDetails'
                }
            },
            {
                $sort: { concertCount: -1 }
            }
        ]);

        res.status(200).json({
            success: true,
            data: fans
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Q10: Find the most popular song played across all concerts
export const getMostPopularSong = async (req, res) => {
    try {
        const song = await concertModel.aggregate([
            {
                $unwind: '$playlist'
            },
            {
                $group: {
                    _id: '$playlist',
                    concertCount: { $sum: 1 }
                }
            },
            {
                $sort: { concertCount: -1 }
            },
            {
                $limit: 1
            },
            {
                $lookup: {
                    from: 'songs',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'songDetails'
                }
            },
            {
                $project: {
                    songName: { $arrayElemAt: ['$songDetails.name', 0] },
                    concertCount: 1,
                    songDetails: { $arrayElemAt: ['$songDetails', 0] }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: song[0] || null
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Q11: List concerts with the highest merchandise revenue
export const getConcertsWithHighestMerchandiseRevenue = async (req, res) => {
    try {
        const concerts = await merchandiseModel.aggregate([
            {
                $addFields: {
                    revenue: { $multiply: ['$itemsSold', '$price'] }
                }
            },
            {
                $group: {
                    _id: '$concert',
                    totalMerchandiseRevenue: { $sum: '$revenue' },
                    merchandiseItems: { $push: '$$ROOT' }
                }
            },
            {
                $lookup: {
                    from: 'concerts',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'concertDetails'
                }
            },
            {
                $sort: { totalMerchandiseRevenue: -1 }
            },
            {
                $project: {
                    concertName: { $arrayElemAt: ['$concertDetails.name', 0] },
                    concertDate: { $arrayElemAt: ['$concertDetails.concertDate', 0] },
                    totalMerchandiseRevenue: 1,
                    merchandiseItems: {
                        $map: {
                            input: '$merchandiseItems',
                            as: 'item',
                            in: {
                                name: '$$item.name',
                                price: '$$item.price',
                                itemsSold: '$$item.itemsSold'
                            }
                        }
                    }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: concerts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Q12: Identify artists who performed in multiple venues
export const getArtistsWithMultipleVenues = async (req, res) => {
    try {
        const artists = await concertModel.aggregate([
            {
                $unwind: '$artists'
            },
            {
                $group: {
                    _id: '$artists',
                    venues: { $addToSet: '$venue' },
                    concerts: { $push: '$name' },
                    venueCount: { $addToSet: '$venue' }
                }
            },
            {
                $addFields: {
                    uniqueVenueCount: { $size: '$venueCount' }
                }
            },
            {
                $match: {
                    uniqueVenueCount: { $gt: 1 }
                }
            },
            {
                $lookup: {
                    from: 'artists',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'artistDetails'
                }
            },
            {
                $lookup: {
                    from: 'venues',
                    localField: 'venues',
                    foreignField: '_id',
                    as: 'venueDetails'
                }
            },
            {
                $project: {
                    artistName: { $arrayElemAt: ['$artistDetails.name', 0] },
                    uniqueVenueCount: 1,
                    venues: {
                        $map: {
                            input: '$venueDetails',
                            as: 'venue',
                            in: {
                                _id: '$$venue._id',
                                name: '$$venue.name'
                            }
                        }
                    },
                    concerts: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: artists
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
