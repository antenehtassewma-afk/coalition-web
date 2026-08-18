import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#11235A] mb-4">
            About the Coalition
          </h1>
          <div className="w-24 h-1 bg-[#136B32] mx-auto rounded mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            The Coalition of Amhara Associations in America (CAAA) is a unified voice dedicated to the preservation, advocacy, and empowerment of the Amhara community.
          </p>
        </div>

        {/* Mission & Vision Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-10 rounded-2xl shadow-sm border-t-4 border-t-[#11235A] hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              To bring together independent Amhara organizations across the United States to foster unity, preserve our rich cultural heritage, and advocate for the rights and well-being of the Amhara people globally.
            </p>
          </div>
          
          <div className="bg-white p-10 rounded-2xl shadow-sm border-t-4 border-t-[#136B32] hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-700 leading-relaxed">
              A strong, resilient, and deeply connected Amhara diaspora that actively contributes to the prosperity of our communities here in America while serving as a powerful advocate for our people back home.
            </p>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="bg-[#11235A] text-white rounded-2xl p-10 md:p-16 text-center mb-16 shadow-lg">
          <h2 className="text-3xl font-bold mb-12">Our Core Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-4">
              <div className="text-[#FFC000] text-5xl mb-4">🤝</div>
              <h3 className="text-xl font-bold mb-3">Unity</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Standing together to amplify our voice and achieve common goals. We believe our strength lies in our collaboration.
              </p>
            </div>
            
            <div className="p-4">
              <div className="text-[#FFC000] text-5xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold mb-3">Advocacy</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Defending the rights, dignity, and interests of our community. We are committed to standing up for justice.
              </p>
            </div>
            
            <div className="p-4">
              <div className="text-[#FFC000] text-5xl mb-4">🏛️</div>
              <h3 className="text-xl font-bold mb-3">Heritage</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Preserving and passing down our profound history, language, and culture to the next generation.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white border border-gray-200 rounded-2xl p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Want to be part of the movement?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you are representing an organization or joining as an individual, your voice matters. Connect with us today.
          </p>
          <Link 
            href="/join" 
            className="inline-block bg-[#136B32] text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors"
          >
            Become a Member
          </Link>
        </div>

      </div>
    </div>
  );
}