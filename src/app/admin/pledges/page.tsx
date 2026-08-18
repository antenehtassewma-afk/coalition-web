"use client";

import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase"; // We imported auth here!
import { collection, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminPledgesPage() {
  const router = useRouter();
  const [pledges, setPledges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // The Bouncer: Wait to verify who they are BEFORE fetching data
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthorized(true);
        fetchPledges(); // Only fetch the data once we know they are an admin!
      } else {
        router.push("/admin/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchPledges = async () => {
    try {
      const pledgesRef = collection(db, "pledges");
      const q = query(pledgesRef, orderBy("submittedAt", "desc")); 
      const snapshot = await getDocs(q);
      
      const livePledges = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      
      setPledges(livePledges);
    } catch (error) {
      console.error("Error fetching pledges:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      await deleteDoc(doc(db, "pledges", id));
      setPledges(pledges.filter(p => p.id !== id));
    } catch (error) {
      console.error("Error deleting record: ", error);
      alert("Failed to delete record.");
    }
  };

  // Show a loading screen while the Bouncer checks their ID
  if (!isAuthorized) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-[#11235A] font-bold">Verifying Access...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Donations & Pledges</h1>
            <p className="text-gray-600 mt-2">Review financial support submitted from the public site.</p>
          </div>
          <Link href="/admin" className="text-[#11235A] font-bold hover:underline">
            ← Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-green-50 border-b border-gray-200 p-6 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Pending Financial Support</h2>
            <span className="bg-green-200 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
              {pledges.length} Total
            </span>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading records...</div>
          ) : pledges.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <h3 className="text-lg font-medium text-gray-900">No records yet</h3>
              <p className="mt-1">When users submit the Donate or Pledge forms, they will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pledges.map((record) => {
                    const isDonation = record.message === "Submitted via Main Donate Page";

                    return (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900">{record.fullName}</div>
                          {record.message && !isDonation && (
                            <div className="text-xs text-gray-500 truncate max-w-[200px]">{record.message}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{record.email}</div>
                          <div className="text-sm text-gray-500">{record.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isDonation ? (
                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-blue-100 text-blue-800">
                              Donation (Pending)
                            </span>
                          ) : (
                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-purple-100 text-purple-800">
                              Future Pledge
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 inline-flex text-sm leading-5 font-bold rounded-full bg-green-100 text-green-800">
                            ${record.pledgeAmount}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => handleDelete(record.id)}
                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded transition-colors"
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
          )}
        </div>

      </div>
    </div>
  );
}