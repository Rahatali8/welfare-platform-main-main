import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function RequestsFeedVertical() {
  const [requests, setRequests] = useState([]);
  const router = useRouter();
  useEffect(() => {
    async function fetchRequests() {
      const res = await fetch("/api/admin/requests");
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
      }
    }
    fetchRequests();
  }, []);

  return (
    <div>
      <h2 className="text-5xl font-bold text-[#1B0073] text-center m-10">The Request <span className="text-[#00A5E0]">Streamline</span></h2>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {requests.map((r: any) => (
        <div
          key={r.id}
          onClick={() => router.push('/donor/login')}
          className="cursor-pointer"
        >
          <Card
            className="relative w-full min-h-[270px] max-h-[290px] bg-white border border-blue-100 shadow-xl rounded-2xl p-8 flex flex-col gap-2 hover:shadow-2xl transition-all group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-shrink-0">
                <Image
                  src={"/user-male.png"}
                  alt="User"
                  width={48}
                  height={48}
                  className="rounded-full border-2 border-blue-200 shadow"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-blue-900 text-lg truncate">
                  {r.user?.fullName || "-"}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {r.user?.address || "-"}
                </div>
              </div>
              <span
                className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold capitalize shadow ${r.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : r.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : r.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                  }`}
              >
                {r.status}
              </span>
            </div>
            <div className="text-sm text-gray-700 mb-1">
              <span className="font-medium">Type:</span> {r.type}
            </div>
            <div className="text-sm text-gray-600 mb-1 line-clamp-2">
              <span className="font-medium">Description:</span> {r.description || "-"}
            </div>
            {r.amount && (
              <div className="text-sm text-blue-700 mb-1">
                <span className="font-medium">Amount:</span> PKR{" "}
                {r.amount.toLocaleString()}
              </div>
            )}
            <div className="flex items-center justify-between mt-2">
              <div className="text-xs text-gray-400">
                {new Date(r.submittedAt).toLocaleDateString()}
              </div>
              <div className="text-xs text-gray-400">
                CNIC: {r.user?.cnic || "-"}
              </div>
              <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm shadow-sm border border-blue-200 select-none cursor-default mx-2">Join Us to donate</span>

            </div>
            <div className="absolute top-2 right-2">
              {/* Optionally add a badge or icon here */}
            </div>
          </Card>
        </div>
      ))}
      </div>
    </div>
  );
}
