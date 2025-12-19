const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport= require('passport');
require('dotenv').config(); 
const app = express();

require("./config/passport");

//server static files
app.use("/public", express.static("public"));

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());



//routes
const createBountyRoute = require("./routes/CreateBountyRoute");
const issueRoute = require("./routes/IssueRoute");
const closeBountyRoute = require("./routes/closeBountyRoute");
const newsletter = require("./routes/NewsletterRoute");
const authRoute = require("./routes/UserRoute");


app.use("/api/bounties", createBountyRoute);
app.use("/api/issues", issueRoute);
app.use("/api/close", closeBountyRoute);
app.use("/api/newsletter", newsletter);
app.use("/auth" , authRoute);


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
