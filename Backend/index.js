import express from "express";
import cors from "cors";
import userRoutes from "./Routes/userRoutes.js";
import adminRoutes from "./Routes/adminRoutes.js"
import flightRoutes from"./Routes/flightRoutes.js"
import bookingRoutes from "./Routes/bookingRoutes.js"
import ticketRoutes from "./Routes/ticketRoutes.js"

const app = express();
const corsOptions = {
    origin: (origin, callback) => {
      if (!origin) {
        // Allow requests with no origin (like mobile apps, curl, Postman)
        return callback(null, true);
      }
      return callback(null, true); // Allow all origins
    },
    credentials: true, // Allow cookies and authentication headers
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  };
  
  // Apply CORS Middleware
  app.use(cors(corsOptions));
// Middleware
app.use(express.json()); // To parse JSON data

// Routes
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/tickets", ticketRoutes);






export default app; // Export app for server.js
