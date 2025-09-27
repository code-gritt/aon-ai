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
    query Me {
      me {
        id
        email
        username
        credits
      }
    }
  `;

  return await client.request(query, {}, { Authorization: `Bearer ${token}` });
};

export const uploadImageMutation = async (file) => {
  const mutation = `
    mutation UploadImage($file: Upload!) {
      uploadImage(file: $file) {
        id
        filename
        url
      }
    }
  `;
  const formData = new FormData();
  formData.append("operations", JSON.stringify({ query: mutation }));
  formData.append("map", JSON.stringify({ 0: ["variables.file"] }));
  formData.append("0", file);
  return await fetch("https://aon-ai-api.onrender.com/graphql", {
    method: "POST",
    body: formData,
  }).then((r) => r.json());
};

export const aiEditMutation = async ({ imageId, action, prompt }) => {
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
  return await client.request(mutation, { input: { imageId, action, prompt } });
};
