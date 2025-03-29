import { DataTypes } from "sequelize";
import sequelize from "../config/db.js"; // Ensure this points to your database connection
import Flight from "./Flight.js";
import User from "./User.js";
import Ticket from "./Ticket.js"; // Import Ticket model

const Booking = sequelize.define("Booking", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  seat: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dob: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  passportNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  passportSizePhoto: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ticketId: {  // ADD THIS FIELD
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Ticket,
      key: "id",
    },
  },
});

// Define relationships
Booking.belongsTo(Flight, { foreignKey: "flightId" });
Booking.belongsTo(User, { foreignKey: "userId" });
Booking.belongsTo(Ticket, { foreignKey: "ticketId" }); // Ensure Booking is linked to Ticket

export default Booking;
