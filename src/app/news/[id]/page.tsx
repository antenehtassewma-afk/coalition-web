"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function SingleNewsArticle() {
  const params = useParams();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!params.id) return;
      
      try {
        // Ask Firebase for one specific document using the ID from the URL
        const docRef = doc(db, "news", params.id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setArticle({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-bold text-[#11235A]">
        Loading Article...
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-[#11235A] mb-4">Article Not Found</h1>
        <Link href="/news" className="text-blue-600 font-bold hover:underline">
          ← Back to News Feed
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <Link href="/news" className="text-[#11235A] font-bold hover:underline mb-8 inline-block">
          ← Back to all updates
        </Link>

        {/* Article Container */}
        <article className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
          
          {/* Metadata: Category & Date */}
          <div className="flex items-center space-x-4 mb-6 text-sm">
            <span className="bg-[#11235A] text-white px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              {article.category || "Update"}
            </span>
            <span className="text-gray-500 font-medium">
              {article.publishDate}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Author */}
          <div className="border-b border-gray-200 pb-6 mb-8">
            <p className="text-gray-600 font-medium">
              By <span className="text-gray-900 font-bold">{article.author || "Coalition Admin"}</span>
            </p>
          </div>

          {/* Main Content */}
          <div className="prose prose-lg max-w-none text-gray-800 whitespace-pre-wrap leading-relaxed">
            {article.content}
          </div>

        </article>

      </div>
    </div>
  );
}