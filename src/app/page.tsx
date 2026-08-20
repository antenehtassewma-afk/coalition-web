import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section (Image-Free, Solid Professional Gradient) */}
      <section className="bg-gradient-to-br from-[#11235A] to-[#1e3a8a] text-white py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Empowering the Amhara Community in America
          </h1>
          <p className="text-xl md:text-2xl font-medium mb-10 text-gray-200">
            A united voice for advocacy, heritage, and progress.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/join" className="bg-[#136B32] hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-transform hover:-translate-y-1">
              Join the Coalition
            </Link>
            <Link href="/donate" className="bg-white hover:bg-gray-100 text-[#11235A] font-bold py-3 px-8 rounded-lg shadow-lg transition-transform hover:-translate-y-1">
              Donate Now
            </Link>
          </div>
        </div>
      </section>

      {/* Three Interactive Cards Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* News Card */}
          <div className="bg-white rounded-xl shadow-md p-8 border-t-4 border-[#11235A] hover:shadow-xl transition-shadow">
            <div className="text-[#11235A] mb-4">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Latest News</h2>
            <p className="text-gray-600 mb-6">Stay updated with the latest announcements, press releases, and community updates from CAAA.</p>
            <Link href="/news" className="text-[#136B32] font-bold hover:underline flex items-center gap-2">
              Read Updates <span>&rarr;</span>
            </Link>
          </div>

          {/* Events Card */}
          <div className="bg-white rounded-xl shadow-md p-8 border-t-4 border-[#136B32] hover:shadow-xl transition-shadow">
            <div className="text-[#136B32] mb-4">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Upcoming Events</h2>
            <p className="text-gray-600 mb-6">Join us for cultural festivals, town halls, and community gatherings across the United States.</p>
            <Link href="/events" className="text-[#11235A] font-bold hover:underline flex items-center gap-2">
              View Calendar <span>&rarr;</span>
            </Link>
          </div>

          {/* Membership Card */}
          <div className="bg-white rounded-xl shadow-md p-8 border-t-4 border-yellow-500 hover:shadow-xl transition-shadow">
            <div className="text-yellow-600 mb-4">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Membership</h2>
            <p className="text-gray-600 mb-6">Become an official member or register your partner organization to strengthen our coalition.</p>
            <Link href="/join" className="text-yellow-600 font-bold hover:underline flex items-center gap-2">
              Register Now <span>&rarr;</span>
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}