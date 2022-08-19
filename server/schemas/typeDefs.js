const {gql} = require('apollo-server-express'); // import the gql template function


// create our typeDefs
const typeDefs = gql`
   type Book {
      _Id: ID
      bookId: String
      authors:[Authors]
      description:String
      image:String
      link:String
      title:String!
   }

   type Authors {
      name: String
   }
   
   type User {
      _id: ID
      username: String!
      email: String!
      bookCount: Int
      savedBooks: [Book]

   }

   type Auth {
      token: ID!
      user: User
   }

   input BookInfo{
      authors:[Authors!]! 
      description:String! 
      title:String! 
      bookId: String! 
      image:String! 
      link: String!
   }

   type Query {
      me: User
   }

   type Mutation {
      login(email: String! password: String!): Auth
      addUser(username: String! email:String! password:String!): Auth
      saveBook(content: BookInfo!):User
   }
`;

module.exports = typeDefs;

