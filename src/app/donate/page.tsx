"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Added router for the redirect
import emailjs from "@emailjs/browser";

export default function DonatePage() {
  const router = useRouter(); // Initialize the router
  const [status, setStatus] = useState("idle");
  const [amount, setAmount] = useState("100");
  const [customAmount, setCustomAmount] = useState("");
  
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [paymentReference, setPaymentReference] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const handleAmountClick = (val: string) => {
    setAmount(val);
    setCustomAmount("");
  };

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
      // 1. Save the data to Firebase
      const donationsRef = collection(db, "pledges");
      await addDoc(donationsRef, {
        ...formData,
        pledgeAmount: finalAmount,
        paymentMethod: paymentMethod,
        paymentReference: paymentReference || "None",
        message: "Submitted via Main Donate Page",
        submittedAt: new Date(),
        status: "Pending" 
      });

      // 2. Send the Admin Email Notification
      await emailjs.send(
        'service_b89yzbu',  // Your EmailJS Service ID
        'template_ydgkgcq', // Your EmailJS Template ID
        {
          registration_type: "New Donation", // Reusing your template fields
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          payment_method: paymentMethod.toUpperCase(),
          extra_details: `Donation Amount: $${finalAmount}\nPayment Reference: ${paymentReference || 'N/A'}`
        }, 
        '8AyYvWD6B6YNYm1tI' // Your EmailJS Public Key
      );

      // 3. Redirect straight to the Coming Soon page
      router.push("/coming-soon");
      
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
            Your generosity empowers our community. Choose an amount and payment method below to support our initiatives.
          </p>
        </div>

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
              
              {/* 1. Select Amount */}
              <h3 className="text-xl font-bold text-gray-900 mb-4">1. Select Amount</h3>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {["50", "100", "250"].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleAmountClick(preset)}
                    className={`py-2 rounded-lg font-bold border-2 transition-colors ${
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
                    className="pl-8 shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:border-[#11235A] focus:ring-1 focus:ring-[#11235A]"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setAmount("");
                    }}
                  />
                </div>
              </div>

              {/* 2. Clickable Payment Method Selection - SHRUNK & CLEANED UP */}
              <h3 className="text-xl font-bold text-gray-900 mb-4">2. Select Payment Method</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
                {paymentOptions.map((opt) => {
                  const isSelected = paymentMethod === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPaymentMethod(opt.id)}
                      className={`p-2 rounded-lg border-2 flex items-center space-x-2 transition-all ${
                        isSelected
                          ? "border-[#11235A] bg-blue-50/50 shadow-sm ring-1 ring-[#11235A]"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <span className="text-lg">{opt.icon}</span>
                      <span className={`font-bold text-xs ${isSelected ? "text-[#11235A]" : "text-gray-800"}`}>
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Conditional Instructions */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-8 text-sm">
                {paymentMethod === "stripe" && (
                  <p className="text-gray-600">💳 Secure credit card processing is coming soon.</p>
                )}
                {paymentMethod === "paypal" && (
                  <p className="text-gray-600">🅿️ PayPal checkout integration is coming soon.</p>
                )}
                {paymentMethod === "cashapp" && (
                  <div>
                    <p className="text-gray-600 mb-2">Send payment to Cash Tag: <strong className="text-[#136B32]">$YourCashTag</strong></p>
                    <input 
                      type="text" 
                      placeholder="Enter Cash App Receipt ID" 
                      value={paymentReference}
                      onChange={(e) => setPaymentReference(e.target.value)}
                      className="w-full p-2 border rounded bg-white text-gray-800 text-sm focus:outline-none focus:border-[#11235A] focus:ring-1 focus:ring-[#11235A]"
                    />
                  </div>
                )}
                {paymentMethod === "zelle" && (
                  <div>
                    <p className="text-gray-600 mb-2">Send Zelle transfer to: <strong className="text-[#11235A]">payments@yourcoalition.org</strong></p>
                    <input 
                      type="text" 
                      placeholder="Enter Zelle Confirmation Number" 
                      value={paymentReference}
                      onChange={(e) => setPaymentReference(e.target.value)}
                      className="w-full p-2 border rounded bg-white text-gray-800 text-sm focus:outline-none focus:border-[#11235A] focus:ring-1 focus:ring-[#11235A]"
                    />
                  </div>
                )}
                {paymentMethod === "check" && (
                  <p className="text-gray-600">✉️ Mail checks to: Coalition Office, 1234 Coalition Way, Washington, DC 20001</p>
                )}
              </div>

              {/* 3. Your Information */}
              <h3 className="text-xl font-bold text-gray-900 mb-4">3. Your Information</h3>
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Full Name *</label>
                  <input required type="text" className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-[#11235A] focus:ring-1 focus:ring-[#11235A]" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Email Address *</label>
                  <input required type="email" className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-[#11235A] focus:ring-1 focus:ring-[#11235A]" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
                  <input type="tel" className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-[#11235A] focus:ring-1 focus:ring-[#11235A]" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={status === "submitting"} 
                className="bg-[#11235A] text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-900 w-full disabled:opacity-50 transition-colors text-lg shadow-md"
              >
                {status === "submitting" ? "Processing..." : `Complete Donation of $${customAmount || amount}`}
              </button>
              <p className="text-xs text-gray-500 text-center mt-4">
                Secure processing. By submitting, you agree to our terms of service.
              </p>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}