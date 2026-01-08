"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiSave, FiLoader } from "react-icons/fi";
import { usePosts } from "@/hooks/usePosts";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [contentLoading, setContentLoading] = useState(false);
  const router = useRouter();
  const { createPost, generateContent } = usePosts();

  async function handleGenerateContent() {
    if (!title.trim()) {
      alert("Please enter a title first to generate content");
      return;
    }

    setContentLoading(true);
    try {
      const res = await generateContent(title);
      console.log(res);
      setContent(res);
    } catch (error) {
      console.error("Error generating content:", error);
      alert("Failed to generate content. Please try again.");
    } finally {
      setContentLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }

    if (!content.trim()) {
      alert("Please enter content");
      return;
    }

    setLoading(true);

    try {
      const postData = {
        title: title.trim(),
        content: content.trim(),
      };

      await createPost(postData);

      alert("Post created successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating post:", error);
      alert(error.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
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
                <h1 className="text-2xl font-bold text-gray-900">
                  Create New Post
                </h1>
                <p className="text-gray-600">Write your blog post</p>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FiSave size={18} />
                  <span>Publish Post</span>
                </>
              )}
            </button>
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
            {contentLoading && (
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
            { !contentLoading &&   <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post content here... or click 'Generate Content' to get AI assistance"
              rows={20}
              className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-y ${
                contentLoading ? "opacity-50 pointer-events-none" : ""
              }`}
              required
            />}
           
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-5">
            <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
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
              Writing Tips
            </h4>
            <ul className="text-sm text-blue-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Enter a clear title and use "Generate Content" for AI assistance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Break content into paragraphs for better readability</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Use simple, clear language that's easy to understand</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Review and edit the generated content before publishing</span>
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