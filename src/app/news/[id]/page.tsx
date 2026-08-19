"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function SingleNewsArticle() {
  const params = useParams();
  const [article, setArticle] = useState(null);
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
        <a href="/news" className="text-blue-600 font-bold hover:underline">
          ← Back to News Feed
        </a>
      </div>
    );
  }

  return (
    
      
        
        
          
          Back to all updates
        

        
          
            
              {article.category}
            
            {article.publishDate}
          

          
            {article.title}
          
          
          
            
              By {article.author}
            
          

          
            {article.content}
          
        

      
    
  );
}