import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="relative bg-[#11235A] text-white py-24 lg:py-32 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop" 
            alt="Community Gathering" 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-[#FFC000] font-bold tracking-widest uppercase text-sm mb-4 block">
            Welcome to CAAA
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Coalition of Amhara Associations in America
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-gray-200 leading-relaxed">
            Uniting our voices, preserving our heritage, and empowering our community across the United States.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {/* Note: Update the href below to point to your actual registration page if it's different! */}
            <Link 
              href="/join" 
              className="bg-[#136B32] hover:bg-green-700 text-white font-bold py-4 px-8 rounded shadow-lg transition-transform hover:-translate-y-1"
            >
              Become a Member
            </Link>
            <Link 
              href="/events" 
              className="bg-white hover:bg-gray-100 text-[#11235A] font-bold py-4 px-8 rounded shadow-lg transition-transform hover:-translate-y-1"
            >
              View Upcoming Events
            </Link>
          </div>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-[#11235A] mb-4">Our Core Pillars</h2>
            <div className="w-24 h-1 bg-[#136B32] mx-auto rounded"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Pillar 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow border-t-4 border-t-[#11235A]">
              <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-[#11235A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Community Unification</h3>
              <p className="text-gray-600">Bringing together independent associations to create a stronger, unified voice for Amharas across America.</p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow border-t-4 border-t-[#136B32]">
              <div className="bg-green-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-[#136B32]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Cultural Preservation</h3>
              <p className="text-gray-600">Celebrating our rich history and passing down our vibrant heritage, language, and traditions to the next generation.</p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow border-t-4 border-t-[#FFC000]">
              <div className="bg-yellow-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Civic Advocacy</h3>
              <p className="text-gray-600">Engaging with local and national leaders to ensure our community's needs and concerns are addressed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links / Call to Action */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center">
          <h2 className="text-3xl font-extrabold text-[#11235A] mb-8">Stay Connected</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-xl p-10 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Latest News</h3>
              <p className="text-gray-600 mb-6">Read our latest press releases and coalition updates.</p>
              <Link href="/news" className="text-[#11235A] font-bold hover:underline">
                Read the News →
              </Link>
            </div>
            <div className="bg-[#11235A] rounded-xl p-10 text-white shadow-md">
              <h3 className="text-2xl font-bold mb-4">About Us</h3>
              <p className="text-gray-300 mb-6">Learn more about our mission and the leadership team driving the coalition forward.</p>
              <Link href="/about" className="text-[#FFC000] font-bold hover:underline">
                Discover Our Mission →
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}