import { User, Booking, Ticket } from "../Models/index.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
    const { email, username, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ where: { email } });
  
      //SELECT * FROM Users WHERE email = 'provided_email' LIMIT 1;

      if (existingUser) {
        return res.status(400).json({ message: "User already exists. Please log in." });
      }
  
     
      const hashedPassword = await bcrypt.hash(password, 10);
  
     
      const newUser = await User.create({
        email,
        username,
        password: hashedPassword,
      });

  /*
  INSERT INTO Users (email, username, password)
VALUES ('provided_email', 'provided_username', 'hashed_password');
*/
      res.status(201).json({ message: "User registered successfully", userId: newUser.id });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
   
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }
    
    try {
      const user = await User.findOne({ where: { email } });
      
      //SELECT * FROM Users WHERE email = 'provided_email' LIMIT 1;

      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
    
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
    
      const token = jwt.sign(
        { user_id: user.user_id, email: user.email, isAdmin: false },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
    
      res.status(200).json({ message: "User login successful", token });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  export const getUserDetails = async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
  
      // Fetch the user details along with bookings and tickets
      const user = await User.findByPk(userId, {
        attributes: { exclude: ["password"] },
        include: [
          {
            model: Booking,
            attributes: ["id", "flightId", "seat", "ticketId"], 
            include: [
              {
                model: Ticket,
                attributes: ["id", "uid"], 
              },
            ],
          },
        ],
      });
  /*
  SELECT Users.id, Users.email, Users.username, 
       Bookings.id AS bookingId, Bookings.flightId, Bookings.seat, Bookings.ticketId, 
       Tickets.id AS ticketId, Tickets.uid
FROM Users
LEFT JOIN Bookings ON Users.id = Bookings.userId
LEFT JOIN Tickets ON Bookings.ticketId = Tickets.id
WHERE Users.id = provided_userId;
*/
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Extract ticket IDs from bookings
      const tickets = user.Bookings.map((booking) => ({
        bookingId: booking.id,
        ticketId: booking.ticketId, 
        uid: booking.Ticket ? booking.Ticket.uid : null, 
      })).filter((ticket) => ticket.ticketId); 
  
      res.status(200).json({
        message: "User details fetched successfully",
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        tickets, 
      });
    } catch (error) {
      console.error("Error fetching user details:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  