"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 1. TOP HEADER */}
      <header className="container mx-auto px-4 py-4 md:py-6 flex justify-between items-center gap-4 bg-white relative z-50">
        
        {/* Logo & Text */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="w-16 h-16 md:w-24 md:h-24  rounded-full border-2 border-yellow-500 flex items-center justify-center bg-gray-50 overflow-hidden relative shadow-sm shrink-0">
             <Image src="/coalition-amhara.jpeg" alt="CAAA Logo" fill className="object-contain p-2" />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-[#11235A] tracking-wide mb-1">CAAA</h1>
            <p className="hidden sm:block text-[12px] md:text-[15px] font-bold text-gray-800 uppercase tracking-wider leading-tight">
              Coalition of Amhara<br />Associations in America
            </p>
          </div>
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/donate" className="bg-[#136B32] text-white px-6 py-3 rounded-md text-sm font-bold flex items-center gap-2 hover:bg-green-800 transition-colors shadow-sm">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            DONATE
          </Link>
        <div className="flex items-center space-x-3">
  <Link 
    href="/pledge" 
    className="hidden md:inline-block bg-white text-[#11235A] font-bold py-2 px-5 rounded-lg border-2 border-[#11235A] hover:bg-gray-50 transition-colors"
  >
    Pledge
  </Link>
</div>
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          className="md:hidden p-2 text-[#11235A] hover:bg-gray-100 rounded-md"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>
      </header>

      {/* 2. DESKTOP NAVIGATION BAR */}
      <nav className="hidden md:block border-t border-b border-gray-200 bg-white relative z-40">
        <div className="container mx-auto px-4">
          <ul className="flex flex-wrap justify-center space-x-6 md:space-x-10 py-4 text-[13px] font-extrabold text-gray-800 uppercase tracking-widest">
            <li className="cursor-pointer hover:text-[#136B32] transition-colors"><Link href="/">HOME</Link></li>
            <li className="cursor-pointer hover:text-[#136B32] transition-colors"><Link href="/about">ABOUT US</Link></li>

            {/* Hover Dropdown (Now includes Gallery) */}
            <li className="relative group cursor-pointer hover:text-[#136B32] transition-colors">
              <div className="flex items-center gap-1 pb-1">
                NEWS & EVENTS
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-64 bg-white border border-gray-200 shadow-xl rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-left">
                <Link href="/news" className="flex items-start p-4 hover:bg-gray-50 border-b border-gray-100 transition-colors">
                  <div>
                    <div className="font-bold text-gray-900 capitalize text-sm">News</div>
                    <div className="text-xs text-gray-500 font-normal normal-case mt-1">Latest updates and announcements</div>
                  </div>
                </Link>
                <Link href="/events" className="flex items-start p-4 hover:bg-gray-50 border-b border-gray-100 transition-colors">
                  <div>
                    <div className="font-bold text-gray-900 capitalize text-sm">Events</div>
                    <div className="text-xs text-gray-500 font-normal normal-case mt-1">Upcoming and past events</div>
                  </div>
                </Link>
                <Link href="/gallery" className="flex items-start p-4 hover:bg-gray-50 transition-colors">
                  <div>
                    <div className="font-bold text-gray-900 capitalize text-sm">Gallery</div>
                    <div className="text-xs text-gray-500 font-normal normal-case mt-1">Photos and event memories</div>
                  </div>
                </Link>
              </div>
            </li>

            {/* <li className="cursor-pointer hover:text-[#136B32] transition-colors"><Link href="/register">MEMBERSHIP</Link></li> */}
          {/* The clean Gateway Link */}
<Link href="/join" className="cursor-pointer hover:text-[#136B32] transition-colors">
  Join Us
</Link>
            <li className="cursor-pointer hover:text-[#136B32] transition-colors"><Link href="/get-involved">GET INVOLVED</Link></li>
            <li className="cursor-pointer hover:text-[#136B32] transition-colors"><Link href="/contact">CONTACT US</Link></li>
          </ul>
        </div>
      </nav>

      {/* 3. MOBILE SLIDE-DOWN MENU */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-xl absolute w-full z-40">
          <ul className="flex flex-col text-[14px] font-extrabold text-[#11235A] uppercase tracking-widest divide-y divide-gray-100">
            <li><Link href="/" className="block py-4 px-6 hover:bg-gray-50" onClick={() => setIsOpen(false)}>HOME</Link></li>
            <li><Link href="/about" className="block py-4 px-6 hover:bg-gray-50" onClick={() => setIsOpen(false)}>ABOUT US</Link></li>
            {/* Mobile links grouped together */}
            <li><Link href="/news" className="block py-4 px-6 hover:bg-gray-50 text-[#136B32]" onClick={() => setIsOpen(false)}>NEWS</Link></li>
            <li><Link href="/events" className="block py-4 px-6 hover:bg-gray-50 text-[#136B32]" onClick={() => setIsOpen(false)}>EVENTS</Link></li>
            <li><Link href="/gallery" className="block py-4 px-6 hover:bg-gray-50 text-[#136B32]" onClick={() => setIsOpen(false)}>GALLERY</Link></li>
            
            <li><Link href="/get-involved" className="block py-4 px-6 hover:bg-gray-50" onClick={() => setIsOpen(false)}>GET INVOLVED</Link></li>
            <li><Link href="/contact" className="block py-4 px-6 hover:bg-gray-50" onClick={() => setIsOpen(false)}>CONTACT US</Link></li>
            
            <li className="p-6 bg-gray-50 flex flex-col gap-3">
              <Link href="/donate" className="bg-[#136B32] text-white px-6 py-3 rounded-md text-sm font-bold flex items-center justify-center gap-2 shadow-sm w-full" onClick={() => setIsOpen(false)}>DONATE</Link>
              {/* <Link href="/register" className="bg-[#FFC000] text-[#11235A] px-5 py-3 rounded-md text-sm font-bold flex items-center justify-center gap-2 shadow-sm w-full text-center" onClick={() => setIsOpen(false)}>REGISTER / BECOME A MEMBER</Link> */}
            </li>
          </ul>
          <Link 
    href="/join" 
    className="block w-full text-center bg-gray-100 text-[#11235A] font-bold py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
  >
    Join the Coalition
  </Link>

  <Link 
    href="/pledge" 
    className="block w-full text-center bg-white text-[#11235A] font-bold py-3 px-4 rounded-lg border-2 border-[#11235A] hover:bg-gray-50 transition-colors"
  >
    Make a Pledge
  </Link>
        </div>
      )}
    </>
  );
}