const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./routes/authRoutes");
const linkRoutes = require("./routes/linkRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const dashboardRoutes=require("./routes/dashboardRoutes")
const { seedUser } = require("./controllers/authController");
const { redirectToOriginal } = require("./controllers/linkController");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes); //done working
app.use("/api/shorten", linkRoutes); //done working
app.use("/api/analytics", analyticsRoutes); 
app.use("/api/dashboard", dashboardRoutes);
app.get("/:shortCode", redirectToOriginal);

// Mongo Connection
mongoose.connect(process.env.MONGO_URI)
  .then(async() => {
    console.log("MongoDB connected");
    await seedUser(); //initially will generate the user creadential
    app.listen(process.env.PORT, () => {
      console.log(`Server running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch(err => console.error("MongoDB connection error:", err));
