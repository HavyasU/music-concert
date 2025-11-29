import { Router } from "express";
import {
    getConcertsWithHighAttendance,
    getBandWithMostTicketSales,
    getVenuesWithMultipleConcerts,
    getSoldOutMerchandise,
    getGuestArtistsWithMultipleConcerts,
    getAverageTicketSalesPerVenue,
    getConcertsWithCollaborations,
    getSponsorsWithMultipleConcerts,
    getFansWithMultipleConcertAttendance,
    getMostPopularSong,
    getConcertsWithHighestMerchandiseRevenue,
    getArtistsWithMultipleVenues
} from "../controllers/analyticsController.js";

const analyticsRoutes = Router();

// Q1: Concerts with more than 1000 attendees
analyticsRoutes.get('/q1/high-attendance', getConcertsWithHighAttendance);

// Q2: Band with most ticket sales
analyticsRoutes.get('/q2/top-band-sales', getBandWithMostTicketSales);

// Q3: Venues with more than 5 concerts
analyticsRoutes.get('/q3/top-venues', getVenuesWithMultipleConcerts);

// Q4: Merchandise sold out
analyticsRoutes.get('/q4/sold-out-merchandise', getSoldOutMerchandise);

// Q5: Guest artists in multiple concerts
analyticsRoutes.get('/q5/multiple-concert-artists', getGuestArtistsWithMultipleConcerts);

// Q6: Average ticket sales per venue
analyticsRoutes.get('/q6/avg-ticket-sales-per-venue', getAverageTicketSalesPerVenue);

// Q7: Concerts with collaborations
analyticsRoutes.get('/q7/collaboration-concerts', getConcertsWithCollaborations);

// Q8: Sponsors in multiple concerts
analyticsRoutes.get('/q8/sponsor-coverage', getSponsorsWithMultipleConcerts);

// Q9: Fans attending 3+ concerts
analyticsRoutes.get('/q9/loyal-fans', getFansWithMultipleConcertAttendance);

// Q10: Most popular song
analyticsRoutes.get('/q10/popular-song', getMostPopularSong);

// Q11: Concerts with highest merchandise revenue
analyticsRoutes.get('/q11/top-merchandise-revenue', getConcertsWithHighestMerchandiseRevenue);

// Q12: Artists in multiple venues
analyticsRoutes.get('/q12/multi-venue-artists', getArtistsWithMultipleVenues);

export default analyticsRoutes;
