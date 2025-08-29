const AdminModel = require("../Models/admins");

async function AdminAuth(req, res) {
  const { email, password } = req.body;
  
  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({ 
      message: "Email and password are required" 
    });
  }     

  try {
    // Find the admin by email
    const admin = await AdminModel.findOne({ email });
    
    // Check if admin exists
    if (!admin) {
      return res.status(401).json({ 
        message: "The email or password you entered is not correct. Please check again." 
      });
    }
    
    // Compare passwords
    const isPasswordValid = (password === admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: "The email or password you entered is not correct. Please check again." 
      });
    }

    // Authentication successful
    return res.status(200).json({ 
      message: `Welcome again, ${admin.username}!`,
      token: "your-jwt-token-here", // If using JWT
    });
    
  } catch (error) {
    console.error("Admin authentication error:", error);
    return res.status(500).json({ 
      message: "Server error during authentication" 
    });
  }
}

// This function is now properly implemented with bcrypt
// No need for a separate comparePasswords function since we're using bcrypt.compare directly

module.exports = AdminAuth;