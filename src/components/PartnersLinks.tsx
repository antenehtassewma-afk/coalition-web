// 1. YOUR REAL DATA: Each organization has its own unique name and web address
const uniquePartners = [
  { id: 1, name: "Atlanta Amhara Community", websiteUrl: "https://example.com" },
  { id: 2, name: "DC Metro Amhara Association", websiteUrl: "https://example.com" },
  { id: 3, name: "Chicago Amhara Unity Center", websiteUrl: "https://example.com" },
  // ... Paste all 34 unique organizations right here as you get them!
];

export default function PartnersLinks() {
  return (
    <section className="py-12 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#11235A] mb-2">Our Partner Organizations</h2>
          <p className="text-sm text-gray-600 max-w-xl mx-auto">
            Click any partner below to visit their official website.
          </p>
        </div>

        {/* The Template: React loops through your unique list automatically */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {uniquePartners.map((partner) => (
            <a
              key={partner.id}
              href={partner.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-50 hover:bg-[#11235A] text-gray-800 hover:text-white border border-gray-200 text-xs sm:text-sm font-medium py-2.5 px-3 rounded-lg shadow-sm transition-all duration-200 flex items-center justify-between group text-center"
            >
              <span className="truncate w-full">{partner.name}</span>
              <span className="text-[10px] opacity-60 group-hover:opacity-100 ml-1">↗</span>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}