"use client";

import { useState } from "react";
import { db } from "../../lib/firebase"; // Your database connection
import { collection, addDoc } from "firebase/firestore"; // Firebase tools
export default function ContactPage() {
  // 1. Hold the data the user types
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // 2. Track whether the form is sending or successful
  const [status, setStatus] = useState("idle"); // 'idle', 'sending', 'success', or 'error'

  // 3. The Firebase Magic Function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the page from refreshing
    setStatus("sending");

    try {
      // Point to a folder called "contactMessages" in your database
      const messagesRef = collection(db, "contactMessages");
      
      // Add a new document to that folder
      await addDoc(messagesRef, {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        createdAt: new Date(), // Automatically saves the exact time!
      });

      setStatus("success");
      setFormData({ name: "", email: "", message: "" }); // Clear the form

    } catch (error) {
      console.error("Error adding document: ", error);
      setStatus("error");
    }
  };

  // ... (Your UI code goes here below)
 return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-extrabold text-[#11235A] mb-8">Contact Us</h1>

      {/* Show a success message if it worked */}
      {status === "success" && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          Thank you! Your message has been securely sent to the coalition.
        </div>
      )}

      {/* The Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
          <input 
            required
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#136B32]"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input 
            required
            type="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#136B32]"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Message</label>
          <textarea 
            required
            rows={5}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#136B32]"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
        </div>

        <button 
          type="submit" 
          disabled={status === "sending"}
          className="bg-[#FFC000] text-[#11235A] font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline hover:bg-yellow-500 w-full disabled:opacity-50 transition-colors"
        >
          {status === "sending" ? "Sending securely..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}