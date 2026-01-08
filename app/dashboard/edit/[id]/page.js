"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { FiArrowLeft, FiSave, FiTrash2, FiLoader } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { usePosts } from "@/hooks/usePosts";

export default function EditPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [contentLoading, setContentLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const router = useRouter();
  const params = useParams();
  const { updatePost, deletePost, generateContent } = usePosts();
  const { id } = params;

  useEffect(() => {
    if (params.id) {
      fetchPost();
    }
  }, [id]);

  async function fetchPost() {
    try {
      setLoading(true);
      const response = await fetch(`/api/posts/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch post");
      }

      const post = await response.json();
      setTitle(post.title || "");
      setContent(post.content || "");
    } catch (error) {
      console.error("Error fetching post:", error);
      toast.error("Failed to load post", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateContent() {
    if (!title.trim()) {
      toast.warning("Please enter a title first to generate content", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      return;
    }

    setContentLoading(true);
    setGenerating(true);
    
    const toastId = toast.loading("AI is generating content...", {
      position: "top-right",
      theme: "colored",
    });

    try {
      const res = await generateContent(title);
      console.log(res);
      setContent(res);
      
      toast.update(toastId, {
        render: "Content generated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    } catch (error) {
      console.error("Error generating content:", error);
      toast.update(toastId, {
        render: "Failed to generate content. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    } finally {
      setContentLoading(false);
      setTimeout(() => setGenerating(false), 500); // Delay to show skeleton fade out
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim()) {
      toast.warning("Please enter a title", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      return;
    }

    if (!content.trim()) {
      toast.warning("Please enter content", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      return;
    }

    setSaving(true);

    try {
      const postData = {
        title: title.trim(),
        content: content.trim(),
      };

      await updatePost(params.id, postData);

      toast.success("Post updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        onClose: () => router.push("/dashboard"),
      });

      // Navigate after toast closes
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error(error.message || "Failed to update post", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      return;
    }

    const toastId = toast.loading("Deleting post...", {
      position: "top-right",
      theme: "colored",
    });

    try {
      await deletePost(params.id);
      
      toast.update(toastId, {
        render: "Post deleted successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        onClose: () => router.push("/dashboard"),
      });

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.update(toastId, {
        render: error.message || "Failed to delete post",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 font-medium">Loading post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
                <p className="text-gray-600">Update your blog post</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleDelete}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiTrash2 size={18} />
                <span>Delete</span>
              </button>

              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium disabled:opacity-50 transition-all duration-200"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FiSave size={18} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Post Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your post about?"
              className="w-full px-4 py-3 text-xl font-medium bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          {/* Content Editor with Generate Button */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Content *
              </label>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  {content.length} characters
                </span>
                <button
                  type="button"
                  onClick={handleGenerateContent}
                  disabled={contentLoading || !title.trim()}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 transition-all duration-200"
                >
                  {contentLoading ? (
                    <>
                      <FiLoader className="animate-spin" size={16} />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Generate Content</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Loading Skeleton */}
            {generating && (
              <div className="border border-gray-200 rounded-lg overflow-hidden animate-pulse">
                <div className="space-y-4 p-4 bg-white">
                  {/* Title skeleton */}
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  
                  {/* Paragraph skeletons */}
                  <div className="space-y-3">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="pt-4">
                    <div className="h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-[pulse_1.5s_ease-in-out_infinite]">
                      <div className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full w-3/4 animate-[shimmer_2s_infinite]"></div>
                    </div>
                    <div className="text-center text-sm text-gray-500 mt-2">
                      AI is writing your content...
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Textarea - hidden when loading */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post content here... or click 'Generate Content' to get AI assistance"
              rows={20}
              className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-y ${
                contentLoading ? "opacity-50 pointer-events-none" : ""
              }`}
              required
            />
          </div>

          {/* Character Count & Stats */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Content Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="text-3xl font-bold text-blue-600">
                  {content.length}
                </div>
                <div className="text-sm text-gray-600 mt-1">Characters</div>
              </div>
              <div className="text-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="text-3xl font-bold text-green-600">
                  {
                    content.split(/\s+/).filter((word) => word.length > 0)
                      .length
                  }
                </div>
                <div className="text-sm text-gray-600 mt-1">Words</div>
              </div>
              <div className="text-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="text-3xl font-bold text-purple-600">
                  {
                    content.split("\n").filter((line) => line.trim().length > 0)
                      .length
                  }
                </div>
                <div className="text-sm text-gray-600 mt-1">Paragraphs</div>
              </div>
              <div className="text-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="text-3xl font-bold text-orange-600">
                  {Math.ceil(
                    content.split(/\s+/).filter((word) => word.length > 0)
                      .length / 200
                  )}
                </div>
                <div className="text-sm text-gray-600 mt-1">Minutes read</div>
              </div>
            </div>
            
            {/* Reading time helper */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Estimated reading time:</span> Approximately {
                  Math.ceil(content.split(/\s+/).filter((word) => word.length > 0).length / 200)
                } minute{
                  Math.ceil(content.split(/\s+/).filter((word) => word.length > 0).length / 200) !== 1 ? 's' : ''
                } (based on 200 words per minute)
              </div>
            </div>
          </div>

          {/* AI Tips Section */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-5">
            <h4 className="font-medium text-indigo-800 mb-3 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              AI Writing Assistant Tips
            </h4>
            <ul className="text-sm text-indigo-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-0.5">•</span>
                <span>Enter a clear title and use "Generate Content" for AI assistance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-0.5">•</span>
                <span>You can regenerate content multiple times to get different results</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-0.5">•</span>
                <span>Edit and personalize the AI-generated content to match your voice</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-0.5">•</span>
                <span>Review statistics to ensure your content meets readability standards</span>
              </li>
            </ul>
          </div>
        </form>

        <style jsx>{`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
        `}</style>
      </main>
    </div>
  );
}