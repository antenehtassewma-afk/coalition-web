"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import Link from "next/link";

export default function JoinPage() {
  const [status, setStatus] = useState("idle");
  const [membershipType, setMembershipType] = useState("Individual Member");
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [paymentReference, setPaymentReference] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    organizationName: "",
    contactName: "",
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

    try {
      const registrationsRef = collection(db, "registrations");
      await addDoc(registrationsRef, {
        ...formData,
        membershipType,
        paymentMethod,
        paymentReference: paymentReference || "None",
        submittedAt: new Date(),
        status: paymentMethod === "zelle" || paymentMethod === "check" || paymentMethod === "cashapp" ? "Pending" : "Paid"
      });

      setStatus("success");
    } catch (error) {
      console.error("Error submitting registration: ", error);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-[#11235A] mb-4">
            Join the Coalition
          </h1>
          <p className="text-xl text-gray-600">
            Register as an Individual Member or a Partner Local Organization.
          </p>
        </div>

        {status === "success" ? (
          <div className="bg-white rounded-2xl shadow-lg border-t-4 border-t-[#136B32] p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Registration Successful!</h2>
            <p className="text-gray-600 text-lg mb-6">
              Thank you for joining. Your application and payment details have been securely recorded.
            </p>
            <Link href="/" className="text-[#11235A] font-bold hover:underline">
              Return to Homepage
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <form onSubmit={handleSubmit}>
              
              {/* 1. Membership Type */}
              <h3 className="text-xl font-bold text-gray-900 mb-4">1. Membership Type</h3>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {["Individual Member", "Partner Organization"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setMembershipType(type)}
                    className={`py-3 px-4 rounded-xl font-bold border-2 transition-all ${
                      membershipType === type
                        ? "bg-[#11235A] border-[#11235A] text-white"
                        : "bg-white border-gray-200 text-gray-700 hover:border-[#11235A]"
                    }`}
                  >
                    {type === "Individual Member" ? "👤 Individual" : "🏢 Organization"}
                  </button>
                ))}
              </div>

              {/* 2. Contact Information */}
              <h3 className="text-xl font-bold text-gray-900 mb-4">2. Contact Information</h3>
              <div className="space-y-4 mb-8">
                {membershipType === "Partner Organization" && (
                  <>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">Organization Name *</label>
                      <input required type="text" className="border border-gray-300 rounded w-full py-3 px-4 text-gray-700" value={formData.organizationName} onChange={(e) => setFormData({...formData, organizationName: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">Representative Name *</label>
                      <input required type="text" className="border border-gray-300 rounded w-full py-3 px-4 text-gray-700" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
                    </div>
                  </>
                )}

                {membershipType === "Individual Member" && (
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Full Name *</label>
                    <input required type="text" className="border border-gray-300 rounded w-full py-3 px-4 text-gray-700" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
                  </div>
                )}

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Email Address *</label>
                  <input required type="email" className="border border-gray-300 rounded w-full py-3 px-4 text-gray-700" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number *</label>
                  <input required type="tel" className="border border-gray-300 rounded w-full py-3 px-4 text-gray-700" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>

              {/* 3. Payment Method */}
              <h3 className="text-xl font-bold text-gray-900 mb-4">3. Select Payment Method</h3>
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

              {/* Reference fields for manual methods */}
              {(paymentMethod === "zelle" || paymentMethod === "cashapp") && (
                <div className="mb-8 p-4 bg-gray-50 border rounded-xl text-sm">
                  <p className="text-gray-600 mb-2">
                    {paymentMethod === "zelle" ? "Send transfer to: payments@yourcoalition.org" : "Send to Cash Tag: $YourCashTag"}
                  </p>
                  <input 
                    type="text" 
                    placeholder="Enter Confirmation/Receipt Number" 
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    className="w-full p-2 border rounded bg-white text-gray-800"
                  />
                </div>
              )}

              <button 
                type="submit" 
                disabled={status === "submitting"} 
                className="bg-[#11235A] text-white font-bold py-4 px-8 rounded-lg hover:bg-blue-900 w-full transition-colors text-lg shadow-md"
              >
                {status === "submitting" ? "Processing..." : "Complete Registration"}
              </button>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}