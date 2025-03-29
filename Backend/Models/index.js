import sequelize from "../config/db.js";
import User from "./User.js";
import Flight from "./Flight.js";
import Booking from "./Booking.js";
import Ticket from "./Ticket.js";

// Define relationships
User.hasMany(Booking, { foreignKey: "userId" });
Booking.belongsTo(User, { foreignKey: "userId" });

Flight.hasMany(Booking, { foreignKey: "flightId" });
Booking.belongsTo(Flight, { foreignKey: "flightId" });

Booking.hasMany(Ticket, { foreignKey: "bookingId" });
Ticket.belongsTo(Booking, { foreignKey: "bookingId" });


export { sequelize, User, Flight, Booking, Ticket };
