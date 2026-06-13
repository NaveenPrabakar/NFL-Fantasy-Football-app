const API_BASE_URL = 'http://localhost:8080';

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = LoginPayload & {
  name: string;
};

async function postToAuthEndpoint<TPayload, TResponse>(path: string, payload: TPayload) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.text() as Promise<TResponse>;
}

export async function loginUser(payload: LoginPayload) {
  const result = await postToAuthEndpoint<LoginPayload, string>('/user/login', payload);
  return result.trim().toLowerCase() === 'true';
}

export async function registerUser(payload: RegisterPayload) {
  return postToAuthEndpoint<RegisterPayload, string>('/user/register', payload);
}
