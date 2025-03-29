import { DataTypes } from "sequelize";
import sequelize from "../config/db.js"; // Import your database connection

const Airline = sequelize.define("Airline", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  airlineLogo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  airlineName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Airline;
