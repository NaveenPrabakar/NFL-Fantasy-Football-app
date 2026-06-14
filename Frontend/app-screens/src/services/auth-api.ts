const API_BASE_URL = 'http://localhost:8080';

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = LoginPayload & {
  name: string;
};

export type AuthenticatedUser = {
  name: string;
  email: string;
};

export type UserSession = AuthenticatedUser & {
  password: string;
};

export type UpdateProfilePayload = {
  name: string;
  email: string;
  password: string;
  whatChanged: 'name' | 'password';
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
  const response = await fetch(`${API_BASE_URL}/user/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<AuthenticatedUser>;
}

export async function registerUser(payload: RegisterPayload) {
  return postToAuthEndpoint<RegisterPayload, string>('/user/register', payload);
}

export async function updateUserProfile(payload: UpdateProfilePayload) {
  const response = await fetch(`${API_BASE_URL}/user/update?whatChanged=${payload.whatChanged}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      password: payload.password,
    }),
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.text();
}
