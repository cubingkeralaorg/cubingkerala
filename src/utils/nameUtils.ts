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
import { Request } from "@/types/request.types";
import {
  approveRequest,
  updateMember,
  deleteMember,
  deleteRequest,
} from "@/services/request.api";

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

  const handleApprove = async (wcaid: string) => {
    const request = requestsData.find((r) => r.wcaid === wcaid);
    if (!request) return;

    const updatedRequest = { ...request };
    updatedRequest.role = getRoleValue(`role-${wcaid}`);

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

  const handleUpdate = async (wcaid: string) => {
    const member = membersData.find((m) => m.wcaid === wcaid);
    if (!member) return;

    const updatedMember = { ...member };
    updatedMember.role = getRoleValue(`role-${wcaid}`);

    try {
      await updateMember(updatedMember);
      toast.success("Member updated successfully");
      refreshPage();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update member",
      );
    }
  };

  const handleMemberDelete = async (wcaid: string) => {
    try {
      const data = await deleteMember(wcaid);
      toast.success(data.message);
      refreshPage();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete member",
      );
    }
  };

  const handleRequestDelete = async (wcaid: string) => {
    try {
      const data = await deleteRequest(wcaid);
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
