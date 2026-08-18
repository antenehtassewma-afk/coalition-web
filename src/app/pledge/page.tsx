"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import Link from "next/link";

export default function PledgePage() {
  const [status, setStatus] = useState("idle");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    pledgeAmount: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const pledgesRef = collection(db, "pledges");
      await addDoc(pledgesRef, {
        ...formData,
        submittedAt: new Date(),
        status: "Pending Future Payment"
      });

      setStatus("success");
    } catch (error) {
      console.error("Error submitting pledge: ", error);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-[#11235A] mb-4">Make a Pledge</h1>
          <p className="text-xl text-gray-600">
            Commit to supporting our coalition. We will contact you directly to process your contribution when our secure payment gateway goes live.
          </p>
        </div>

        {status === "success" ? (
          <div className="bg-white rounded-2xl shadow-lg border-t-4 border-t-[#11235A] p-12 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-[#11235A]">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pledge Received!</h2>
            <p className="text-gray-600 text-lg mb-6">
              Thank you for your generous commitment. A coalition representative will be in touch with you soon.
            </p>
            <Link href="/" className="text-[#11235A] font-bold hover:underline">
              Return to Homepage
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Full Name *</label>
                  <input required type="text" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#11235A] outline-none" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Email Address *</label>
                  <input required type="email" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#11235A] outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
                  <input type="tel" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#11235A] outline-none" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Pledge Amount ($) *</label>
                  <input required type="number" min="1" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#11235A] outline-none" placeholder="e.g. 100" value={formData.pledgeAmount} onChange={e => setFormData({...formData, pledgeAmount: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Message (Optional)</label>
                <textarea rows={4} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#11235A] outline-none" placeholder="Let us know what initiatives you are most passionate about..." value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
              </div>

              <button type="submit" disabled={status === "submitting"} className="w-full bg-[#11235A] text-white font-bold py-4 px-8 rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50 text-lg shadow-md">
                {status === "submitting" ? "Submitting..." : "Submit Pledge"}
              </button>
            </form>
          </div>
        )}
        
      </div>
    </div>
  );
}
