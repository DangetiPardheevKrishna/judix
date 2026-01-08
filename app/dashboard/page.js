"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiPlus,
  FiSearch,
  FiRefreshCw,
  FiGrid,
  FiList,
  FiFileText,
  FiLogOut,
  FiArrowLeft,
  FiEdit2,
} from "react-icons/fi";
import { usePosts } from "@/hooks/usePosts";
import PostCard from "@/components/postCard";
import { truncateText } from "@/utils/helpers";
import Profile from "@/components/Profile";
import { toast } from "react-toastify";
import Link from "next/link";
import { useAuth } from "@/context/authContext";

export default function DashboardPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const { deletePost, fetchUserPosts } = usePosts();
  const { user, userLoading: authLoading, setUser } = useAuth();
  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      setLoading(true);
      const data = await fetchUserPosts();
      setPosts(data);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await deletePost(id);
      setPosts(posts.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
    }
  }

  const handleEdit = (postId) => {
    router.push(`/dashboard/edit/${postId}`);
  };

  const handleView = (postId) => {
    router.push(`/posts/${postId}`);
  };

  const filteredPosts = posts.filter((post) => {
    return (
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleLogout = async () => {
    // Clear auth token and redirect
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    });
    setUser(null);
    const data = await response.json();

    toast.info("Logged out successfully");
    setTimeout(() => {
      router.push("/login");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Manage your blog posts</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium"
              >
                <FiLogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-700 hover:text-blue-600 mb-2"
        >
          <FiArrowLeft />
          <span>Back to Home</span>
        </Link>

        <Profile />
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Posts</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {posts.length}
                </h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <FiFileText className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Characters Written</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {posts
                    .reduce(
                      (total, post) => total + (post.content?.length || 0),
                      0
                    )
                    .toLocaleString()}
                </h3>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <FiFileText className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Latest Post</p>
                <h3 className="text-lg font-semibold text-gray-900 mt-1 truncate">
                  {truncateText(posts[0]?.title, 20) || "No posts yet"}
                </h3>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <FiFileText className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FiSearch
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={loadPosts}
                className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-lg font-medium"
              >
                <FiRefreshCw
                  size={20}
                  className={loading ? "animate-spin" : ""}
                />
                <span>Refresh</span>
              </button>

              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-white shadow-sm"
                      : "hover:bg-gray-200"
                  }`}
                >
                  <FiGrid
                    size={20}
                    className={
                      viewMode === "grid" ? "text-blue-600" : "text-gray-400"
                    }
                  />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list"
                      ? "bg-white shadow-sm"
                      : "hover:bg-gray-200"
                  }`}
                >
                  <FiList
                    size={20}
                    className={
                      viewMode === "list" ? "text-blue-600" : "text-gray-400"
                    }
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Your Posts
              <span className="text-sm font-normal text-gray-600 ml-2">
                ({filteredPosts.length} posts)
              </span>
            </h2>
            <div className="flex gap-4">
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear search
                </button>
              )}
              <button
                onClick={() => router.push("/dashboard/new")}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium shadow-sm hover:shadow transition-all"
              >
                <FiPlus size={20} />
                <span>Create Post</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Loading your posts...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-xl">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm ? "No matching posts found" : "No posts yet"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm
                  ? "Try different search terms"
                  : "Create your first post to get started"}
              </p>
              <button
                onClick={() => router.push("/dashboard/new")}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
              >
                <FiPlus size={20} />
                <span>Create Your First Post</span>
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onView={handleView}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onView={handleView}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
