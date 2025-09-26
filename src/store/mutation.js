import { GraphQLClient } from "graphql-request";

const client = new GraphQLClient("https://aon-ai-api.onrender.com/graphql");

export const registerMutation = async ({ email, password, username }) => {
  const mutation = `
    mutation Register($input: RegisterInput!) {
      register(input: $input) {
        token
        user { id, email, username, credits }
      }
    }
  `;
  return await client.request(mutation, {
    input: { email, password, username },
  });
};

export const loginMutation = async ({ email, password }) => {
  const mutation = `
    mutation Login($input: LoginInput!) {
      login(input: $input) {
        token
        user { id, email, username, credits }
      }
    }
  `;
  return await client.request(mutation, { input: { email, password } });
};

export const meQuery = async (token) => {
  const query = `
    query Me($token: String!) {
      me(token: $token) {
        id
        email
        username
        credits
      }
    }
  `;
  return await client.request(
    query,
    { token },
    { Authorization: `Bearer ${token}` }
  );
};
