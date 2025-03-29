import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Flight from "./Flight.js";

const Ticket = sequelize.define("Ticket", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  uid: {
    type: DataTypes.STRING,
    allowNull: false,
  },
 
});

// Define relationships
Ticket.belongsToMany(Flight, { through: "TicketFlights" });
Flight.belongsToMany(Ticket, { through: "TicketFlights" });


export default Ticket;
