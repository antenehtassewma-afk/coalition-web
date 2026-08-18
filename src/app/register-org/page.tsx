"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function RegisterOrgPage() {
  // NEW: Track which step of the process the organization is on
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState("idle");

  const [formData, setFormData] = useState({
    organizationName: "",
    contactName: "",
    email: "",
    phone: "",
    membershipType: "Partner Organization",
    message: ""
  });

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      // 1. Save to Firebase first (so we don't lose them if they close the window)
      const regRef = collection(db, "registrations");
      await addDoc(regRef, {
        ...formData,
        submittedAt: new Date(),
        status: "pending_payment"
      });

      // 2. Instead of redirecting to a new URL, we just flip the view to Step 2!
      setStep(2);
      setStatus("idle"); // Reset status for the payment phase

    } catch (error) {
      console.error("Error registering organization: ", error);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">

        {/* =========================================
            STEP 1: THE REGISTRATION FORM 
            ========================================= */}
        {step === 1 && (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-extrabold text-[#11235A] mb-4">Partner Organization Registration</h1>
              <p className="text-xl text-gray-600">
                Register your local association, business, or community group to become an official, recognized partner of the coalition.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              {status === "error" && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
                  <p className="font-bold">Error</p>
                  <p>There was a problem submitting your registration. Please try again.</p>
                </div>
              )}

              <form onSubmit={handleRegistrationSubmit} className="space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Organization Name *</label>
                    <input required type="text" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#11235A] outline-none" value={formData.organizationName} onChange={e => setFormData({...formData, organizationName: e.target.value})} placeholder="Organization Name" />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Primary Contact Name *</label>
                    <input required type="text" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#11235A] outline-none" value={formData.contactName} onChange={e => setFormData({...formData, contactName: e.target.value})} placeholder="Full Name" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Email Address *</label>
                    <input required type="email" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#11235A] outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="org@example.com" />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
                    <input type="tel" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#11235A] outline-none" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="(555) 555-5555" />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Additional Information (Optional)</label>
                  <textarea rows={4} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#11235A] outline-none" placeholder="Tell us a little about your organization..." value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
                </div>

                <button type="submit" disabled={status === "sending"} className="w-full bg-[#11235A] text-white font-bold py-4 px-8 rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50 text-lg shadow-md">
                  {status === "sending" ? "Saving..." : "Continue to Payment ➔"}
                </button>
              </form>
            </div>
          </>
        )}

        {/* =========================================
            STEP 2: THE PAYMENT SCREEN 
            ========================================= */}
        {step === 2 && (
          <div className="text-center animate-fade-in bg-white rounded-2xl shadow-sm border border-gray-200 p-12 mt-8">
            <h1 className="text-4xl font-extrabold text-[#11235A] mb-4">Complete Organization Membership</h1>
            
            {/* Greets them by their Organization Name! */}
            <p className="text-xl mb-8 text-gray-600">Thank you, {formData.organizationName}! Choose how you would like to pay.</p>

            <div className="max-w-md mx-auto space-y-4">
              <button className="w-full p-4 bg-gray-900 text-white rounded font-bold hover:bg-gray-800 transition-colors">
                💳 Pay with Credit Card (Stripe)
              </button>

              <button className="w-full p-4 bg-[#0070ba] text-white rounded font-bold hover:bg-[#005ea6] transition-colors">
                pay with PayPal
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}