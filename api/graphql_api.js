const express = require("express");
const router = express.Router();
const expressGraphQL = require("express-graphql").graphqlHTTP;
const { GraphQLSchema, GraphQLObjectType } = require("graphql");
//Authors database
const {
  getAuthors,
  getAuthorId,
  createAuthor,
  updateAuthorId,
  deleteAuthor,
  // getAuthorBooks,
} = require("../authors/authors-routers");
// Books database for
const {
  getBooks,
  getBookId,
  addBook,
  updateBooks,
  deleteBook,
} = require("../books/books-router");

const { getUsers, getUserById } = require("../users/users-router");

//manipulate Authors, books, and users DB through root query
const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query to get list of authors and books",
  //data coming from authors and books routers
  fields: () => ({
    // <--------- list of authors ----->
    getAuthors,
    getAuthorId,

    // <--------- List of books ------>
    getBooks,
    getBookId,
    // <--------- List of Users ------>
    getUsers,
    getUserById,
  }),
});

const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    // <--------- Mutation for Authors ------>
    createAuthor,
    updateAuthorId,
    deleteAuthor,
    // <--------- Mutations for Books ------->
    addBook,
    updateBooks,
    deleteBook,
  }),
});

const schema = new GraphQLSchema({
  //getting of data
  query: RootQueryType,
  //adding mutations CRUD
  mutation: RootMutationType,
});

router.use("/", expressGraphQL({ schema: schema, graphiql: true }));

module.exports = router;
