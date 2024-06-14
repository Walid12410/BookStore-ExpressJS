const express = require("express");
const logger = require("./middlewares/logger");
const {notFound , errorHandler} = require("./middlewares/errors");
require("dotenv").config();
const connectToDB = require("./config/db");



//dotenv.config();


// Connection to database
connectToDB();



// Init App
const app = express();

// Apply Middlewares
app.use(express.json());
app.use(logger);

app.use("/api/books", require("./routes/books"));
app.use("/api/authors",  require("./routes/authors"));
app.use("/api/auth",require("./routes/auth"));
app.use("/api/users", require("./routes/users"));


// Error Handler Middlewares
app.use(notFound);
app.use(errorHandler);

// HTTP Method/Verbs
app.get("/", (req, res) => {
    res.send("Hello, Welcome to Book Store");
});

// Running the Server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
