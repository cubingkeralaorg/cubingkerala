import { Request } from "@/types/request";

export const approveRequest = async (
  request: Request,
): Promise<{ message: string }> => {
  const response = await fetch("/api/approve-requests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to approve request");
  }

  return response.json();
};

export const updateMember = async (
  member: Request,
): Promise<{ message: string }> => {
  const response = await fetch("/api/update-members", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(member),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update member");
  }

  return response.json();
};

export const deleteMember = async (
  wcaid: string,
): Promise<{ message: string }> => {
  const response = await fetch("/api/delete-member", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ wcaid }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete member");
  }

  return response.json();
};

export const deleteRequest = async (
  wcaid: string,
): Promise<{ message: string }> => {
  const response = await fetch("/api/delete-request", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ wcaid }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete request");
  }

  return response.json();
};
