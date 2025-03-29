import express from "express";
import {
  getTicket,
  getSingleTicketForVerification,
} from "../Controllers/ticketController.js";
import { authenticate, restrictToAdmin } from "../config/authmiddleware.js";

const router = express.Router();

// ✅ Route to get a ticket by UID (Requires authentication)
router.get("/getTicket/:id", authenticate, getTicket);

// ✅ Route to get a single ticket for verification (Requires authentication & role restriction)
router.get(
  "/getSingleFlightForVerification/:id",
  authenticate,
  restrictToAdmin, // Restrict access to admin & staff
  getSingleTicketForVerification
);

export default router;
