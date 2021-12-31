const { gql } = require('apollo-server-express');

const typeDefs = gql`
type Book {
  _id: ID
  authors: String
  title: String
  description: String
  bookId: String
  image: String
  link: String
}

type User {
  _id: ID
  username: String
  email: String
  bookCount: Int
  books: [Book]
}

type Auth {
  token: ID!
  user: User
}

type Query {
  me: User
}

input SaveBook {
  authors: String
  description: String
  title: String
  bookId: String
  image: String
  link: String
}

type Mutation {
  login(email: String!, password: String!): Auth
  addUser(username: String!, email: String!, password: String!): Auth
  saveBook(input: SaveBook!): User
  removeBook(bookId: String!): User

}
`;

module.exports = typeDefs;

