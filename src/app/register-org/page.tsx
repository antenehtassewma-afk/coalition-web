"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import emailjs from "@emailjs/browser";

export default function RegisterOrgPage() {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState("idle");

  // Expanded state to match registration-form.jpeg
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
    membershipType: "Partner Organization" // Kept for backend reference
  });

  // Handler for the Section 3 checkboxes (adds/removes from array)
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
      // 1. Save all fields to Firebase
      const regRef = collection(db, "registrations");
      await addDoc(regRef, {
        ...formData,
        submittedAt: new Date(),
        status: "pending_payment"
      });

      // 2. Fire the EmailJS Admin Notification with expanded details
      await emailjs.send(
        'service_b89yzbu', 
        'template_ydgkgcq', 
        {
          registration_type: formData.membershipType,
          name: formData.organizationName,
          email: formData.email,
          phone: formData.phone,
          extra_details: `Contact: ${formData.contactName} (${formData.title})\nType: ${formData.orgType}\nMission: ${formData.mission}\nInterests: ${formData.participationAreas.join(', ')}\nReason: ${formData.reasonForJoining}`
        }, 
        '8AyYvWD6B6YNYm1tI'
      );
      console.log("Admin email sent successfully.");

      // 3. Flip to Payment Screen
      setStep(2);
      setStatus("idle"); 

    } catch (error) {
      console.error("Error registering organization: ", error);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">

        {/* =========================================
            STEP 1: THE REGISTRATION FORM 
            ========================================= */}
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
                      <h2 className="bg-[#11235A] text-white font-bold py-2 px-4 rounded inline-block mb-6">1 ORGANIZATION INFORMATION</h2>
                      <div className="space-y-5 text-sm">
                        <input required type="text" placeholder="Organization Name *" className="w-full border-b border-gray-400 p-2 outline-none focus:border-[#11235A]" value={formData.organizationName} onChange={e => setFormData({...formData, organizationName: e.target.value})} />
                        
                        <div className="flex gap-4">
                          <div className="w-1/2">
                            <label className="text-xs text-gray-500 block mb-1">Date Established</label>
                            <input type="date" className="w-full border-b border-gray-400 p-2 outline-none focus:border-[#11235A]" value={formData.dateEstablished} onChange={e => setFormData({...formData, dateEstablished: e.target.value})} />
                          </div>
                          <div className="w-1/2 flex items-end">
                            <input type="text" placeholder="State of Operation" className="w-full border-b border-gray-400 p-2 outline-none focus:border-[#11235A]" value={formData.stateOfOperation} onChange={e => setFormData({...formData, stateOfOperation: e.target.value})} />
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
                        
                        <textarea required placeholder="Mission / Purpose of Your Organization *" rows={3} className="w-full border-b border-gray-400 p-2 outline-none focus:border-[#11235A] mt-4" value={formData.mission} onChange={e => setFormData({...formData, mission: e.target.value})}></textarea>
                      </div>
                    </div>

                    {/* SECTION 3 */}
                    <div>
                      <h2 className="bg-[#11235A] text-white font-bold py-2 px-4 rounded inline-block mb-4">3 MEMBERSHIP INFORMATION</h2>
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
                      <h2 className="bg-[#11235A] text-white font-bold py-2 px-4 rounded inline-block mb-6">2 PRIMARY CONTACT INFORMATION</h2>
                      <div className="space-y-5 text-sm">
                        <input required type="text" placeholder="Contact Person *" className="w-full border-b border-gray-400 p-2 outline-none focus:border-[#11235A]" value={formData.contactName} onChange={e => setFormData({...formData, contactName: e.target.value})} />
                        <input required type="text" placeholder="Title / Position *" className="w-full border-b border-gray-400 p-2 outline-none focus:border-[#11235A]" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                        <input required type="tel" placeholder="Phone *" className="w-full border-b border-gray-400 p-2 outline-none focus:border-[#11235A]" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                        <input required type="email" placeholder="Email *" className="w-full border-b border-gray-400 p-2 outline-none focus:border-[#11235A]" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                        <input type="url" placeholder="Website (if any)" className="w-full border-b border-gray-400 p-2 outline-none focus:border-[#11235A]" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} />
                        <textarea required placeholder="Mailing Address *" rows={2} className="w-full border-b border-gray-400 p-2 outline-none focus:border-[#11235A]" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}></textarea>
                      </div>
                    </div>

                    {/* SECTION 4 */}
                    <div>
                      <h2 className="bg-[#11235A] text-white font-bold py-2 px-4 rounded inline-block mb-4">4 WHY DO YOU WANT TO JOIN?</h2>
                      <p className="text-sm text-gray-500 mb-2 italic">(Please briefly explain)</p>
                      <textarea required rows={4} className="w-full border-b border-gray-400 p-2 outline-none focus:border-[#11235A]" value={formData.reasonForJoining} onChange={e => setFormData({...formData, reasonForJoining: e.target.value})}></textarea>
                    </div>

                    {/* SECTION 5 */}
                    <div>
                      <h2 className="bg-[#11235A] text-white font-bold py-2 px-4 rounded inline-block mb-4">5 AUTHORIZATION</h2>
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

        {/* =========================================
            STEP 2: THE PAYMENT SCREEN 
            ========================================= */}
        {step === 2 && (
          <div className="text-center animate-fade-in bg-white rounded-2xl shadow-sm border border-gray-200 p-12 mt-8 max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold text-[#11235A] mb-4">Complete Organization Membership</h1>
            
            <p className="text-xl mb-8 text-gray-600">Thank you, <span className="font-bold text-gray-900">{formData.organizationName}</span>! Choose how you would like to pay.</p>

            <div className="max-w-md mx-auto space-y-4">
              <button className="w-full p-4 bg-gray-900 text-white rounded font-bold hover:bg-gray-800 transition-colors">
                💳 Pay with Credit Card (Stripe)
              </button>

              <button className="w-full p-4 bg-[#0070ba] text-white rounded font-bold hover:bg-[#005ea6] transition-colors">
                Pay with PayPal
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
    </div>
  );
}