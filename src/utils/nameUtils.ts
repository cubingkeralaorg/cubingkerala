/**
 * Extract first name by removing parentheses content
 */
export const extractFirstName = (fullName: string): string => {
  return fullName.split("(")[0];
};

// ===== FILE: hooks/useRequests.ts =====
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Request } from "@/types/request";
import {
  approveRequest,
  updateMember,
  deleteMember,
  deleteRequest,
} from "@/services/requestApi";

export function useRequests(
  initialRequests: Request[],
  initialMembers: Request[],
) {
  const [requestsData, setRequestsData] = useState<Request[]>(initialRequests);
  const [membersData, setMembersData] = useState<Request[]>(initialMembers);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setRequestsData(initialRequests);
    setMembersData(initialMembers);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [initialRequests, initialMembers]);

  const getRoleValue = (elementId: string): string => {
    const selectElement = document.getElementById(
      elementId,
    ) as HTMLSelectElement;
    return selectElement.value;
  };

  const refreshPage = () => {
    setTimeout(() => {
      router.refresh();
    }, 2000);
  };

  const handleApprove = async (index: number) => {
    const updatedRequest = { ...requestsData[index] };
    updatedRequest.role = getRoleValue(`role-${index}`);

    try {
      const data = await approveRequest(updatedRequest);
      toast.success(data.message);
      refreshPage();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to approve request",
      );
    }
  };

  const handleUpdate = async (index: number) => {
    const updatedMember = { ...membersData[index] };
    updatedMember.role = getRoleValue(`role-${index}`);

    try {
      const data = await updateMember(updatedMember);
      toast.success(data.message);
      refreshPage();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update member",
      );
    }
  };

  const handleMemberDelete = async (index: number) => {
    try {
      const data = await deleteMember(membersData[index].wcaid);
      toast.success(data.message);
      refreshPage();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete member",
      );
    }
  };

  const handleRequestDelete = async (index: number) => {
    try {
      const data = await deleteRequest(requestsData[index].wcaid);
      toast.success(data.message);
      refreshPage();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete request",
      );
    }
  };

  return {
    requestsData,
    membersData,
    isLoading,
    handleApprove,
    handleUpdate,
    handleMemberDelete,
    handleRequestDelete,
  };
}
