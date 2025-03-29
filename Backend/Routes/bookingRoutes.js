import express from "express";
import { authenticate, restrictToUser } from "../config/authmiddleware.js";

import { getCheckoutSession } from "../Controllers/bookingController.js";

const router = express.Router();

router.post("/checkout-session/:flightId", authenticate, getCheckoutSession);
export default router;
