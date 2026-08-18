"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import Link from "next/link";

export default function AdminGalleryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    category: "Photo Gallery",
    imageUrl: "",
    description: ""
  });

  const fetchGallery = async () => {
    try {
      const ref = collection(db, "gallery");
      const q = query(ref, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const liveItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(liveItems);
    } catch (error) {
      console.error("Error fetching gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");

    try {
      const ref = collection(db, "gallery");
      await addDoc(ref, {
        ...formData,
        createdAt: new Date()
      });

      setSuccessMessage("Gallery/Blog post published successfully!");
      setFormData({ title: "", date: "", category: "Photo Gallery", imageUrl: "", description: "" });
      fetchGallery();
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to publish post.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await deleteDoc(doc(db, "gallery", id));
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting post: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Gallery & Blog</h1>
            <p className="text-gray-600 mt-2">Share photos, cultural stories, and event recaps.</p>
          </div>
          <Link href="/admin" className="text-[#11235A] font-bold hover:underline">
            ← Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-xl font-bold text-purple-700 mb-6 border-b pb-4">Publish New Post</h2>
          
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6 font-medium">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm">Post Title</label>
                <input required type="text" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none" placeholder="e.g., Highlights from Ashenda Festival" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm">Date</label>
                <input required type="text" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none" placeholder="e.g., August 2026" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm">Category</label>
                <select required className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none bg-white" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                  <option value="Photo Gallery">Photo Gallery</option>
                  <option value="Blog Post">Blog Post</option>
                  <option value="Video Feature">Video Feature</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm">Image URL (Optional)</label>
                <input type="text" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none" placeholder="https://link-to-your-image.com/photo.jpg" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">Description / Story</label>
              <textarea required rows={4} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none" placeholder="Tell the story or describe the gallery..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </div>

            <button disabled={isSubmitting} type="submit" className="bg-purple-700 text-white font-bold py-3 px-8 rounded-lg hover:bg-purple-900 transition-colors disabled:opacity-50">
              {isSubmitting ? "Publishing..." : "Publish Post"}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Published Galleries & Blogs</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : items.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No posts yet.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {items.map((item) => (
                <li key={item.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="mb-4 md:mb-0">
                    <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded mb-2 inline-block">{item.category}</span>
                    <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.date}</p>
                  </div>
                  <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:bg-red-50 font-bold text-sm px-4 py-2 rounded transition-colors">
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