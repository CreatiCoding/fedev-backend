const gql = require("apollo-server-express").gql;

module.exports = {
  query: gql`
    scalar JSON
    scalar DateTime

    type Post {
      post_id: Int
      title: String
      user_id: Int
      contents: String
      created_at: DateTime
      updated_at: DateTime
    }

    type Query {
      getList(type: String!): [JSON]
      getOne(type: String!, id: ID!): JSON
      createOne(type: String!, id: ID!, payload: String): JSON
      updateOne(type: String!, id: ID!, payload: String): JSON

      getPostList(page_no: Int!): [Post]
      getPost(post_id: Int): Post
    }
  `,
};
