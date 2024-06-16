const express = require("express");
const logger = require("./middlewares/logger");
const {notFound , errorHandler} = require("./middlewares/errors");
require("dotenv").config();
const connectToDB = require("./config/db");
const path = require("path");

//dotenv.config();

// Connection to database
connectToDB();

// Init App
const app = express();


// Static Folder (for image get)
app.use(express.static(path.join(__dirname,"images")));


// Apply Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(logger);


app.set('view engine', 'ejs');

//Route
app.use("/api/books",require("./routes/books"));
app.use("/api/authors",require("./routes/authors"));
app.use("/api/auth",require("./routes/auth"));
app.use("/api/users",require("./routes/users"));
app.use("/password",require("./routes/password"));
app.use("/api/upload", require("./routes/upload"));

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
