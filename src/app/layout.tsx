import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar'; // We import your new component here!
import Link from "next/link";
export const metadata: Metadata = {
  title: 'CAAA - Coalition of Amhara Associations in America',
  description: 'Uniting Amhara associations and organizations in America.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans text-gray-900 bg-[#fcfbf9] flex flex-col min-h-screen">
        
        {/* We use your new Navbar component right here! */}
        <Navbar />

        {/* --- DYNAMIC PAGE CONTENT --- */}
        <main className="flex-grow">
          {children}
        </main>

       {/* The Footer Area */}
        <footer className="bg-[#11235A] text-white py-8 mt-auto">
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
            
            <p className="text-sm text-gray-300">
              © {new Date().getFullYear()} Coalition of Amhara Associations in America. All rights reserved.
            </p>
            
            {/* The Subtle Admin Link */}
            <div className="mt-4 md:mt-0">
              <Link href="/admin" className="text-xs text-gray-400 hover:text-white transition-colors">
                Admin Access
              </Link>
            </div>

          </div>
        </footer>
      </body>
    </html>
  );
}