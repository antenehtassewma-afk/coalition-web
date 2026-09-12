"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import emailjs from "@emailjs/browser";
import Link from "next/link";

export default function RegisterOrgPage() {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState("idle");
  const [docId, setDocId] = useState<string | null>(null);

  // Added state hooks at the top level to fix reference errors
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [paymentReference, setPaymentReference] = useState("");

  const [formData, setFormData] = useState({
    organizationName: "",
    dateEstablished: "",
    stateOfOperation: "",
    orgType: "",
    mission: "",
    contactName: "",
    title: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    participationAreas: [] as string[],
    reasonForJoining: "",
    isAuthorized: false,
    membershipType: "Partner Organization"
  });

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      if (checked) {
        return { ...prev, participationAreas: [...prev.participationAreas, value] };
      } else {
        return { ...prev, participationAreas: prev.participationAreas.filter((area) => area !== value) };
      }
    });
  };

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      // 1. Save all fields to Firebase with "pending" status and initial payment info
      const regRef = collection(db, "registrations");
      const docRef = await addDoc(regRef, {
        ...formData,
        representativeName: formData.contactName, 
        paymentMethod: paymentMethod, // Saves the clicked payment choice (stripe, paypal, zelle, etc.)
        paymentReference: paymentReference || "None",
        submittedAt: new Date(),
        status: "Pending" // All registrations start as pending for admin review
      });

      setDocId(docRef.id);

      // 2. Fire the EmailJS Admin Notification with expanded organization details
      await emailjs.send(
        'service_b89yzbu', 
        'template_ydgkgcq', 
        {
          registration_type: formData.membershipType,
          name: formData.organizationName,
          email: formData.email,
          phone: formData.phone,
          payment_method: paymentMethod.toUpperCase(),
          extra_details: `Contact: ${formData.contactName} (${formData.title})\nType: ${formData.orgType}\nMission: ${formData.mission}\nInterests: ${formData.participationAreas.join(', ')}\nPayment Method: ${paymentMethod}\nReference: ${paymentReference || 'N/A'}`
        }, 
        '8AyYvWD6B6YNYm1tI'
      );

      // 3. Flip to Payment Screen or Success
      setStep(2);
      setStatus("idle"); 

    } catch (error) {
      console.error("Error registering organization: ", error);
      setStatus("error");
    }
  };

  const handleFinalPaymentConfirm = async () => {
    if (docId) {
      try {
        const docRef = doc(db, "registrations", docId);
        await updateDoc(docRef, {
          paymentMethod: paymentMethod,
          paymentReference: paymentReference || "None"
        });
      } catch (err) {
        console.error("Error updating payment info:", err);
      }
    }
    alert("Payment choice recorded successfully! Your organization's membership application is pending review.");
    setStep(3); // or redirect to success page
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">

        {step === 1 && (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-extrabold text-[#11235A] mb-4 uppercase">Membership Registration Form</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We invite Amhara organizations and community-based groups across the United States to join hands with us in building a stronger, united, and impactful Amhara community.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
              {status === "error" && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
                  <p className="font-bold">Error</p>
                  <p>There was a problem submitting your registration. Please try again.</p>
                </div>
              )}

              <form onSubmit={handleRegistrationSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  
                  {/* LEFT COLUMN */}
                  <div className="space-y-8">
                    {/* SECTION 1 */}
                    <div>
                      <h2 className="bg-[#11235A] text-white font-bold py-2 px-4 rounded inline-block mb-6 text-sm tracking-wide">1 ORGANIZATION INFORMATION</h2>
                      <div className="space-y-5 text-sm">
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">Organization Name *</label>
                          <input required type="text" className="w-full border-b border-gray-400 p-2 outline-none focus:border-[#11235A]" value={formData.organizationName} onChange={e => setFormData({...formData, organizationName: e.target.value})} />
                        </div>
                        
                        <div className="flex gap-4">
                          <div className="w-1/2">
                            <label className="text-xs text-gray-500 block mb-1">Date Established</label>
                            <input type="date" className="w-full border-b border-gray-400 p-2 outline-none focus:border-[#11235A]" value={formData.dateEstablished} onChange={e => setFormData({...formData, dateEstablished: e.target.value})} />
                          </div>
                          <div className="w-1/2">
                            <label className="text-xs text-gray-500 block mb-1">State of Operation</label>
                            <input type="text" className="w-full border-b border-gray-400 p-2 outline-none focus:border-[#11235A]" value={formData.stateOfOperation} onChange={e => setFormData({...formData, stateOfOperation: e.target.value})} />
                          </div>
                        </div>
                        
                        <div className="pt-2">
                          <p className="font-bold mb-3 text-gray-700">Organization Type:</p>
                          <div className="grid grid-cols-2 gap-3 text-gray-700">
                            <label className="cursor-pointer"><input type="radio" name="orgType" value="Nonprofit Organization" checked={formData.orgType === "Nonprofit Organization"} onChange={e => setFormData({...formData, orgType: e.target.value})} className="mr-2"/> Nonprofit Organization</label>
                            <label className="cursor-pointer"><input type="radio" name="orgType" value="Community-Based Organization" checked={formData.orgType === "Community-Based Organization"} onChange={e => setFormData({...formData, orgType: e.target.value})} className="mr-2"/> Community-Based Organization</label>
                            <label className="cursor-pointer"><input type="radio" name="orgType" value="Cultural Organization" checked={formData.orgType === "Cultural Organization"} onChange={e => setFormData({...formData, orgType: e.target.value})} className="mr-2"/> Cultural Organization</label>
                            <label className="cursor-pointer"><input type="radio" name="orgType" value="Other" checked={formData.orgType === "Other"} onChange={e => setFormData({...formData, orgType: e.target.value})} className="mr-2"/> Other</label>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">Mission / Purpose of Your Organization *</label>
                          <textarea required placeholder="Briefly describe mission..." rows={3} className="w-full border-b border-gray-400 p-2 outline-none focus:border-[#11235A]" value={formData.mission} onChange={e => setFormData({...formData, mission: e.target.value})}></textarea>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 3 */}
                    <div>
                      <h2 className="bg-[#11235A] text-white font-bold py-2 px-4 rounded inline-block mb-4 text-sm tracking-wide">3 MEMBERSHIP INFORMATION</h2>
                      <p className="text-sm text-gray-700 mb-3 italic">
                        "We wish to apply for membership in the Coalition of Amhara Associations in America and agree to support its mission and goals."
                      </p>
                      <p className="text-sm text-gray-700 mb-4 font-medium">Our organization is interested in participating in the following areas (check all that apply):</p>
                      <div className="space-y-3 text-sm text-gray-700">
                        <label className="flex items-center cursor-pointer"><input type="checkbox" value="Humanitarian & Development Support" onChange={handleCheckboxChange} className="mr-3 w-4 h-4"/> Humanitarian & Development Support</label>
                        <label className="flex items-center cursor-pointer"><input type="checkbox" value="Advocacy & Human Rights" onChange={handleCheckboxChange} className="mr-3 w-4 h-4"/> Advocacy & Human Rights</label>
                        <label className="flex items-center cursor-pointer"><input type="checkbox" value="Community Engagement & Mobilization" onChange={handleCheckboxChange} className="mr-3 w-4 h-4"/> Community Engagement & Mobilization</label>
                        <label className="flex items-center cursor-pointer"><input type="checkbox" value="Research, Policy & Information" onChange={handleCheckboxChange} className="mr-3 w-4 h-4"/> Research, Policy & Information</label>
                        <label className="flex items-center cursor-pointer"><input type="checkbox" value="Media, Culture & Communication" onChange={handleCheckboxChange} className="mr-3 w-4 h-4"/> Media, Culture & Communication</label>
                        <label className="flex items-center cursor-pointer"><input type="checkbox" value="Collaboration & Networking" onChange={handleCheckboxChange} className="mr-3 w-4 h-4"/> Collaboration & Networking</label>
                        <label className="flex items-center cursor-pointer"><input type="checkbox" value="Other" onChange={handleCheckboxChange} className="mr-3 w-4 h-4"/> Other</label>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN */}
                  <div className="space-y-8">
                    {/* SECTION 2 */}
                    <div>
                      <h2 className="bg-[#11235A] text-white font-bold py-2 px-4 rounded inline-block mb-6 text-sm tracking-wide">2 PRIMARY CONTACT INFORMATION</h2>
                      <div className="space-y-5 text-sm">
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">Contact Person *</label>
                          <input required type="text" className="w-full border-b border-gray-400 p-2 outline-none focus:border-[#11235A]" value={formData.contactName} onChange={e => setFormData({...formData, contactName: e.target.value})} />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">Title / Position *</label>
                          <input required type="text" className="w-full border-b border-gray-400 p-2 outline-none focus:border-[#11235A]" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">Phone *</label>
                          <input required type="tel" className="w-full border-b border-gray-400 p-2 outline-none focus:border-[#11235A]" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">Email *</label>
                          <input required type="email" className="w-full border-b border-gray-400 p-2 outline-none focus:border-[#11235A]" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">Website (if any)</label>
                          <input type="url" className="w-full border-b border-gray-400 p-2 outline-none focus:border-[#11235A]" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">Mailing Address *</label>
                          <textarea required rows={2} className="w-full border-b border-gray-400 p-2 outline-none focus:border-[#11235A]" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}></textarea>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 4 */}
                    <div>
                      <h2 className="bg-[#11235A] text-white font-bold py-2 px-4 rounded inline-block mb-2 text-sm tracking-wide">4 WHY DO YOU WANT TO JOIN?</h2>
                      <p className="text-xs text-gray-500 mb-2 italic">(Please briefly explain)</p>
                      <textarea required rows={4} className="w-full border-b border-gray-400 p-2 outline-none focus:border-[#11235A]" value={formData.reasonForJoining} onChange={e => setFormData({...formData, reasonForJoining: e.target.value})}></textarea>
                    </div>

                    {/* SECTION 5 */}
                    <div>
                      <h2 className="bg-[#11235A] text-white font-bold py-2 px-4 rounded inline-block mb-4 text-sm tracking-wide">5 AUTHORIZATION</h2>
                      <label className="flex items-start gap-3 text-sm mt-2 cursor-pointer p-4 bg-gray-50 rounded border border-gray-200">
                        <input required type="checkbox" className="mt-1 w-5 h-5" checked={formData.isAuthorized} onChange={e => setFormData({...formData, isAuthorized: e.target.checked})} />
                        <span className="text-gray-800 font-medium leading-relaxed">We certify that the information provided above is accurate and that our organization agrees to abide by the values, principles, and decisions of the Coalition.</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-12 text-center">
                  <button type="submit" disabled={status === "sending" || !formData.isAuthorized} className="w-full md:w-auto md:min-w-[300px] bg-[#11235A] text-white font-bold py-4 px-8 rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50 text-lg shadow-md">
                    {status === "sending" ? "Saving..." : "Continue to Payment ➔"}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}

        {/* STEP 2: PAYMENT SCREEN */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12 max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-extrabold text-[#11235A] mb-2">Complete Organization Membership</h1>
              <p className="text-gray-600">
                Thank you, <span className="font-bold text-gray-900">{formData.organizationName}</span>! Please select your preferred payment method below.
              </p>
            </div>

            {/* Payment Method Selector Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {[
                { id: "stripe", label: "Credit Card", icon: "💳" },
                { id: "paypal", label: "PayPal", icon: "🅿️" },
                { id: "cashapp", label: "Cash App", icon: "💚" },
                { id: "zelle", label: "Zelle", icon: "🏦" },
                { id: "check", label: "Mail Check", icon: "✉️" },
              ].map((opt) => {
                const isSelected = paymentMethod === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPaymentMethod(opt.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
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

            {/* Manual Payment Instructions & Reference Input */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-sm space-y-4 mb-8">
              <h3 className="font-bold text-[#11235A] text-base">Payment Details & Instructions</h3>
              <p className="text-gray-600">
                Please complete your transfer using one of the options below. Your registration details are saved securely.
              </p>
              
              <div className="space-y-2 text-gray-700">
                <p><strong>Zelle:</strong> payments@coalitiondomain.org</p>
                <p><strong>Cash App:</strong> $CAAA_Official</p>
                <p><strong>Check:</strong> Mail to 4390 King Street, Alexandria, VA 22302</p>
              </div>

              <div className="pt-2">
                <label className="block text-gray-700 font-bold mb-1 text-xs uppercase">Confirmation / Reference Number (If paying via Zelle/Cash App)</label>
                <input 
                  type="text" 
                  placeholder="Enter transaction reference ID" 
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  className="w-full p-3 border rounded bg-white text-gray-800 outline-none focus:border-[#11235A]"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleFinalPaymentConfirm}
                className="bg-[#136B32] text-white font-bold py-4 px-8 rounded-lg hover:bg-green-800 w-full transition-colors text-lg shadow-md"
              >
                Confirm Payment & Submit
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Registration Complete!</h2>
            <p className="text-gray-600 mb-6">
              Your organization's application has been received and logged successfully. Our team will review your details and payment reference shortly.
            </p>
            <Link href="/" className="inline-block bg-[#11235A] text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-900 transition-colors">
              Return to Homepage
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}