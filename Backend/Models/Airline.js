import { DataTypes } from "sequelize";
import sequelize from "../config/db.js"; // Import your database connection

const Airline = sequelize.define("Airline", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4, // Automatically generates UUIDs
    primaryKey: true,
  },
  airlineLogo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  airlineName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true, // createdAt and updatedAt will be managed automatically
});

export default Airline;
