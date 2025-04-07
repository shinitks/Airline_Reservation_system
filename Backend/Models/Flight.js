import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Airline from "./Airline.js"; // Import the Airline model

const Flight = sequelize.define("Flight", {
  id: {
    type: DataTypes.UUID, // Or DataTypes.INTEGER if using auto-increment
    defaultValue: DataTypes.UUIDV4, // Generates a UUID automatically
    allowNull: false,
    primaryKey: true,
  },
  from: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  to: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  departTime: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  arriveTime: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  departDate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  arriveDate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // bookedSeats: {
  //   type: DataTypes.ARRAY(DataTypes.STRING),
  //   defaultValue: [],
  // },
});

// **Define the association**
Flight.belongsTo(Airline, { foreignKey: "airlineId" });
Airline.hasMany(Flight, { foreignKey: "airlineId" });

export default Flight;
