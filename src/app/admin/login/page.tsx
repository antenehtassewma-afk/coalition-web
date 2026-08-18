"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Check the credentials against Firebase's secure vault
      await signInWithEmailAndPassword(auth, email, password);
      // If successful, warp them to the dashboard!
      router.push("/admin");
    } catch (err) {
      setError("Invalid email or password. Are you a coalition leader?");
    }
  };

 return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8 border-t-4 border-[#11235A]">
        
        {/* The Header */}
        <h2 className="text-3xl font-extrabold text-center text-[#11235A] mb-6">
          Admin Login
        </h2>
        
        {/* The Error Message box */}
        {error && (
          <p className="text-red-600 bg-red-50 p-3 rounded text-sm mb-4">
            {error}
          </p>
        )}
        
        {/* The Form */}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Admin Email</label>
            <input 
              type="email" required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-[#136B32]"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input 
              type="password" required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:border-[#136B32]"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            className="bg-[#11235A] text-white font-bold py-3 px-4 rounded w-full hover:bg-blue-900 transition-colors"
          >
            Access Command Center
          </button>
        </form>

      </div>
    </div>
  );
}