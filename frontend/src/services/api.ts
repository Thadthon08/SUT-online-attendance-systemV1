import { SigninInterface } from "../interface/ISignin";
import { StudentInterface } from "../interface/IStudent";

// const apiURL = "http://localhost:3000";
const apiURL =
  "https://3d97-2001-fb1-16f-2fbf-98ab-60cd-3369-1a9f.ngrok-free.app";

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

export async function CheckIn(data: any): Promise<any> {
  const response = await fetch(`${apiURL}/api/checkin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to check in.");
  }

  return response.json();
}

export async function StudentRegistration(
  data: StudentInterface
): Promise<any> {
  const response = await fetch(`${apiURL}/line/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",

      Authorization: `Bearer kDYRkASTx6dPQT3kd+LchnC3mktzE449WPJWeZ+SQ0lGBBU99xikCRw0k7xNW6yQwH7g9ce/t26sDIqkPSK5xEh12t4L2qsF9FNFjdIBv6wpbKnSkm2uvoctOkTOmhqWDM2xU3QC1pDbJTsb1/o4tgdB04t89/1O/w1cDnyilFU=`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to register student.");
  }

  return response.json();
}

export async function Verify(lineId: string): Promise<any> {
  const response = await fetch(`${apiURL}/line/verify/${lineId}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to verify student.");
  }

  return response.json();
}
