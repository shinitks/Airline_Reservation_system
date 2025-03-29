import Stripe from "stripe";
import { Booking, User, Flight, Ticket } from "../Models/index.js";

export const getCheckoutSession = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const flight = await Flight.findByPk(req.params.flightId);

    if (!flight) {
      return res.status(404).json({ success: false, message: "Flight not found" });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    console.log("Received req.body:", req.body);

    const { bookingUsersData, selectedSeats } = req.body;
    
    // Generate a unique ticket for this booking
    const bookingUID = generateUID();
    let ticket = await Ticket.create({ uid: bookingUID });

    const bookings = [];
    for (let i = 1; i <= Object.keys(bookingUsersData).length; i++) {
      const userData = bookingUsersData[`passenger${i}`];
      const seat = selectedSeats[i - 1];

      const booking = await Booking.create({
        flightId: flight.id,
        userId: user.user_id,
        ticketId: ticket.id, // ✅ Store the ticketId inside Booking table
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

      bookings.push(booking.id);
    }

    // ✅ Update the Ticket model with bookingId (optional but recommended)
    await ticket.update({ bookingId: bookings[0] });

    flight.bookedSeats = [...flight.bookedSeats, ...selectedSeats];
    await flight.save();

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

// Function to generate a unique Ticket UID
function generateUID() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let uid = "";
  for (let i = 0; i < 10; i++) {
    uid += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return uid;
}
