import jwt from "jsonwebtoken";
import User from "../Models/User.js";
import Admin from "../Models/Admin.js"; // Import Admin model

export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract Bearer token

  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    let user = await User.findByPk(decoded.user_id);
    if (user) {
      req.user = {
        id: user.user_id,
        email: user.email,
        username: user.username,
        role: "user",
      };
      console.log("Authenticated User:", req.user);
      return next();
    }

    let admin = await Admin.findByPk(decoded.user_id);
    if (admin) {
      req.user = {
        id: admin.id,
        email: admin.email,
        username: admin.username,
        role: "admin",
      };
      console.log("Authenticated Admin:", req.user);
      return next();
    }

    return res.status(404).json({ message: "User or Admin not found" });
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

// ✅ Restrict Access to Admins Only (Checks Admin Table Only)
export const restrictToAdmin = async (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access Denied. Admins only." });
  }
  next();
};

// ✅ Restrict Access to Users Only (Checks User Table Only)
export const restrictToUser = async (req, res, next) => {
  if (!req.user || req.user.role !== "user") {
    return res.status(403).json({ message: "Access Denied. Users only." });
  }
  next();
};
