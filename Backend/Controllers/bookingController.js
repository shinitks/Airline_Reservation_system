import Stripe from "stripe";
import { Booking, User, Flight, Ticket, BookedSeat } from "../Models/index.js";

export const getCheckoutSession = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    //SELECT * FROM Users WHERE id = provided_userId LIMIT 1;

    const flight = await Flight.findByPk(req.params.flightId);

    //SELECT * FROM Flights WHERE id = provided_flightId LIMIT 1;


    if (!flight) {
      return res.status(404).json({ success: false, message: "Flight not found" });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { bookingUsersData, selectedSeats } = req.body;

    const bookingUID = generateUID();
    let ticket = await Ticket.create({ uid: bookingUID });

    //INSERT INTO Tickets (uid) VALUES ('generated_uid');

    const bookings = [];

    for (let i = 1; i <= Object.keys(bookingUsersData).length; i++) {
      const userData = bookingUsersData[`passenger${i}`];
      const seat = selectedSeats[i - 1];

      // Create the booking record
      const booking = await Booking.create({
        flightId: flight.id,
        userId: user.user_id,
        ticketId: ticket.id,
        seat,
        fName: userData.firstName,
        lName: userData.lastName,
        dob: userData.dob,
        passportNumber: userData.passportNumber,
        state: userData.state,
        phoneNumber: userData.phoneNumber,
        email: userData.email,
        passportSizePhoto: userData.passportSizePhoto,
      });
/*
INSERT INTO Bookings (flightId, userId, ticketId, seat, fName,
lName, dob, passportNumber, state, phoneNumber, email,
passportSizePhoto)
VALUES (provided_flightId, provided_userId, provided_ticketId,
'provided_seat', 'provided_fName', 'provided_lName',
'provided_dob', 'provided_passportNumber',
'provided_state', 'provided_phoneNumber', 'provided_email',
'provided_passportSizePhoto');
*/
      // Insert into BookedSeat table
      await BookedSeat.create({
        flightId: flight.id,
        seatNumber: seat,
      });

      bookings.push(booking.id);
    }

    /*
    INSERT INTO "BookedSeat" ("flightId", "seatNumber")
VALUES ('<flight-id-uuid>', '<seat-number>')
RETURNING id;
*/

    await ticket.update({ bookingId: bookings[0] });

    // No need to update flight.bookedSeats anymore

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.CLIENT_SITE_URL}checkout-page`,
      cancel_url: `${process.env.CLIENT_SITE_URL}`,
      customer_email: user.email,
      client_reference_id: req.params.flightId,
      line_items: [
        {
          price_data: {
            currency: "inr",
            unit_amount: flight.price * 100,
            product_data: {
              name: `${flight.airlineName} - ${flight.from} to ${flight.to}`,
              description: `Departure: ${flight.departDate} ${flight.departTime}, Arrival: ${flight.arriveDate} ${flight.arriveTime}`,
            },
          },
          quantity: bookings.length,
        },
      ],
    });

    res.status(200).json({ success: true, message: "Stripe checkout session created", session });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

function generateUID() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let uid = "";
  for (let i = 0; i < 10; i++) {
    uid += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return uid;
}
