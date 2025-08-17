const express = require('express');
const productRouter = require('./Routes/Productroutes');
const Auth = require('./middleware/Auth')
const cors = require('cors');
const app = express();
const port = 3001;

const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/productdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to local MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));


app.use(cors()); // Enable CORS for frontend requests
app.use(express.json()); // Middleware to parse JSON bodies
app.use(Auth)
app.get('/api/greet', (req, res) => {
  res.json('Hello, Postman! This is a GET request.');
});
app.post('/api/greet', (req, res) => {
  res.json({ message: 'Hello, Postman! This is a POST request.' });
});
app.use('/products',productRouter)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
