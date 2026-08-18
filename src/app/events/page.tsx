"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default function EventsPage() {
  // 1. State to hold the live events
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. Fetch the data when the page loads
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Point to the events folder, and order them by newest first!
        const eventsRef = collection(db, "events");
        const q = query(eventsRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        const liveEvents = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setEvents(liveEvents);
      } catch (error) {
        console.error("Error fetching events: ", error);
      } finally {
        setLoading(false); // Turn off the loading screen
      }
    };

    fetchEvents();
  }, []);

  // 3. Show a loading screen while Firebase grabs the data
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-[#11235A] text-xl font-bold animate-pulse">
          Loading Upcoming Events...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#11235A] mb-4">
            Upcoming Events
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay connected with the community. Discover upcoming cultural festivals, town halls, and member gatherings.
          </p>
        </div>

        {/* Live Events Feed */}
        <div className="space-y-8">
          {events.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No upcoming events</h3>
              <p className="text-gray-600">Check back soon for new coalition gatherings and festivals!</p>
            </div>
          ) : (
            events.map((event) => (
              <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col md:flex-row">
                
                {/* Left Side: Date Block */}
                <div className="bg-[#11235A] text-white p-6 md:w-48 flex flex-col justify-center items-center text-center shrink-0">
                  <span className="text-sm font-bold uppercase tracking-wider text-[#FFC000] mb-1">{event.category}</span>
                  {/* Safely split the date just in case they didn't format it perfectly */}
                  <span className="text-3xl font-extrabold mb-1">{event.date?.split(',')[0] || event.date}</span>
                  <span className="text-sm">{event.date?.split(',')[1] || ''}</span>
                </div>

                {/* Right Side: Event Details */}
                <div className="p-6 md:p-8 flex-grow flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h2>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center text-gray-600 mb-4 space-y-2 sm:space-y-0 sm:space-x-6 text-sm font-medium">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-[#136B32]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        {event.time}
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-[#136B32]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        {event.location}
                      </div>
                    </div>
                    
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {event.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <button className="text-[#136B32] font-bold hover:text-green-800 transition-colors flex items-center">
                      RSVP / Learn More
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}