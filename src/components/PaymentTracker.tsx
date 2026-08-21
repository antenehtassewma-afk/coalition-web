"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

export default function PaymentTracker() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all registrations on load
  useEffect(() => {
    const fetchMembers = async () => {
      const querySnapshot = await getDocs(collection(db, "registrations"));
      const membersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMembers(membersData);
      setLoading(false);
    };
    fetchMembers();
  }, []);

  // Update Firebase when Zelle/CashApp clears
  const handleMarkAsPaid = async (id: string) => {
    try {
      const memberRef = doc(db, "registrations", id);
      await updateDoc(memberRef, {
        status: "paid"
      });
      
      setMembers(members.map(member => 
        member.id === id ? { ...member, status: "paid" } : member
      ));
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  // NEW: Delete a registration with a safety confirmation
  const handleDelete = async (id: string) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this record? This action cannot be undone.");
    
    if (!isConfirmed) return; // Stop if they click 'Cancel'

    try {
      const memberRef = doc(db, "registrations", id);
      await deleteDoc(memberRef);
      
      // Remove it from the screen instantly
      setMembers(members.filter(member => member.id !== id));
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  if (loading) return <p className="p-8 text-center text-gray-500">Loading financials...</p>;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <div className="bg-[#11235A] p-6 text-white flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manual Payment Tracking</h2>
        <span className="bg-blue-800 px-3 py-1 rounded text-sm">Zelle / CashApp / Check</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200 text-gray-700">
              <th className="p-4 font-bold">Name / Organization</th>
              <th className="p-4 font-bold">Membership Tier</th>
              <th className="p-4 font-bold">Status</th>
              <th className="p-4 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-900">
                  {member.fullName || member.organizationName}
                </td>
                <td className="p-4 text-gray-600 capitalize">
                  {member.membershipType || "Standard"}
                </td>
                <td className="p-4">
                  {member.status === "paid" ? (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">PAID</span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold">PENDING</span>
                  )}
                </td>
                <td className="p-4 flex gap-3">
                  {member.status !== "paid" && (
                    <button 
                      onClick={() => handleMarkAsPaid(member.id)}
                      className="bg-[#136B32] hover:bg-green-700 text-white text-sm font-bold py-2 px-4 rounded transition-colors"
                    >
                      Mark as Paid
                    </button>
                  )}
                  
                  {/* NEW: Delete Button */}
                  <button 
                    onClick={() => handleDelete(member.id)}
                    className="bg-red-50 hover:bg-red-600 text-red-600 hover:text-white text-sm font-bold py-2 px-4 rounded transition-colors border border-red-200 hover:border-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}