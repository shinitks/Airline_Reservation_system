import Flight from "../Models/Flight.js";
import Airline from "../Models/Airline.js";
import { Sequelize } from "sequelize";

export const getFlights = async (req, res) => {
  const { from, to, departDate } = req.body;

  try {
    const flights = await Flight.findAll({
      where: { from, to, departDate },
      include: {
        model: Airline,
        attributes: ["airlineLogo", "airlineName"], 
      },
    });
/*
SELECT Flights.*, Airlines.airlineLogo, Airlines.airlineName
FROM Flights
JOIN Airlines ON Flights.airlineId = Airlines.id
WHERE Flights.from = 'provided_from'
AND Flights.to = 'provided_to'
AND Flights.departDate = 'provided_departDate';
*/
    if (flights.length === 0) {
      return res.status(404).json({ status: false, message: "No flights found" });
    }

  
    const flightsWithAirlineInfo = flights.map((flight) => ({
      ...flight.toJSON(),
      airlineLogo: flight.Airline.airlineLogo,
    }));

    res.status(200).json(flightsWithAirlineInfo);
  } catch (error) {
    console.error("Error fetching flights:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const addAirline = async (req, res) => {
  const { airlineLogo, airlineName } = req.body;

  try {
    const existingAirline = await Airline.findOne({ where: { airlineName } });

//SELECT * FROM Airlines WHERE airlineName = 'provided_airlineName' LIMIT 1;

    if (existingAirline) {
      return res.status(400).json({ message: "Airline already exists" });
    }

    await Airline.create({ airlineLogo, airlineName });

    res.status(201).json({ message: "Airline added successfully" });
  } catch (error) {
    console.error("Error adding airline:", error);
    res.status(500).json({ message: "Internal server error" });
  }
  /*
  INSERT INTO Airlines (airlineLogo, airlineName)
VALUES ('provided_airlineLogo', 'provided_airlineName');
*/
};


export const addFlight = async (req, res) => {
  const { from, to, departDate, arriveDate, departTime, arriveTime, airlineUid, price } = req.body;

  try {
    const airline = await Airline.findByPk(airlineUid);
    if (!airline) {
      return res.status(404).json({ message: "Airline not found" });
    }

//SELECT * FROM Airlines WHERE id = provided_airlineUid LIMIT 1;

    
    const newFlight = await Flight.create({
      airlineId: airline.id, // Use foreign key airlineId
      from,
      to,
      departDate,
      arriveDate,
      departTime,
      arriveTime,
      price,
    });

    res.status(201).json({ message: "Flight added successfully", flightId: newFlight.id });
  } catch (error) {
    console.error("Error adding flight:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
/*
INSERT INTO Flights (airlineId, `from`, `to`, departDate, arriveDate, departTime, arriveTime, price)
VALUES (provided_airlineId, 'provided_from', 'provided_to', 'provided_departDate', 'provided_arriveDate', 
        'provided_departTime', 'provided_arriveTime', provided_price);
*/


export const getSingleFlight = async (req, res) => {
  const { id } = req.params;

  try {
    const flight = await Flight.findByPk(id, {
      include: {
        model: Airline,
        attributes: ["airlineLogo", "airlineName"], 
      },
    });
/*
SELECT Flights.*, Airlines.airlineLogo, Airlines.airlineName
FROM Flights
JOIN Airlines ON Flights.airlineId = Airlines.id
WHERE Flights.id = provided_id;
*/
    if (!flight) {
      return res.status(404).json({ status: false, message: "Flight not found" });
    }

    const flightWithAirlineInfo = {
      ...flight.toJSON(),
      airlineLogo: flight.Airline.airlineLogo,
    };

    res.status(200).json(flightWithAirlineInfo);
  } catch (error) {
    console.error("Error fetching flight:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all airlines
export const getAllAirlines = async (req, res) => {
  try {
    const airlines = await Airline.findAll();
    res.status(200).json(airlines);
  } catch (error) {
    console.error("Error fetching airlines:", error);
    res.status(500).json({ message: "Internal server error" });
  }
  
  //SELECT * FROM Airlines;

};
