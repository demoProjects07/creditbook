const API_URL =
  `${process.env.NEXT_PUBLIC_API_URL}/api/auth`;

export async function login(data: {
  email: string;
  password: string;
}) {
  const response = await fetch(
    `${API_URL}/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Invalid email or password");
  }

  return response.json();
}

export async function register(data: {
  name: string;
  email: string;
  password: string;
}) {
  const response = await fetch(
    `${API_URL}/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Registration failed");
  }

  return response.json();
}