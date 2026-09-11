"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import Link from "next/link";

export default function PledgePage() {
  const [status, setStatus] = useState("idle");
  const [amount, setAmount] = useState("100");
  const [customAmount, setCustomAmount] = useState("");
  
  const [paymentMethod, setPaymentMethod] = useState("zelle");
  const [paymentReference, setPaymentReference] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });

  const paymentOptions = [
    { id: "stripe", label: "Credit Card", icon: "💳" },
    { id: "paypal", label: "PayPal", icon: "🅿️" },
    { id: "cashapp", label: "Cash App", icon: "💚" },
    { id: "zelle", label: "Zelle", icon: "🏦" },
    { id: "check", label: "Mail Check", icon: "✉️" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    const finalAmount = customAmount || amount;

    try {
      const pledgesRef = collection(db, "pledges");
      await addDoc(pledgesRef, {
        ...formData,
        pledgeAmount: finalAmount,
        paymentMethod: paymentMethod,
        paymentReference: paymentReference || "None",
        submittedAt: new Date(),
        status: "Pending" // Pledges are always pending fulfillment
      });

      setStatus("success");
    } catch (error) {
      console.error("Error submitting pledge: ", error);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#11235A] mb-4">
            Make a Future Pledge
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Commit your financial support for our upcoming initiatives. Select your preferred payment method below.
          </p>
        </div>

        {status === "success" ? (
          <div className="bg-white rounded-2xl shadow-lg border-t-4 border-t-[#136B32] p-12 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pledge Recorded!</h2>
            <p className="text-gray-600 text-lg mb-6">
              Thank you for your commitment. Our team has logged your pledge and will follow up with you.
            </p>
            <Link href="/" className="text-[#11235A] font-bold hover:underline">
              Return to Homepage
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <form onSubmit={handleSubmit}>
              
              {/* 1. Pledge Amount */}
              <h3 className="text-xl font-bold text-gray-900 mb-4">1. Pledge Amount</h3>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {["50", "100", "250"].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => { setAmount(preset); setCustomAmount(""); }}
                    className={`py-3 rounded-lg font-bold border-2 transition-colors ${
                      amount === preset && !customAmount
                        ? "bg-[#136B32] border-[#136B32] text-white"
                        : "bg-white border-gray-200 text-gray-700 hover:border-[#136B32]"
                    }`}
                  >
                    ${preset}
                  </button>
                ))}
              </div>
              <input 
                type="number" 
                placeholder="Custom Amount" 
                className="mb-8 border border-gray-300 rounded w-full py-3 px-4 text-gray-700"
                value={customAmount}
                onChange={(e) => { setCustomAmount(e.target.value); setAmount(""); }}
              />

              {/* 2. Payment Method */}
              <h3 className="text-xl font-bold text-gray-900 mb-4">2. Intended Payment Method</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {paymentOptions.map((opt) => {
                  const isSelected = paymentMethod === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPaymentMethod(opt.id)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        isSelected ? "border-[#11235A] bg-blue-50/50 shadow-sm" : "border-gray-200 bg-white"
                      }`}
                    >
                      <span className="text-2xl mb-1 block">{opt.icon}</span>
                      <span className={`font-bold text-xs sm:text-sm ${isSelected ? "text-[#11235A]" : "text-gray-800"}`}>
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* 3. Donor Information */}
              <h3 className="text-xl font-bold text-gray-900 mb-4">3. Your Information</h3>
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Full Name *</label>
                  <input required type="text" className="border border-gray-300 rounded w-full py-3 px-4 text-gray-700" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Email Address *</label>
                  <input required type="email" className="border border-gray-300 rounded w-full py-3 px-4 text-gray-700" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
                  <input type="tel" className="border border-gray-300 rounded w-full py-3 px-4 text-gray-700" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Pledge Notes / Message</label>
                  <textarea rows={3} className="border border-gray-300 rounded w-full py-3 px-4 text-gray-700" placeholder="When do you plan to fulfill this pledge?" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={status === "submitting"} 
                className="bg-[#11235A] text-white font-bold py-4 px-8 rounded-lg hover:bg-blue-900 w-full transition-colors text-lg shadow-md"
              >
                {status === "submitting" ? "Submitting..." : `Submit Pledge of $${customAmount || amount}`}
              </button>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
