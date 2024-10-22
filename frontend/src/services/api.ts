import { SigninInterface } from "../interface/ISignin";
import { StudentInterface } from "../interface/IStudent";
import { SigninResponse } from "../interface/Signinrespone";

const apiURL = "http://localhost:3000";
// const apiURL = "https://sut-online-attendance-systemv1.onrender.com";

function getToken() {
  const token = localStorage.getItem("token");
  return token;
}

export async function SignIn(login: SigninInterface): Promise<SigninResponse> {
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
  const response = await fetch(`${apiURL}/api/room/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create room.");
  }

  return response.json();
}

export async function GetAllSubject(tid: string): Promise<any> {
  const response = await fetch(`${apiURL}/api/subject/teacher/${tid}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
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

export async function CheckIn(data: any): Promise<any> {
  const response = await fetch(`${apiURL}/api/checkin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to check in.");
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

export async function GetAttendanceForRoom(roomId: string): Promise<any> {
  const response = await fetch(`${apiURL}/api/checkin/${roomId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get attendance.");
  }

  if (response.status === 204) {
    return [];
  }

  return response.json();
}

export async function GetRoomFromSubject(id: string): Promise<any> {
  const response = await fetch(`${apiURL}/api/subject/room/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get attendance.");
  }
  if (response.status === 204) {
    return [];
  }

  return response.json();
}

// Delete Room
export async function DeleteRoom(id: string): Promise<any> {
  const response = await fetch(`${apiURL}/api/room/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete room.");
  }

  return response.json();
}

export async function GetAttSumBtSid(sid: string): Promise<any> {
  const apiUrl = `${apiURL}/api/attsum/${sid}`;

  try {
    // ส่ง request ไปยัง backend API
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch attendance summary.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching attendance summary:", error);
    return { error: "เกิดข้อผิดพลาดในการดึงข้อมูลสรุปการเช็คชื่อ" };
  }
}

export async function getTotalAttendances(tid: string): Promise<any> {
  try {
    const response = await fetch(`${apiURL}/api/teacher/${tid}/total`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch total attendances.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching total attendances:", error);
    throw error;
  }
}

export async function getSubjectTaught(tid: string): Promise<any> {
  try {
    const response = await fetch(`${apiURL}/api/teacher/${tid}/subjects`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch total attendances.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching total attendances:", error);
    throw error;
  }
}
export async function getAllClasses(tid: string): Promise<any> {
  try {
    const response = await fetch(`${apiURL}/api/teacher/${tid}/class`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch total attendances.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching total attendances:", error);
    throw error;
  }
}
export async function getAverageAttendanceRate(tid: string): Promise<any> {
  try {
    const response = await fetch(`${apiURL}/api/teacher/${tid}/avg`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch total attendances.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching total attendances:", error);
    throw error;
  }
}
