import Admin from "../Models/Admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerAdmin = async (req, res) => {
    const { email, adminname, password } = req.body;
  
    try {
      // Check if the email already exists
      const existingAdmin = await Admin.findOne({ where: { email } });
  
      if (existingAdmin) {
        return res.status(400).json({ message: "Admin already exists. Please log in." });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new Admin
      const newAdmin = await Admin.create({
        email,
        adminname,
        password: hashedPassword,
      });
  
      res.status(201).json({ message: "Admin registered successfully", AdminId: newAdmin.id });
    } catch (error) {
      console.error("Error registering Admin:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const admin = await Admin.findOne({ where: { email } });
  
      if (!admin) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      const token = jwt.sign(
        { user_id: admin.admin_id, isAdmin: true }, // Assign isAdmin: true
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      res.status(200).json({ message: "Admin login successful", token });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };