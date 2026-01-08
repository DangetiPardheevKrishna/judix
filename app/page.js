"use client";

import { useState, useEffect } from "react";
import { FiSearch, FiCalendar, FiUser, FiArrowRight } from "react-icons/fi";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/context/authContext";
import PostList from "@/components/PostList";
export default function AllPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const { user, userLoading: authLoading, setUser } = useAuth();
  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      // "use cache"
      setLoading(true);
      const response = await fetch("/api/posts");

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }

  // Filter and sort posts
  const filteredPosts = posts
    .filter((post) => {
      return (
        searchTerm === "" ||
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const router = useRouter();
  const handleLogout = async () => {
    // Clear auth token and redirect
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    });
    console.log(response);
    setUser(null);
    const data = await response.json();

    toast.info("Logged out successfully");
    setTimeout(() => {
      router.push("/login");
    }, 1000);
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-end">
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg transition-colors"
                >
                  <FiUser size={18} />
                  <span className="font-medium">Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              All Blog Posts
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Read insightful articles from our community of writers
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <FiSearch
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full  pl-12 pr-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Recent Posts
              <span className="text-sm font-normal text-gray-600 ml-2">
                ({filteredPosts.length} posts)
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear search
              </button>
            )}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading posts...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {searchTerm ? "No matching posts found" : "No posts yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? "Try different search terms"
                : "Be the first to create a post!"}
            </p>
            <Link
              href="/dashboard/new"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              <span>Create First Post</span>
              <FiArrowRight />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PostList filteredPosts={filteredPosts} />
          </div>
        )}
      </main>
    </div>
  );
}

// Post Card Component
