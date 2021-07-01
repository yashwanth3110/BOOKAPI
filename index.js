require("dotenv").config();


// Frame work
const express = require("express");



const mongoose = require("mongoose");

// Database
const database = require("./database/index");

//models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

// Initializing express
const shapeAI = express();


mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true

    }).then(() => console.log("connection established!!!!!"));



// Configurations
shapeAI.use(express.json());

/*
Route           /
Description     get all books
Access          PUBLIC
Parameters      NONE
Method          GET
*/
shapeAI.get("/", async(req, res) => {
    const getAllBoooks = await BookModel.find();
    return res.json(getAllBoooks);
});

/*
Route           /is
Description     get specific book based on ISBN
Access          PUBLIC
Parameters      isbn
Method          GET
*/
shapeAI.get("/is/:isbn", async(req, res) => {

    const getSpecificBook = await BookModel.findOne({ ISBN: req.params.isbn })

    if (!getSpecificBook) {
        return res.json({
            error: `No book found for the ISBN of ${req.params.isbn}`,
        });
    }

    return res.json({ book: getSpecificBook });
});

/*
Route           /c
Description     get specific books based on a category
Access          PUBLIC
Parameters      category
Method          GET
*/
shapeAI.get("/c/:category", async(req, res) => {
    const getSpecificBooks = await BookModel.findOne({

        category: req.params.category,
    });
    // const getSpecificBooks = database.books.filter((book) =>
    //     book.category.includes(req.params.category)
    // );

    if (!getSpecificBooks) {
        return res.json({
            error: `No book found for the category of ${req.params.category}`,
        });
    }

    return res.json({ books: getSpecificBooks });
});

/*
Route           /book/author
Description     get list of books based on an author
Access          PUBLIC
Parameters      id
Method          get
*/
shapeAI.get("/book/author/:id", async(req, res) => {
    const getSpecificBooks = await BookModel.find({
        authors: req.params.id,
    });
    if (!getSpecificBooks) {
        return res.json({
            error: `No book found for the author id ${req.params.id}`,
        });
    }
    return res.json({ books: getSpecificBooks });
})




/*
Route           /author
Description     get all authors
Access          PUBLIC
Parameters      NONE
Method          GET
*/
shapeAI.get("/author", async(req, res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json({ authors: getAllAuthors });
});


/*
Route           /author
Description     get specific author based on a book's ISBN
Access          PUBLIC
Parameters      isbn
Method          GET
*/
shapeAI.get("/author/:isbn", async(req, res) => {
    const getSpecificAuthor = await AuthorModel.findOne({
        books: req.params.isbn
    })

    // const getSpecificAuthor = database.authors.filter((author) =>
    // author.books.includes(req.params.isbn)
    //);

    if (!getSpecificAuthor) {
        return res.json({
            error: `No author found for the book ${req.params.isbn}`,
        });
    }

    return res.json({ authors: getSpecificAuthor });
});


/*
Route           /authors/book
Description     get a list of authors based on a book's ISBN
Access          PUBLIC
Parameters      isbn
Method          GET
*/
shapeAI.get("/authors/book/:isbn", async(req, res) => {
    const getAuthors = await AuthorModel.find({
        books: req.params.isbn
    })

    if (!getAuthors) {
        return res.json({
            error: `No authors found for the book ${req.params.isbn}`,
        });
    }

    return res.json({ authors: getAuthors });
});

/*
Route           /publications
Description     get all publications
Access          PUBLIC
Parameters      NONE
Method          GET
*/
shapeAI.get("/publications", async(req, res) => {
    const getAllPublications = await PublicationModel.find();
    return res.json({ Publications: getAllPublications });
});

/*
Route           /publications
Description     get specific publication
Access          PUBLIC
Parameters      id
Method          GET
*/
shapeAI.get("/publications/:id", async(req, res) => {
    const specificPublication = await PublicationModel.find({
        id: req.params.id
    });
    if (!specificPublication) {
        return res.json({
            error: `No publication found
            for the id ${req.params.id}`
        });
    }
    return res.json({ publication: specificPublication });
});

/*
Route           /publications/book
Description     get specific publication
Access          PUBLIC
Parameters      isbn
Method          GET
*/
shapeAI.get("/publications/book/:isbn", async(req, res) => {
    const getPublications = await PublicationModel.find({
        books: req.params.isbn
    });
    if (!getPublications) {
        return res.json({
            error: `No publication found for the book's isbn ${req.params.isbn} `
        });
    }
    return res.json({
        publication: getPublications
    });
});

/*
Route           /book/new
Description     add new books
Access          PUBLIC
Parameters      NONE
Method          POST
*/
shapeAI.post("/book/new", async(req, res) => {
    const { newBook } = req.body;
    const addNewBook = BookModel.create(newBook);

    return res.json({ books: addNewBook, message: "book was added!" });
});

/*
Route           /author/new
Description     add new author
Access          PUBLIC
Parameters      NONE
Method          POST
*/
shapeAI.post("/author/new", (req, res) => {
    const { newAuthor } = req.body;
    AuthorModel.create(newAuthor)
    return res.json({ message: "author was added!" });
});

/*
Route           /publication/new
Description     add new publication
Access          PUBLIC
Parameters      NONE
Method          POST
*/
shapeAI.post("/publication/new", (req, res) => {
    const { newPublication } = req.body;
    PublicationModel.create(newPublication)
    return res.json({ message: "Publication was added!" });
});



/*
Route           /book/update
Description     update title of a book
Access          PUBLIC
Parameters      isbn
Method          PUT
*/
shapeAI.put("/book/update/:isbn", (req, res) => {
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            book.title = req.body.bookTitle;
            return;
        }
    });

    return res.json({ books: database.books });
});

/*
Route           /book/author/update
Description     update/add new author
Access          PUBLIC
Parameters      isbn
Method          PUT
*/
shapeAI.put("/book/author/update/:isbn", (req, res) => {
    // update the book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn)
            return book.authors.push(req.body.newAuthor);
    });

    // update the author database
    database.authors.forEach((author) => {
        if (author.id === req.body.newAuthor)
            return author.books.push(req.params.isbn);
    });

    return res.json({
        books: database.books,
        authors: database.authors,
        message: "New author was added",
    });
});




/*
Route           /author/update/name
Description     update name of an author
Access          PUBLIC
Parameters      none
Method          PUT
*/

shapeAI.put("/author/update/name/:name", (req, res) => {
    database.authors.forEach((author) => {
        if (author.name === req.params.name) {
            author.name = req.body.authorName;
            return;
        }
    });

    return res.json({ authors: database.authors });
});


/*
Route           /publication/update/book
Description     update new to a publication
Access          PUBLIC
Parameters      isbn
Method          PUT
*/

shapeAI.put("/publication/update/book/:isbn", (req, res) => {
    //Update the publication database
    database.publications.forEach((publication) => {
        if (publication.id === req.body.pubId) {
            return publication.books.push(req.params.isbn);
        }
    });

    //update the book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            book.publication = req.params.pubId;
            return;
        }
    });
    return res.json({
        books: database.books,
        publications: database.publications,
        message: "Successfully publications are updated",

    });

});

/*
Route           /book/delete
Description     delete a book
Access          PUBLIC
Parameters      isbn
Method          DELETE
*/

shapeAI.delete("/book/delete/:isbn", (req, res) => {
    const updatedBookDatabase = database.books.filter(
        (book) => book.ISBN !== req.params.isbn
    );

    database.books = updatedBookDatabase
    return res.json({ books: database.books });
});

/*
Route           /book/author/delete
Description     delete an author from a book
Access          PUBLIC
Parameters      isbn,authorId
Method          DELETE
*/

shapeAI.delete("/book/author/delete/:isbn/:authorId", (req, res) => {
    //update the book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            const newAuthorList = book.authors.filter(
                (author) => author !== parseInt(req.params.authorId)
            );
            books.authors = newAuthorList;
            return;
        };
    });

    //update the author database
    database.authors.forEach((author) => {
        if (author.id === parseInt(req.params.authorId)) {
            const newBookList = author.books.filter(
                (book) => book !== req.params.isbn
            );
            author.books = newBookList;
            return;
        }
    });
    return res.json({
        books: database.authors,
        authors: database.authors,
        message: "author was deleted"

    });
});


/*
Route           /authors/delete
Description     delete an author from authors
Access          PUBLIC
Parameters      authorId
Method          DELETE
*/

shapeAI.delete("/authors/delete/:authorId", (req, res) => {
    const updatedAuthorDatabase = database.authors.filter(
        (author) => author.id !== parseInt(req.params.authorId)
    );
    database.authors = updatedAuthorDatabase;
    return res.json({
        authors: database.authors,
        message: "author was deleted"
    })
});


/*
Route           /publications/delete/book
Description     delete a book from publication
Access          PUBLIC
Parameters      isbn,publicationId
Method          DELETE
*/

shapeAI.delete("/publications/delete/book/:isbn/:publicationId", (req, res) => {
    //update publication database
    database.publications.forEach((publication) => {
        if (publication.id === parseInt(req.params.publicationId)) {
            const newBookList = publication.books.filter(
                (book) => book != req.params.isbn
            );
            publication.books = newBookList;
            return;
        }
    });
    //update book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            book.publication = 0;
        }
    });
    return res.json({
        books: database.books,
        publications: database.publications,
        message: "a book in the publication is deleted"
    })
});





/*
Route           /publications/delete
Description     delete a publication from publications
Access          PUBLIC
Parameters      publicationId
Method          DELETE
*/

shapeAI.delete("/publications/delete/:publicationId", (req, res) => {
    const updatedPublicationDatabase = database.publications.filter(
        (publication) => publication.id !== parseInt(req.params.publicationId)
    );
    database.publications = updatedPublicationDatabase;
    return res.json({
        publications: database.publications,
        message: "A publication was deleted"
    });
});







shapeAI.listen(3000, () => console.log("Server running!!"));