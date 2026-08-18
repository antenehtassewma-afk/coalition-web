import Link from "next/link";
export default function PaymentPending() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-10 rounded-2xl shadow-lg text-center max-w-lg">
        <h1 className="text-3xl font-bold text-[#11235A] mb-4">Registration Received!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for registering. Our team is reviewing your application. 
          A representative will contact you shortly with the secure payment link 
          to finalize your partnership.
        </p>
        <a href="/" className="text-[#11235A] font-bold underline">Return Home</a>
      </div>
    </div>
  );
}