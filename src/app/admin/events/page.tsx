"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import Link from "next/link";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: ""
  });

  // Fetch existing events
  const fetchEvents = async () => {
    try {
      const eventsRef = collection(db, "events");
      const q = query(eventsRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const liveEvents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(liveEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle creating a new event
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");

    try {
      const eventsRef = collection(db, "events");
      await addDoc(eventsRef, {
        ...formData,
        createdAt: new Date() // For sorting
      });

      setSuccessMessage("Event published successfully!");
      
      // Reset form
      setFormData({
        title: "",
        date: "",
        time: "",
        location: "",
        description: ""
      });

      // Refresh the list
      fetchEvents();
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to publish event. Please check permissions.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  // Handle deleting an event
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await deleteDoc(doc(db, "events", id));
      setEvents(events.filter(event => event.id !== id));
    } catch (error) {
      console.error("Error deleting event: ", error);
      alert("Failed to delete event.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Events</h1>
            <p className="text-gray-600 mt-2">Create upcoming town halls, festivals, and community gatherings.</p>
          </div>
          <Link href="/admin" className="text-[#11235A] font-bold hover:underline">
            ← Back to Dashboard
          </Link>
        </div>

        {/* CREATE EVENT FORM */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-xl font-bold text-[#136B32] mb-6 border-b pb-4">Publish New Event</h2>
          
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6 font-medium">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-bold mb-2 text-sm">Event Title</label>
                <input required type="text" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#136B32] outline-none" placeholder="e.g., Annual Cultural Festival" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
              </div>
              
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm">Date</label>
                <input required type="text" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#136B32] outline-none" placeholder="e.g., August 23, 2026" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm">Time</label>
                <input required type="text" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#136B32] outline-none" placeholder="e.g., 2:00 PM - 8:00 PM" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">Location</label>
              <input required type="text" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#136B32] outline-none" placeholder="e.g., 4390 King Street, Alexandria, VA" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">Event Description</label>
              <textarea required rows={5} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#136B32] outline-none" placeholder="Describe the event, special guests, or what attendees should bring..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </div>

            <button disabled={isSubmitting} type="submit" className="bg-[#136B32] text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50">
              {isSubmitting ? "Publishing..." : "Publish Event"}
            </button>
          </form>
        </div>

        {/* LIST EXISTING EVENTS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Upcoming & Past Events</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading events...</div>
          ) : events.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No events have been published yet.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {events.map((event) => (
                <li key={event.id} className="p-6 hover:bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-500">{event.date} • {event.time}</p>
                    <p className="text-sm text-gray-500">{event.location}</p>
                  </div>
                  <button 
                    onClick={() => handleDelete(event.id)}
                    className="text-red-600 hover:text-red-800 font-bold text-sm bg-red-50 hover:bg-red-100 px-4 py-2 rounded transition-colors"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}