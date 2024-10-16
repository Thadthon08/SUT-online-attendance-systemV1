import { SigninInterface } from "../interface/ISignin";

// const apiURL = "http://localhost:3000";
const apiURL =
  "https://36ed-2001-fb1-16f-2fbf-98ab-60cd-3369-1a9f.ngrok-free.app";

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

export async function GetAllSubject(): Promise<any> {
  const response = await fetch(`${apiURL}/api/subject`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to get all subjects.");
  }

  return response.json();
}

export async function GetStudentIDByLineId(lineId: string): Promise<any> {
  const response = await fetch(`${apiURL}/api/student/${lineId}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to get student ID.");
  }

  return response.json();
}

export async function UpdateProfileUrl(sid: string, data: any): Promise<any> {
  const response = await fetch(`${apiURL}/api/student/${sid}/profile-pic`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update profile.");
  }

  return response.json();
}
