import Link from "next/link";

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center">
        {/* Icon (Optional) */}
        <div className="mx-auto w-16 h-16 bg-[#11235A]/10 text-[#11235A] rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold text-[#11235A] mb-4">
          Online Payments Coming Soon
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          We are currently finalizing our secure online payment gateway. Please check back shortly to make your donation or pledge online. Thank you for your support!
        </p>

        <Link 
          href="/" 
          className="inline-block bg-[#11235A] text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-900 transition-colors duration-200"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}