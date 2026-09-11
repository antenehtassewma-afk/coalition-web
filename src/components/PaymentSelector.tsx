"use client";
import { useState } from "react";

export default function PaymentSelector() {
  const [selectedMethod, setSelectedMethod] = useState("stripe");

  // List of all payment options with icons/labels
  const paymentOptions = [
    { id: "stripe", label: "Credit Card", icon: "💳", desc: "Pay securely with Visa, Mastercard, or Amex" },
    { id: "paypal", label: "PayPal", icon: "🅿️", desc: "Fast checkout using your PayPal account" },
    { id: "cashapp", label: "Cash App", icon: "💚", desc: "Pay via Cash App tag or QR code" },
    { id: "zelle", label: "Zelle", icon: "🏦", desc: "Direct bank transfer (Manual verification)" },
    { id: "check", label: "Mail Check", icon: "✉️", desc: "Send a physical check by mail" },
  ];

  return (
    <div className="space-y-6">
      <label className="block text-gray-800 font-bold text-lg">
        Select Payment Method
      </label>

      {/* Clickable Grid of Payment Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {paymentOptions.map((option) => {
          const isSelected = selectedMethod === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setSelectedMethod(option.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? "border-[#11235A] bg-blue-50/50 shadow-md ring-2 ring-[#11235A]/20"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div>
                <span className="text-3xl mb-2 block">{option.icon}</span>
                <span className={`font-bold text-sm block ${isSelected ? "text-[#11235A]" : "text-gray-800"}`}>
                  {option.label}
                </span>
              </div>
              <div className="mt-4 flex items-center">
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  isSelected ? "border-[#11235A] bg-[#11235A]" : "border-gray-300"
                }`}>
                  {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
                <span className="text-[10px] text-gray-500 ml-1.5">{isSelected ? "Selected" : "Select"}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* DYNAMIC INSTRUCTIONS / FIELDS BASED ON SELECTION */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mt-4">
        {selectedMethod === "stripe" && (
          <div>
            <h3 className="font-bold text-[#11235A] mb-2">Credit / Debit Card Payment</h3>
            <p className="text-sm text-gray-600 mb-4">Enter your card details below to complete your transaction instantly.</p>
            {/* Insert your Stripe Elements / Input Fields here */}
            <div className="p-3 bg-white border rounded-lg text-sm text-gray-400">[ Stripe Card Element Placeholder ]</div>
          </div>
        )}

        {selectedMethod === "paypal" && (
          <div>
            <h3 className="font-bold text-[#11235A] mb-2">PayPal Checkout</h3>
            <p className="text-sm text-gray-600 mb-4">Clicking submit will redirect you securely to finalize your payment through PayPal.</p>
          </div>
        )}

        {selectedMethod === "cashapp" && (
          <div>
            <h3 className="font-bold text-[#11235A] mb-2">Cash App Instructions</h3>
            <p className="text-sm text-gray-600 mb-2">Send your payment to our official Cash App tag:</p>
            <div className="bg-white p-3 border rounded-lg font-mono font-bold text-[#136B32] inline-block mb-3">
              $YourCoalitionTag
            </div>
            <p className="text-xs text-gray-500">Please enter your Cash App confirmation or receipt number below after sending.</p>
            <input type="text" placeholder="Enter Cash App Receipt ID" className="mt-2 w-full p-2 border rounded-lg bg-white" />
          </div>
        )}

        {selectedMethod === "zelle" && (
          <div>
            <h3 className="font-bold text-[#11235A] mb-2">Zelle Transfer Instructions</h3>
            <p className="text-sm text-gray-600 mb-2">Transfer your funds using our official Zelle details:</p>
            <div className="bg-white p-3 border rounded-lg font-mono text-sm text-gray-800 mb-3">
              <span className="font-bold">Email/Phone:</span> payments@yourcoalition.org
            </div>
            <p className="text-xs text-gray-500">After sending through your banking app, paste your Zelle confirmation number below for tracking:</p>
            <input type="text" placeholder="Enter Zelle Confirmation Number" className="mt-2 w-full p-2 border rounded-lg bg-white" />
          </div>
        )}

        {selectedMethod === "check" && (
          <div>
            <h3 className="font-bold text-[#11235A] mb-2">Mail a Physical Check</h3>
            <p className="text-sm text-gray-600 mb-2">Make checks payable to your coalition and mail them to:</p>
            <div className="bg-white p-3 border rounded-lg text-sm text-gray-800 font-medium">
              Coalition of Amhara Associations<br />
              1234 Coalition Way, Suite 100<br />
              Washington, DC 20001
            </div>
            <p className="text-xs text-gray-500 mt-2">Your registration/pledge will be marked as "Pending" until the check arrives and is deposited.</p>
          </div>
        )}
      </div>
    </div>
  );
}