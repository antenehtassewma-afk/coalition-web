"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Link from "next/link";

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const newsRef = collection(db, "news");
        const q = query(newsRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        const liveNews = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setNews(liveNews);
      } catch (error) {
        console.error("Error fetching news: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-[#11235A] text-xl font-bold animate-pulse">Loading Updates...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#11235A] mb-4">News & Updates</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Read the latest announcements, press releases, and stories from our coalition.
          </p>
        </div>

        {news.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No news updates yet</h3>
            <p className="text-gray-600">Check back soon for announcements from the leadership team.</p>
          </div>
        ) : (
          /* THIS IS THE NEW GRID LAYOUT */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((article) => (
              <article 
                key={article.id} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full overflow-hidden"
              >
                {/* Optional Image Placeholder (Matches Event Cards) */}
                <div className="h-4 bg-[#11235A] w-full"></div>

                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                      {article.category || "Update"}
                    </span>
                    <span className="text-sm font-medium text-gray-500">{article.publishDate}</span>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="text-sm text-gray-500 mb-4 font-medium">By {article.author}</p>
                  
                  {/* Excerpt with line-clamp so all cards stay the same height */}
                  <p className="text-gray-700 leading-relaxed mb-6 flex-grow line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="pt-6 border-t border-gray-100 mt-auto">
                    <Link 
                      href={`/news/${article.id}`}
                      className="inline-flex items-center text-[#136B32] font-bold hover:text-green-800 transition-colors w-full justify-between"
                    >
                      Read Full Article
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}