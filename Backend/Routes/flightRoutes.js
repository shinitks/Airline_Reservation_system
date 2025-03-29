import express from "express";
import {
  getFlights,
  addAirline,
  addFlight,
  getSingleFlight,
  getAllAirlines,
} from "../Controllers/flightController.js";

import { authenticate, restrictToAdmin, restrictToUser } from "../config/authmiddleware.js";

const router = express.Router();

// Public Routes
router.post("/search", getFlights);
router.get("/getAllAirlines", getAllAirlines);
router.get("/getSingleFlight/:id", authenticate, restrictToUser, getSingleFlight);

// Admin-Only Routes
router.post("/addAirline", authenticate, restrictToAdmin, addAirline);
router.post("/addFlight", authenticate, restrictToAdmin, addFlight);

export default router;
