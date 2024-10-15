import { SigninInterface } from "../interface/ISignin";

const apiURL = "http://localhost:3000";

export async function SignIn(login: SigninInterface): Promise<any> {
  const response = await fetch(`${apiURL}/api/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(login),
  });

  if (!response.ok) {
    throw new Error("Failed to login.");
  }

  return response.json();
}

export async function CreateRoom(data: any): Promise<any> {
  const response = await fetch(`${apiURL}/api/create/room`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create room.");
  }

  return response.json();
}
