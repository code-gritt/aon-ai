import { GraphQLClient } from "graphql-request";

// Base GraphQL client (for queries/mutations without file uploads)
const client = new GraphQLClient("https://aon-ai-api.onrender.com/graphql");

/**
 * Register a new user
 */
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

/**
 * Login existing user
 */
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

/**
 * Fetch current user profile
 */
export const meQuery = async (token) => {
  const query = `
    query Me {
      me {
        id
        email
        username
        credits
      }
    }
  `;

  return await client.request(
    query,
    {},
    {
      Authorization: `Bearer ${token}`,
    }
  );
};

/**
 * Upload an image using multipart/form-data
 */
export const uploadImageMutation = async (file, token) => {
  const mutation = `
    mutation UploadImage($file: Upload!) {
      uploadImage(file: $file) {
        id
        filename
        url
      }
    }
  `;

  const operations = JSON.stringify({
    query: mutation,
    variables: { file: null },
  });

  const map = JSON.stringify({ 0: ["variables.file"] });

  const formData = new FormData();
  formData.append("operations", operations);
  formData.append("map", map);
  formData.append("0", file);

  const response = await fetch("https://aon-ai-api.onrender.com/graphql", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();
  if (result.errors) throw new Error(result.errors[0].message);
  return result.data;
};

/**
 * Perform AI edit on an image
 */
export const aiEditMutation = async ({ imageId, action, prompt }, token) => {
  const mutation = `
    mutation AiEdit($input: AiEditInput!) {
      aiEdit(input: $input) {
        id
        filename
        url
        created_at
      }
    }
  `;

  return await client.request(
    mutation,
    { input: { imageId, action, prompt } },
    { Authorization: `Bearer ${token}` }
  );
};
