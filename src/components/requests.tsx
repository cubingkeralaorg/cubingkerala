'use client'

import { useEffect, useState } from "react";
import DeletePopover from "./delete-member-popover";
import ApprovePopover from "./approve-popover";
import UpdatePopover from "./update-popover";
import { toast } from "sonner";
import DeleteMemberPopover from "./delete-member-popover";
import DeleteRequestPopover from "./delete-request-popover";


interface Request {
  wcaid: string;
  name: string;
  avatarUrl: string;
  country: string | null;
  gender: string | null;
  role: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function RequestsComponent({ requests, members }: {
  requests: Request[],
  members: Request[]
}) {

  const [requestsData, setRequestsData] = useState<Request[]>([])
  const [membersData, setMembersData] = useState<Request[]>([])

  useEffect(() => {
    setRequestsData(requests)
    setMembersData(members)
  }, [requests])

  const handleApprove = async (index: number) => {
    const updatedRequest = { ...requestsData[index] };
    const selectElement = document.getElementById(`role-${index}`) as HTMLSelectElement;
    updatedRequest.role = selectElement.value;

    try {
      const response = await fetch('/api/approve-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRequest),
      });
      if (response.status === 200) {
        const data = await response.json();
        toast.success(`${data.message}`);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        const error = await response.json();
        toast.error(`${error.message}`);
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };


  const handleUpdate = async (index: number) => {
    const updatedRequest = { ...membersData[index] };
    const selectElement = document.getElementById(`role-${index}`) as HTMLSelectElement;
    updatedRequest.role = selectElement.value;

    console.log(updatedRequest);
    

    try {
      const response = await fetch('/api/update-members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRequest),
      });
      if (response.status === 200) {
        const data = await response.json();
        toast.success(`${data.message}`);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        const error = await response.json();
        toast.error(`${error.message}`);
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  }



  const handleMemberDelete = async (index: number) => {
    
    try {
      const response = await fetch('/api/delete-member', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wcaid: membersData[index].wcaid }),
      });
      if (response.status === 200) {
        const data = await response.json();
        toast.success(`${data.message}`);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        const error = await response.json();
        toast.error(`${error.message}`);
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  }


  const handleRequestDelete = async (index: number) => {
    try {
      const response = await fetch('/api/delete-request', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wcaid: requestsData[index].wcaid }),
      });
      if (response.status === 200) {
        const data = await response.json();
        toast.success(`${data.message}`);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        const error = await response.json();
        toast.error(`${error.message}`);
      }
    } catch (error) {
      toast.error(`${error}`);
    }

  }



  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-black text-stone-200">
      <h1 className="text-3xl font-bold mb-5">Requests</h1>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px] table-auto">
          <thead>
            <tr className="border-none">
              <th className="px-4 py-1 text-left">Name</th>
              <th className="px-4 py-1 text-left">WCA ID</th>
              <th className="px-4 py-1 text-left">Role</th>
              <th className="px-4 py-1 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              requestsData.length > 0 ? requestsData?.map((request, index) => (
                <tr key={index} className="border-b">
                  <td className="px-2 py-2">{request.name}</td>
                  <td className="px-2 py-2">{request.wcaid}</td>
                  <td className="px-2 py-2">
                    <select className="bg-black text-stone-200 rounded-none" id={`role-${index}`} name="role" defaultValue={request.role || "member"}>
                      <option value="member">Member</option>
                      <option value="organiser">Organiser</option>
                      <option value="co-founder">Co-Founder</option>
                    </select>
                  </td>
                  <td className="px-2 py-2 text-right">
                    <div className="flex items-end justify-end">
                      <DeleteRequestPopover handleRequestDelete={handleRequestDelete} index={index} />
                      <ApprovePopover handleApprove={handleApprove} index={index} />
                    </div>
                  </td>
                </tr>
              )) : <tr><td className="text-muted-foreground px-2 py-2" colSpan={4}>No new requests...</td></tr>
            }
          </tbody>
        </table>
      </div>
      <h1 className="text-3xl font-bold mb-5 mt-10">Members</h1>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px] table-auto">
          <thead>
            <tr className="border-none">
              <th className="px-4 py-1 text-left">Name</th>
              <th className="px-4 py-1 text-left">WCA ID</th>
              <th className="px-4 py-1 text-left">Role</th>
              <th className="px-4 py-1 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              membersData.length > 0 ? membersData?.map((member, index) => (
                <tr key={index}>
                  <td className="px-2 py-2">{member.name}</td>
                  <td className="px-2 py-2">{member.wcaid}</td>
                  <td className="px-2 py-2">
                    <select className="bg-black text-stone-200 rounded-none" id={`role-${index}`} name="role" defaultValue={member.role || "member"}>
                      <option value="member">Member</option>
                      <option value="organiser">Organiser</option>
                      <option value="co-founder">Co-Founder</option>
                    </select>
                  </td>
                  <td className="px-2 py-2 text-right">
                    <div className="flex items-end justify-end">
                      <DeleteMemberPopover handleMemberDelete={handleMemberDelete} index={index} />
                      <UpdatePopover handleUpdate={handleUpdate} index={index} />
                    </div>
                  </td>
                </tr>
              )) : <tr><td className="text-muted-foreground px-2 py-2" colSpan={4}>No members...</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}
