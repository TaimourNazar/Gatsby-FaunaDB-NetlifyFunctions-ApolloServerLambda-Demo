//https://github.com/apollographql/apollo-server/issues/1989

const { ApolloServer, gql } = require("apollo-server-lambda");
const faunadb = require('faunadb'),
  q = faunadb.query;
require('dotenv').config();

const typeDefs = gql`
  type Query {
    message: String
  }
`;

const resolvers = {
  Query: {
    message: async (parent, args, context) => {
      try {
        var client = new faunadb.Client({ secret: process.env.FAUNA_DB_SECRET });
        let result = await client.query(
          q.Get(q.Ref(q.Collection('messages'), '279721332940210695'))
        );
        
        return result.data.detail;
      } catch (err) {
        return err.toString();
      }
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true
});

exports.handler = server.createHandler();