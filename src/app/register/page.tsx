"use client";
import emailjs from '@emailjs/browser';
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function RegisterPage() {
  // NEW: Track which step of the process the user is on
  const [step, setStep] = useState(1); 
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    membershipType: "standard",
  });

  const [status, setStatus] = useState("idle"); 

const handleRegistrationSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setStatus("sending");

  try {
    // 1. Save the data to Firebase First
    const regRef = collection(db, "registrations");
    await addDoc(regRef, {
      ...formData,
      submittedAt: new Date(),
      status: "pending_payment"
    });

    // 2. Fire the EmailJS Notification
    await emailjs.send(
      'service_b89yzbu', 
      'template_ydgkgcq', 
      {
        registration_type: "Individual Member",
        name: formData.fullName, 
        email: formData.email,
        phone: formData.phone, // Fixed to match your state
        extra_details: `Membership Tier: ${formData.membershipType}` // Swapped city/state for Membership Tier
      }, 
      '8AyYvWD6B6YNYm1tI'
    );
    console.log("Admin notification sent successfully.");

    // 3. Flip the view to Step 2 (Payment Screen)
    setStep(2);
    setStatus("idle"); 

  } catch (error) {
    console.error("Error registering member:", error);
    setStatus("error");
  }
};

  return (
    <div className="container mx-auto px-4 py-12">
      
      {/* =========================================
          STEP 1: THE REGISTRATION FORM 
          ========================================= */}
      {step === 1 && (
        <>
          <h1 className="text-4xl font-extrabold text-[#11235A] mb-8 text-center">Join the Coalition</h1>
          <form onSubmit={handleRegistrationSubmit} className="max-w-2xl mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
              <input 
                required
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-[#136B32]"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
              <input 
                required
                type="email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-[#136B32]"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
              <input 
                required
                type="tel"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-[#136B32]"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="mb-8">
              <label className="block text-gray-700 text-sm font-bold mb-2">Membership Tier</label>
              <select 
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-[#136B32]"
                value={formData.membershipType}
                onChange={(e) => setFormData({ ...formData, membershipType: e.target.value })}
              >
                <option value="standard">Standard Member ($50/yr)</option>
                <option value="premium">Premium Supporter ($100/yr)</option>
                <option value="business">Business Sponsor ($500/yr)</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={status === "sending"}
              className="bg-[#136B32] text-white font-bold py-3 px-6 rounded focus:outline-none hover:bg-green-700 w-full disabled:opacity-50 transition-colors"
            >
              {status === "sending" ? "Saving..." : "Continue to Payment ➔"}
            </button>
          </form>
        </>
      )}

      {/* =========================================
          STEP 2: THE PAYMENT SCREEN 
          ========================================= */}
      {step === 2 && (
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl font-extrabold text-[#11235A] mb-4">Complete Your Membership</h1>
          <p className="text-xl mb-8 text-gray-600">Thank you, {formData.fullName}! Choose how you would like to pay.</p>
          
          <div className="max-w-md mx-auto space-y-4">
            {/* We will wire these up to the actual payment processors next! */}

            
            <button className="w-full p-4 bg-gray-900 text-white rounded font-bold hover:bg-gray-800 transition-colors">
              💳 Pay with Credit Card (Stripe)
            </button>
            
            <button className="w-full p-4 bg-[#0070ba] text-white rounded font-bold hover:bg-[#005ea6] transition-colors">
              pay with PayPal
            </button>
            {/* MANUAL PAYMENT OPTIONS */}
<div className="mt-8 pt-8 border-t border-gray-200">
  <h3 className="text-xl font-bold text-[#11235A] mb-4">Alternative Payment Options</h3>
  <p className="text-gray-600 mb-6 text-sm">
    Prefer not to pay online? Your information is securely saved in our system. 
    You can submit your payment manually, and our team will approve your account.
  </p>
  
  <div className="bg-gray-50 p-6 rounded-lg text-left border border-gray-200 text-sm space-y-4">
    <div className="flex items-center gap-3">
      <span className="text-xl">📱</span>
      <p><strong className="text-gray-900">Zelle:</strong> payments@coalitiondomain.org</p>
    </div>
    <div className="flex items-center gap-3">
      <span className="text-xl">💲</span>
      <p><strong className="text-gray-900">Cash App:</strong> $CAAA_Official</p>
    </div>
    <div className="flex items-center gap-3">
      <span className="text-xl">✉️</span>
      <p><strong className="text-gray-900">Check:</strong> Mail to 4390 King Street, Alexandria, VA 22302</p>
    </div>
  </div>
</div>
          </div>
        </div>
      )}

    </div>
  );
}