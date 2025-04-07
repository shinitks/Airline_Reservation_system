import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Flight from "./Flight.js";
import User from "./User.js";
import Ticket from "./Ticket.js";

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
  ticketId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Ticket,
      key: "id",
    },
  },
  flightId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Flight,
      key: "id",
    },
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: "user_id", // If your User model uses `user_id` as PK
    },
  },
});

// Associations
Booking.belongsTo(Flight, { foreignKey: "flightId" });
Booking.belongsTo(User, { foreignKey: "userId" });
Booking.belongsTo(Ticket, { foreignKey: "ticketId" });

Flight.hasMany(Booking, { foreignKey: "flightId" });
User.hasMany(Booking, { foreignKey: "userId" });
Ticket.hasMany(Booking, { foreignKey: "ticketId" });

export default Booking;
