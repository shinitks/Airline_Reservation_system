import dotenv from "dotenv";
import sequelize from "./config/db.js";
import app from "./index.js"; // Import app

dotenv.config();

const PORT = process.env.PORT || 8000;

// Connect to PostgreSQL and start the server
sequelize
  .sync({ alter: true }) // Sync database
  .then(() => {
    console.log("Database connected successfully!");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.error("Database connection failed:", error));
