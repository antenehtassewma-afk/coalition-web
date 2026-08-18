import Link from "next/link";

export default function JoinGatewayPage() {
  return (
    <div className="min-h-[70vh] bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#11235A] mb-4">
          Join the Coalition
        </h1>
        <p className="text-xl text-gray-600">
          Whether you are an individual wanting to support the cause, or a local association looking to officially partner with us, there is a place for you here. How would you like to join?
        </p>
      </div>

      {/* The Two Gateway Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full">
        
        {/* Card 1: Individual */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-[#136B32]">
          <div className="bg-green-100 p-4 rounded-full mb-6">
            {/* User Icon */}
            <svg className="w-12 h-12 text-[#136B32]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#11235A] mb-3">Individual Member</h2>
          <p className="text-gray-600 mb-8 flex-grow">
            Join as an individual supporter. Get exclusive updates, attend community events, and add your voice to the coalition.
          </p>
          <Link 
            href="/register" 
            className="w-full bg-[#136B32] text-white font-bold py-4 px-6 rounded-lg focus:outline-none hover:bg-green-700 transition-colors"
          >
            Register as an Individual
          </Link>
        </div>

        {/* Card 2: Organization */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-[#11235A]">
          <div className="bg-blue-100 p-4 rounded-full mb-6">
            {/* Building/Org Icon */}
            <svg className="w-12 h-12 text-[#11235A]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#11235A] mb-3">Partner Organization</h2>
          <p className="text-gray-600 mb-8 flex-grow">
            Register your local association, business, or community group to become an official, recognized partner of the coalition.
          </p>
          <Link 
            href="/register-org" 
            className="w-full bg-[#11235A] text-white font-bold py-4 px-6 rounded-lg focus:outline-none hover:bg-blue-900 transition-colors"
          >
            Register Your Organization
          </Link>
        </div>

      </div>
    </div>
  );
}