"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  // The "Bouncer": Checks if you are truly logged in before showing the page
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthorized(true);
      } else {
        router.push("/admin/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

 const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthorized(false); // Instantly lock the screen
      
      // Clear any leftover local storage tokens Firebase might be hiding
      window.localStorage.clear(); 
      window.sessionStorage.clear();
      
      router.push("/admin/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Show a blank screen for a split second while verifying credentials
  if (!isAuthorized) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-[#11235A] font-bold">Verifying Access...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Admin Command Center</h1>
            <p className="text-gray-600 mt-2">Manage your coalition's website content and view applications.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="mt-4 md:mt-0 bg-red-50 text-red-600 font-bold py-2 px-6 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
          >
            Log Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Manage News */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6 text-blue-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H14"></path></svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">News & Updates</h2>
            <p className="text-gray-600 mb-6 flex-grow text-sm">Publish new press releases or announcements.</p>
            <Link href="/admin/news" className="inline-block bg-[#11235A] text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-900 transition-colors w-full text-center">
              Manage News
            </Link>
          </div>

          {/* Manage Events */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6 text-green-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Community Events</h2>
            <p className="text-gray-600 mb-6 flex-grow text-sm">Create upcoming town halls, or cultural festivals.</p>
            <Link href="/admin/events" className="inline-block bg-[#136B32] text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors w-full text-center">
              Manage Events
            </Link>
          </div>

          {/* Manage Gallery */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6 text-purple-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Gallery & Blog</h2>
            <p className="text-gray-600 mb-6 flex-grow text-sm">Post photos, cultural stories, and event recaps.</p>
            <Link href="/admin/gallery" className="inline-block bg-purple-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-900 transition-colors w-full text-center">
              Manage Gallery
            </Link>
          </div>

          {/* View Memberships */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col">
            <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6 text-yellow-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Memberships</h2>
            <p className="text-gray-600 mb-6 flex-grow text-sm">Review applications from new coalition members.</p>
            <Link href="/admin/memberships" className="inline-block bg-yellow-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-yellow-700 transition-colors w-full text-center">
              View Applications
            </Link>
          </div>

          {/* View Donations & Pledges */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6 text-green-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Donations & Pledges</h2>
            <p className="text-gray-600 mb-6 flex-grow text-sm">Review financial pledges from community supporters.</p>
            <Link href="/admin/pledges" className="inline-block bg-green-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-800 transition-colors w-full text-center">
              View Pledges
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}