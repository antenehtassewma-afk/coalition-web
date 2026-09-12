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

  // Update Firebase when Zelle/CashApp/Stripe clears
  const handleMarkAsPaid = async (id: string) => {
    try {
      const memberRef = doc(db, "registrations", id);
      await updateDoc(memberRef, {
        status: "Paid"
      });
      
      setMembers(members.map(member => 
        member.id === id ? { ...member, status: "Paid" } : member
      ));
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  // Delete a registration with a safety confirmation
  const handleDelete = async (id: string) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this record? This action cannot be undone.");
    
    if (!isConfirmed) return;

    try {
      const memberRef = doc(db, "registrations", id);
      await deleteDoc(memberRef);
      
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
        <span className="bg-blue-800 px-3 py-1 rounded text-sm">All Payment Methods</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200 text-gray-700">
              <th className="p-4 font-bold">Name / Organization</th>
              <th className="p-4 font-bold">Membership Tier</th>
              <th className="p-4 font-bold">Payment Method & Ref</th>
              <th className="p-4 font-bold">Status</th>
              <th className="p-4 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => {
              const displayOrgName = member.organizationName || member.fullName || "Name Missing";
              const paymentMethodLabel = 
                member.paymentMethod === "stripe" ? "💳 Credit Card" :
                member.paymentMethod === "paypal" ? "🅿️ PayPal" :
                member.paymentMethod === "cashapp" ? "💚 Cash App" :
                member.paymentMethod === "zelle" ? "🏦 Zelle" :
                member.paymentMethod === "check" ? "✉️ Mail Check" : "Not Specified";

              const currentStatus = member.status || "Pending";

              return (
                <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  {/* Name / Organization with Clickable Website Link */}
                  <td className="p-4 font-medium text-gray-900">
                    {member.website ? (
                      <a 
                        href={member.website.startsWith('http') ? member.website : `https://${member.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#11235A] hover:underline flex items-center gap-1 font-bold"
                        title="Click to visit organization website"
                      >
                        🏢 {displayOrgName} 🔗
                      </a>
                    ) : (
                      <span className="font-bold text-[#11235A]">
                        🏢 {displayOrgName}
                      </span>
                    )}
                    {member.representativeName && (
                      <div className="text-xs text-gray-500 mt-0.5">Rep: {member.representativeName}</div>
                    )}
                  </td>

                  {/* Membership Tier */}
                  <td className="p-4 text-gray-600 capitalize">
                    {member.membershipType || "Partner Organization"}
                  </td>

                  {/* Payment Method & Reference */}
                  <td className="p-4">
                    <div className="text-xs font-bold text-gray-900 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-md inline-block">
                      {paymentMethodLabel}
                    </div>
                    {member.paymentReference && member.paymentReference !== "None" && (
                      <div className="text-xs text-gray-500 mt-1 font-mono">
                        Ref: <span className="text-gray-800 font-bold">{member.paymentReference}</span>
                      </div>
                    )}
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    {currentStatus.toLowerCase() === "paid" ? (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">PAID</span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold">PENDING</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="p-4 flex gap-3">
                    {currentStatus.toLowerCase() !== "paid" && (
                      <button 
                        onClick={() => handleMarkAsPaid(member.id)}
                        className="bg-[#136B32] hover:bg-green-700 text-white text-sm font-bold py-2 px-4 rounded transition-colors"
                      >
                        Mark as Paid
                      </button>
                    )}
                    
                    <button 
                      onClick={() => handleDelete(member.id)}
                      className="bg-red-50 hover:bg-red-600 text-red-600 hover:text-white text-sm font-bold py-2 px-4 rounded transition-colors border border-red-200 hover:border-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}