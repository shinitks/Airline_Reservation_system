import Ticket from "../Models/Ticket.js";
import Flight from "../Models/Flight.js";
import Booking from "../Models/Booking.js";
import Airline from "../Models/Airline.js";
import { Op } from "sequelize"; // Import Sequelize operators

export const getTicket = async (req, res) => {
  const { id } = req.params; // Extract ID from request URL

  console.log("🔍 Request Params:", req.params); // Debugging

  if (!id) {
    console.log("❌ Missing Ticket ID in request.");
    return res.status(400).json({ success: false, message: "Ticket ID is required" });
  }

  try {
   
    const ticket = await Ticket.findByPk(id, { include: Flight });

    /*
    SELECT Tickets.*, Flights.*
FROM Tickets
LEFT JOIN Flights ON Tickets.flightId = Flights.id
WHERE Tickets.id = provided_id;
*/

    if (!ticket) {
      console.log("❌ Ticket not found in database.");
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    console.log("✅ Ticket found:", ticket.toJSON());

  
    const bookings = await Booking.findAll({ where: { ticketId: ticket.id } });

//SELECT * FROM Bookings WHERE ticketId = provided_ticketId;

    const flightsData = {};

    for (const booking of bookings) {
      const flight = await Flight.findByPk(booking.flightId, { include: Airline });

      if (!flight) continue;

      flightsData[flight.id] = {
        ...flight.toJSON(),
        airlineLogo: flight.Airline ? flight.Airline.airlineLogo : null,
        airlineName: flight.Airline ? flight.Airline.airlineName : null,
        bookings: [],
      };

      flightsData[flight.id].bookings.push(booking.toJSON());
    }

    res.status(200).json(Object.values(flightsData));
  } catch (error) {
    console.error("🚨 Error fetching ticket:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



export const getSingleTicketForVerification = async (req, res) => {
  const { id } = req.params;

  console.log("🔍 Request Params for Verification:", req.params); // Debugging

  if (!id) {
    console.log("❌ Missing Ticket ID for verification.");
    return res.status(400).json({ success: false, message: "Ticket ID is required" });
  }

  try {
    const booking = await Booking.findByPk(id);

    //SELECT * FROM Bookings WHERE id = provided_id LIMIT 1;

    if (!booking) {
      console.log("❌ Booking not found.");
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    const flight = await Flight.findByPk(booking.flightId, { include: Airline });

    /*
    SELECT Flights.*, Airlines.airlineLogo, Airlines.airlineName
FROM Flights
JOIN Airlines ON Flights.airlineId = Airlines.id
WHERE Flights.id = provided_flightId;
*/

    if (!flight) {
      console.log("❌ Flight not found.");
      return res.status(404).json({ success: false, message: "Flight not found" });
    }

    res.status(200).json({
      ...flight.toJSON(),
      airlineLogo: flight.Airline ? flight.Airline.airlineLogo : null,
      airlineName: flight.Airline ? flight.Airline.airlineName : null,
      bookings: [booking.toJSON()],
    });
  } catch (error) {
    console.error("🚨 Error verifying ticket:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
