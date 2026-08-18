import Link from 'next/link';

export default function GetInvolvedPage() {
  return (
    <div className="bg-[#fcfbf9] min-h-screen font-sans text-gray-900">
      
      {/* 1. PAGE HERO HEADER */}
      <section className="bg-[#11235A] text-white py-20 border-b-8 border-[#136B32]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-wide">Get Involved</h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Your time, resources, and voice can make a massive difference. Discover how you can support our mission and uplift the community.
          </p>
        </div>
      </section>

      {/* 2. WAYS TO HELP GRID */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Volunteer */}
            <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="w-20 h-20 bg-[#136B32]/10 text-[#136B32] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-[#11235A] mb-4">Volunteer</h3>
              <p className="text-gray-600 mb-8 text-sm leading-relaxed">
                Join our dedicated team of volunteers. Whether it is helping at the upcoming August festival or assisting with daily operations, we need your skills.
              </p>
              <Link href="/contact" className="inline-block bg-[#11235A] text-white font-bold px-6 py-2 rounded hover:bg-blue-900 transition-colors uppercase tracking-wider text-sm">
                Apply Now
              </Link>
            </div>

            {/* Partner */}
            <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow transform md:-translate-y-4 border-t-4 border-t-[#FFC000]">
              <div className="w-20 h-20 bg-[#FFC000]/20 text-[#11235A] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-[#11235A] mb-4">Partner With Us</h3>
              <p className="text-gray-600 mb-8 text-sm leading-relaxed">
                We are actively seeking regional Amhara associations and corporate sponsors who share our vision to formally join the coalition network.
              </p>
              <Link href="/register" className="inline-block bg-[#FFC000] text-[#11235A] font-bold px-6 py-2 rounded hover:bg-yellow-500 transition-colors uppercase tracking-wider text-sm">
                Become a Member
              </Link>
            </div>

            {/* Donate */}
            <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="w-20 h-20 bg-[#136B32]/10 text-[#136B32] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-[#11235A] mb-4">Donate</h3>
              <p className="text-gray-600 mb-8 text-sm leading-relaxed">
                Your financial contributions directly fund our humanitarian efforts, cultural preservation programs, and community advocacy initiatives.
              </p>
              <Link href="/donate" className="inline-block bg-[#136B32] text-white font-bold px-6 py-2 rounded hover:bg-green-700 transition-colors uppercase tracking-wider text-sm">
                Make a Gift
              </Link>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}