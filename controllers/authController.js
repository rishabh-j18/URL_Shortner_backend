const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(200).json({ token, email: user.email });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Seed a hardcoded user
const seedUser = async () => {
  const email = "intern@dacoid.com";
  const password = "Test123";
  const existing = await User.findOne({ email });
  if (!existing) {
    const hashed = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashed });
    console.log("Hardcoded user created.");
  }
};

module.exports = { loginUser, seedUser };
