const mongoose = require("mongoose");


//creating book schema
const BookSchema = mongoose.Schema({
    ISBN: String,
    title: String,
    authors: [Number],
    language: String,
    pubDate: String,
    numOfPage: Number,
    category: [String],
    publication: Number,

});



//creatingbook model

const BookModel = mongoose.model("Books", BookSchema);

//exporting
module.exports = BookModel;