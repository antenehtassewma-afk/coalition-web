"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default function GalleryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const ref = collection(db, "gallery");
        const q = query(ref, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-purple-700 text-xl font-bold animate-pulse">Loading Gallery...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#11235A] mb-4">Gallery & Blog</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore photos, cultural stories, and reflections from our community.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No posts yet</h3>
            <p className="text-gray-600">Check back soon for photos and stories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <article key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                
                {/* Render image if URL exists, otherwise show a colored bar */}
                {item.imageUrl ? (
                  <div className="h-48 w-full bg-gray-200 overflow-hidden">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="h-4 bg-purple-700 w-full"></div>
                )}

                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                      {item.category}
                    </span>
                    <span className="text-sm font-medium text-gray-500">{item.date}</span>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {item.title}
                  </h2>
                  
                  <p className="text-gray-700 leading-relaxed flex-grow whitespace-pre-wrap">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}