'use client';
import { useState, useEffect } from "react";

export default function Profile() {
  const [formData, setFormData] = useState({
    name: "",
    playerId: "",
    email: "",
    country: "",
    bio: "",
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedData = {
      name: localStorage.getItem("name") || "",
      playerId: localStorage.getItem("playerId") || "",
      email: localStorage.getItem("email") || "",
      country: localStorage.getItem("country") || "",
      bio: localStorage.getItem("bio") || "",
    };
    setFormData(storedData);
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Save data to localStorage on form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("name", formData.name);
    localStorage.setItem("playerId", formData.playerId);
    localStorage.setItem("email", formData.email);
    localStorage.setItem("country", formData.country);
    localStorage.setItem("bio", formData.bio);
    alert("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center md:bg-gray-100 py-5">
      <div className="bg-white md:shadow-lg rounded-lg py-6 px-6 md:px-10 w-full max-w-2xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-700 pt-10 pb-5">Profile</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Your Name"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="playerId" className="block text-sm font-medium text-gray-700">
              User Name
            </label>
            <input
              id="playerId"
              type="text"
              value={formData.playerId}
              onChange={handleChange}
              placeholder="No_Space123"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@gmail.com"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <select
              id="country"
              value={formData.country}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a country</option>
              <option value="Bangladesh">Bangladesh</option>
              <option value="India">India</option>
              <option value="USA">USA</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Write your bio..."
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              rows="3"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full mb-8 mt-5 bg-gray-700 text-white py-3 rounded-lg shadow hover:bg-gray-500 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
