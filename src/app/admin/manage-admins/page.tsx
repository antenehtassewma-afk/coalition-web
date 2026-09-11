"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Define the shape of our Admin data
interface AdminUser {
  uid: string;
  email: string;
  role: string;
}

export default function ManageAdminsPage() {
  const [role, setRole] = useState<string | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  
  // Form State
  const [newEmail, setNewEmail] = useState("");
  const [newUid, setNewUid] = useState("");
  const [newRole, setNewRole] = useState("Admin");

  // 1. THE SECURITY BOUNCER
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.uid) {
        const roleDocRef = doc(db, "admin_users", user.uid);
        const roleDoc = await getDoc(roleDocRef);
        
        if (roleDoc.exists()) {
          setRole(roleDoc.data().role);
        }
      }
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. FETCH ADMIN ROSTER
  const fetchAdmins = async () => {
    setLoadingData(true);
    try {
      const querySnapshot = await getDocs(collection(db, "admin_users"));
      const adminList: AdminUser[] = [];
      querySnapshot.forEach((doc) => {
        adminList.push({ uid: doc.id, email: doc.data().email, role: doc.data().role });
      });
      setAdmins(adminList);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
    setLoadingData(false);
  };

  // Fetch data only if they pass the SuperAdmin check
  useEffect(() => {
    if (role === "SuperAdmin") {
      fetchAdmins();
    }
  }, [role]);

  // 3. ADD NEW ADMIN
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create the document using the UID as the Document ID
      await setDoc(doc(db, "admin_users", newUid.trim()), {
        email: newEmail.trim(),
        role: newRole,
      });
      setNewEmail("");
      setNewUid("");
      setNewRole("Admin");
      fetchAdmins(); // Refresh the list
    } catch (error) {
      console.error("Error adding admin:", error);
      alert("Failed to add admin. Check your permissions.");
    }
  };

  // 4. REMOVE ADMIN
  const handleRemoveAdmin = async (targetUid: string) => {
    if (window.confirm("Are you sure you want to revoke this user's admin access?")) {
      try {
        await deleteDoc(doc(db, "admin_users", targetUid));
        fetchAdmins(); // Refresh the list
      } catch (error) {
        console.error("Error removing admin:", error);
        alert("Failed to remove admin.");
      }
    }
  };

  // --- RENDERING ---
  if (loadingAuth) return <div className="p-10 font-bold">Verifying security clearance...</div>;
  
  if (role !== "SuperAdmin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-10 rounded-lg shadow-md border-t-4 border-red-600 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-700">Only SuperAdmins can manage the administration team.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-[#11235A] mb-8">Manage Administrators</h1>

      {/* ADD ADMIN FORM */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-bold mb-4">Grant Admin Access</h2>
        <form onSubmit={handleAddAdmin} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">User Email</label>
            <input required type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="w-full border p-2 rounded" placeholder="admin@example.com" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">User Auth UID</label>
            <input required type="text" value={newUid} onChange={(e) => setNewUid(e.target.value)} className="w-full border p-2 rounded" placeholder="Paste UID from Auth tab" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Role Level</label>
            <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className="w-full border p-2 rounded">
              <option value="Admin">Admin (Can Edit Content)</option>
              <option value="SuperAdmin">SuperAdmin (Full Control)</option>
            </select>
          </div>
          <button type="submit" className="bg-[#11235A] text-white font-bold py-2 px-4 rounded hover:bg-blue-900">
            Add User
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-3">
          *Note: The user must first sign in to the platform. Once they do, copy their UID from the Firebase Authentication tab and paste it here.
        </p>
      </div>

      {/* ACTIVE ADMIN ROSTER */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="bg-[#11235A] text-white">
            <tr>
              <th className="py-3 px-6 font-semibold">Email</th>
              <th className="py-3 px-6 font-semibold">Role</th>
              <th className="py-3 px-6 font-semibold">User ID (UID)</th>
              <th className="py-3 px-6 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loadingData ? (
              <tr><td colSpan={4} className="p-4 text-center">Loading roster...</td></tr>
            ) : (
              admins.map((admin) => (
                <tr key={admin.uid} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6">{admin.email}</td>
                  <td className="py-3 px-6">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${admin.role === 'SuperAdmin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                      {admin.role}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-xs text-gray-500">{admin.uid}</td>
                  <td className="py-3 px-6 text-right">
                    <button 
                      onClick={() => handleRemoveAdmin(admin.uid)}
                      className="text-red-600 hover:text-red-900 font-semibold text-sm"
                    >
                      Revoke Access
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}