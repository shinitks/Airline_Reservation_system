import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Flight from "./Flight.js";

const BookedSeat = sequelize.define("BookedSeat", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  flightId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Flight,
      key: "id",
    },
  },
  seatNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Flight.hasMany(BookedSeat, { foreignKey: "flightId" });
BookedSeat.belongsTo(Flight, { foreignKey: "flightId" });

export default BookedSeat;
