const {Book} = require("./models/Book");
const {books, authors} = require("./data");
const connectToDB = require("./config/db");
const { Author } = require("./models/Author");
require("dotenv").config();


//Connection to db
connectToDB();


// Import Books
const importBooks = async()=>{
    try {
        await Book.insertMany(books);
        console.log("Books Imported");
    } catch (error) {
        console.log(error);
        //cut the connection with database if there is error
        process.exit(1);        
    }
}


// Import Author
const importAuthors = async()=>{
    try {
        await Author.insertMany(authors);
        console.log("Authors Imported");
    } catch (error) {
        console.log(error);
        //cut the connection with database if there is error
        process.exit(1);        
    }
}
// Remove Books
const removeBooks = async()=>{
    try {
        await Book.deleteMany();
        console.log("Books Removed!");
    } catch (error) {
        console.log(error);
        //cut the connection with database if there is error
        process.exit(1);        
    }
}


if(process.argv[2] === "-import" ){
    importBooks();
}else if(process.argv[2] === "-remove"){
    removeBooks();
}else if(process.argv[2] === "-import-authors"){
    importAuthors();
}

//Run this file. write this command in terminal:
//node seeder -import / -remove

