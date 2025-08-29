
const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
});

// ✅ Export it properly

const AdminModel = mongoose.model("Admin", AdminSchema,'Admins');
module.exports = AdminModel;


