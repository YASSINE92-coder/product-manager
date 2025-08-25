const express = require('express');
const productRouter = require('./Routes/Productroutes');
const cors = require('cors');
const app = express();
const port = 3001;

const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/Product", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to local MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err ,'products'));

//app.use(cors());  Enable CORS for frontend requests
app.use(cors({
  origin: "http://localhost:3000", // React port
  methods: ["GET","POST","PUT","DELETE"],
  allowedHeaders: ["Content-Type", "authorization"]
}));

app.use(express.json()); // Middleware to parse JSON bodies

app.use('/products',productRouter)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
