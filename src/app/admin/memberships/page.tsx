"use client";

import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase"; 
import { collection, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminMembershipsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthorized(true);
        fetchApplications(); 
      } else {
        router.push("/admin/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchApplications = async () => {
    try {
      const appsRef = collection(db, "registrations");
      const q = query(appsRef, orderBy("submittedAt", "desc")); 
      const snapshot = await getDocs(q);
      
      const liveApps = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      
      setApplications(liveApps);
    } catch (error) {
      console.error("Error fetching applications:", error);
      try {
        const fallbackSnapshot = await getDocs(collection(db, "registrations"));
        setApplications(fallbackSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {}
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "Paid" ? "Pending" : "Paid";
    try {
      await updateDoc(doc(db, "registrations", id), { status: newStatus });
      setApplications(applications.map(app => app.id === id ? { ...app, status: newStatus } : app));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update payment status.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      await deleteDoc(doc(db, "registrations", id));
      setApplications(applications.filter(app => app.id !== id));
    } catch (error) {
      console.error("Error deleting application: ", error);
      alert("Failed to delete application.");
    }
  };

  if (!isAuthorized) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-[#11235A] font-bold">Verifying Access...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Membership Applications</h1>
            <p className="text-gray-600 mt-2">Review submissions, member details, and payment tracking across all methods.</p>
          </div>
          <Link href="/admin" className="text-[#11235A] font-bold hover:underline">
            ← Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-yellow-50 border-b border-gray-200 p-6 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">All Submissions</h2>
            <span className="bg-yellow-200 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
              {applications.length} Total
            </span>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading applications...</div>
          ) : applications.length === 0 ? (
            <div className="p-12 text-center">
              <h3 className="text-lg font-medium text-gray-900">No applications yet</h3>
              <p className="mt-1 text-gray-500">When users submit the Join form, they will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant Info</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((app) => {
                    const isOrg = app.membershipType === "Partner Organization";
                    const displayOrgName = app.organizationName || app.organization || "Organization Name Missing";
                    const displayRepName = app.representativeName || app.fullName || app.repName || app.contactName || app.name || app.contactPerson || "Rep Name Missing";
                    const displayIndName = app.fullName || app.name || "Name Missing";

                    // Clean label for payment methods
                    const paymentMethodLabel = 
                      app.paymentMethod === "stripe" ? "💳 stripe" :
                      app.paymentMethod === "paypal" ? "🅿️ PayPal" :
                      app.paymentMethod === "cashapp" ? "💚 Cash App" :
                      app.paymentMethod === "zelle" ? "🏦 Zelle" :
                      app.paymentMethod === "check" ? "✉️ Mail Check" : "Not Specified";

                    const currentStatus = app.status || "Pending";

                    return (
                      <tr key={app.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isOrg ? (
                            <>
                              <div className="text-sm font-bold text-[#11235A]">🏢 {displayOrgName}</div>
                              <div className="text-xs text-gray-500 mt-1">Rep: {displayRepName}</div>
                            </>
                          ) : (
                            <>
                              <div className="text-sm font-bold text-[#136B32]">👤 {displayIndName}</div>
                              <div className="text-xs text-gray-500 mt-1">Individual Member</div>
                            </>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{app.email || "No Email"}</div>
                          <div className="text-sm text-gray-500">{app.phone || "No Phone"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-800">{paymentMethodLabel}</div>
                          {app.paymentReference && app.paymentReference !== "None" && (
                            <div className="text-xs text-gray-500 mt-1 font-mono bg-gray-100 p-1 rounded">
                              Ref: {app.paymentReference}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleStatusToggle(app.id, currentStatus)}
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full transition-all ${
                              currentStatus === "Paid" 
                                ? "bg-green-100 text-green-800 hover:bg-green-200" 
                                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                            }`}
                            title="Click to toggle status between Paid and Pending"
                          >
                            {currentStatus === "Paid" ? "🟢 Paid" : "🟡 Pending"}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => handleDelete(app.id)}
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