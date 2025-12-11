const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); 
const app = express();

//server static files
app.use("/public", express.static("public"));

// Middleware
app.use(cors());
app.use(express.json());


//routes
const createBountyRoute = require("./routes/CreateBountyRoute");
const issueRoute = require("./routes/IssueRoute");


app.use("/api/bounties", createBountyRoute);
app.use("/api/issues", issueRoute);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Mongoose connected successfully"))
.catch(err => console.error("Mongoose connection error:", err));

// Start server
const PORT = process.env.PORT || 2025;



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
