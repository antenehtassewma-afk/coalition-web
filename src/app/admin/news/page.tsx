"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";

export default function AdminNewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "Press Release",
    publishDate: "",
    excerpt: "",
    content: ""
  });

  // Fetch existing news on load
  const fetchNews = async () => {
    try {
      const newsRef = collection(db, "news");
      const q = query(newsRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const liveNews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNews(liveNews);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Handle creating a new article
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");

    try {
      const newsRef = collection(db, "news");
      await addDoc(newsRef, {
        ...formData,
        createdAt: new Date() // Used for strict chronological sorting
      });

      setSuccessMessage("News article published successfully!");
      
      // Reset form
      setFormData({
        title: "",
        author: "",
        category: "Press Release",
        publishDate: "",
        excerpt: "",
        content: ""
      });

      // Refresh the list
      fetchNews();
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to publish article. Please check permissions.");
    } finally {
      setIsSubmitting(false);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  // Handle deleting an article
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this article? This cannot be undone.")) return;

    try {
      await deleteDoc(doc(db, "news", id));
      // Remove from UI without fetching again
      setNews(news.filter(article => article.id !== id));
    } catch (error) {
      console.error("Error deleting document: ", error);
      alert("Failed to delete article.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage News & Updates</h1>
          <p className="text-gray-600 mt-2">Create new press releases, announcements, and articles for the public feed.</p>
        </div>

        {/* CREATE NEWS FORM */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-xl font-bold text-[#11235A] mb-6 border-b pb-4">Publish New Article</h2>
          
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6 font-medium">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm">Article Title</label>
                <input required type="text" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#11235A] outline-none" placeholder="e.g., Annual Coalition Town Hall Announced" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
              </div>
              
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm">Author Name</label>
                <input required type="text" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#11235A] outline-none" placeholder="e.g., CAAA Leadership" value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm">Category</label>
                <select required className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#11235A] outline-none bg-white" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                  <option value="Press Release">Press Release</option>
                  <option value="Community Update">Community Update</option>
                  <option value="Action Alert">Action Alert</option>
                  <option value="Event Recap">Event Recap</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm">Visible Publish Date</label>
                <input required type="text" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#11235A] outline-none" placeholder="e.g., August 17, 2026" value={formData.publishDate} onChange={(e) => setFormData({...formData, publishDate: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">Short Excerpt</label>
              <textarea required rows={2} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#11235A] outline-none" placeholder="A brief 1-2 sentence summary for the main news feed..." value={formData.excerpt} onChange={(e) => setFormData({...formData, excerpt: e.target.value})} />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">Full Article Content</label>
              <textarea required rows={8} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#11235A] outline-none" placeholder="Write the complete article here..." value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} />
            </div>

            <button disabled={isSubmitting} type="submit" className="bg-[#11235A] text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50">
              {isSubmitting ? "Publishing..." : "Publish Article"}
            </button>
          </form>
        </div>

        {/* LIST EXISTING NEWS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Published Articles</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading articles...</div>
          ) : news.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No articles have been published yet.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {news.map((article) => (
                <li key={article.id} className="p-6 hover:bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="mb-4 md:mb-0">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded mb-2 inline-block">
                      {article.category}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900">{article.title}</h3>
                    <p className="text-sm text-gray-500">By {article.author} • {article.publishDate}</p>
                  </div>
                  <button 
                    onClick={() => handleDelete(article.id)}
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