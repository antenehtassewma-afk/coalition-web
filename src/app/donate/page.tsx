"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import Link from "next/link";

export default function DonatePage() {
  const [status, setStatus] = useState("idle");
  const [amount, setAmount] = useState("100");
  const [customAmount, setCustomAmount] = useState("");
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const handleAmountClick = (val: string) => {
    setAmount(val);
    setCustomAmount("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    const finalAmount = customAmount || amount;

    try {
      const donationsRef = collection(db, "pledges");
      await addDoc(donationsRef, {
        ...formData,
        pledgeAmount: finalAmount,
        message: "Submitted via Main Donate Page",
        submittedAt: new Date(),
        status: "Pending Gateway Connection"
      });

      setStatus("success");
    } catch (error) {
      console.error("Error submitting donation: ", error);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#11235A] mb-4">
            Make a Donation
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your generosity empowers our community. Choose an amount below to support our ongoing initiatives and advocacy.
          </p>
        </div>

        {status === "success" ? (
          <div className="bg-white rounded-2xl shadow-lg border-t-4 border-t-[#136B32] p-12 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-[#136B32]">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h2>
            <p className="text-gray-600 text-lg mb-6">
              Your donation details have been securely recorded. Because our payment gateway is currently being upgraded, a representative will contact you shortly with a secure link to complete your transaction.
            </p>
            <Link href="/" className="text-[#11235A] font-bold hover:underline">
              Return to Homepage
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            
            {/* Information Sidebar */}
            <div className="lg:col-span-2">
              <div className="bg-[#11235A] rounded-2xl shadow-sm p-8 text-white h-full">
                <h3 className="text-2xl font-bold mb-6">Why Give?</h3>
                <ul className="space-y-4 mb-8 text-blue-100">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    Fund community town halls and cultural events
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    Support advocacy for civil rights and heritage
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    Expand our educational and youth programs
                  </li>
                </ul>
                <div className="bg-blue-900/50 p-4 rounded-lg border border-blue-800 text-sm text-blue-200">
                  <strong>Note:</strong> Not ready to donate today? You can also <Link href="/pledge" className="text-white underline font-bold">make a pledge</Link> for a future date.
                </div>
              </div>
            </div>

            {/* Donation Form */}
            <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <form onSubmit={handleSubmit}>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">1. Select Amount</h3>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {["50", "100", "250"].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleAmountClick(preset)}
                      className={`py-3 rounded-lg font-bold border-2 transition-colors ${
                        amount === preset && !customAmount
                          ? "bg-[#136B32] border-[#136B32] text-white"
                          : "bg-white border-gray-200 text-gray-700 hover:border-[#136B32] hover:text-[#136B32]"
                      }`}
                    >
                      ${preset}
                    </button>
                  ))}
                </div>
                
                <div className="mb-8">
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 font-bold">$</span>
                    <input 
                      type="number" 
                      placeholder="Custom Amount" 
                      className="pl-8 shadow-sm appearance-none border border-gray-300 rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-[#11235A] focus:ring-1 focus:ring-[#11235A]"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setAmount("");
                      }}
                    />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4">2. Your Information</h3>
                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Full Name *</label>
                    <input required type="text" className="shadow-sm appearance-none border border-gray-300 rounded w-full py-3 px-4 text-gray-700 focus:outline-none focus:border-[#11235A] focus:ring-1 focus:ring-[#11235A]" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Email Address *</label>
                    <input required type="email" className="shadow-sm appearance-none border border-gray-300 rounded w-full py-3 px-4 text-gray-700 focus:outline-none focus:border-[#11235A] focus:ring-1 focus:ring-[#11235A]" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
                    <input type="tel" className="shadow-sm appearance-none border border-gray-300 rounded w-full py-3 px-4 text-gray-700 focus:outline-none focus:border-[#11235A] focus:ring-1 focus:ring-[#11235A]" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={status === "submitting"} 
                  className="bg-[#11235A] text-white font-bold py-4 px-8 rounded-lg hover:bg-blue-900 w-full disabled:opacity-50 transition-colors text-lg shadow-md"
                >
                  {status === "submitting" ? "Processing..." : `Donate $${customAmount || amount}`}
                </button>
                <p className="text-xs text-gray-500 text-center mt-4">
                  Secure processing. By clicking Donate, you agree to our terms of service.
                </p>

              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}