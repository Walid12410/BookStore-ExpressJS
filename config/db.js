const mongoose = require("mongoose");


   // Connection to database
async function connectToDB() {
   //1st method
    try {
       await mongoose.connect(process.env.MONGO_URI);
       console.log("Connected to MongoDB...");
    } catch (error) {
        console.log("Failed to connect to MongoDB", error);
    }

    //2nd method
    // mongoose
    //     .connect(process.env.MONGO_URI)
    //     .then(() => console.log("Connected to MongoDB..."))
    //     .catch((error) => console.log("Failed to connect to MongoDB", error));

}

module.exports = connectToDB;