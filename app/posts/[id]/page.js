"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft, FiCalendar, FiUser, FiEdit2 } from "react-icons/fi";
import { format } from "date-fns";
import Link from "next/link";

export default function SinglePostPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthor, setIsAuthor] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  async function fetchPost() {
    try {
      setLoading(true);
      const response = await fetch(`/api/posts/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          router.push("/posts");
          return;
        }
        throw new Error("Failed to fetch post");
      }

      const data = await response.json();
      setPost(data);

      // Check if current user is the author (simplified)
      // In real app, compare with logged in user ID
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setIsAuthor(user._id === data.author?._id);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back button skeleton */}
          <div className="h-8 w-24 bg-gray-200 rounded-full mb-8"></div>

          {/* Title skeleton */}
          <div className="h-10 bg-gray-200 rounded mb-6 max-w-3xl"></div>

          {/* Meta skeleton */}
          <div className="flex gap-6 mb-8">
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>

          {/* Content skeleton */}
          <div className="space-y-4">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">📄</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Post Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The post you're looking for doesn't exist.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            <FiArrowLeft />
            <span>Browse All Posts</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-700 hover:text-blue-600"
            >
              <FiArrowLeft />
              <span>Back to Home</span>
            </Link>

            {isAuthor && (
              <Link
                href={`/dashboard/edit/${post._id}`}
                className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 px-4 py-2 rounded-lg font-medium"
              >
                <FiEdit2 />
                <span>Edit Post</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article Container */}
        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-8 border-b border-gray-200">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                    {post.author?.name?.charAt(0) || "A"}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {post.author?.name || "Anonymous Author"}
                    </p>
                    {post.author?.email && (
                      <p className="text-sm text-gray-500">
                        {post.author.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Date Info */}
              <div className="flex items-center gap-2 text-gray-600">
                <FiCalendar size={16} />
                <span>{format(new Date(post.createdAt), "MMMM dd, yyyy")}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                {post.content}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Last updated:{" "}
                {format(new Date(post.updatedAt), "MMM dd, yyyy 'at' h:mm a")}
              </div>

              <div className="flex items-center gap-4">
                <Link
                  href="/"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View All Posts
                </Link>

                {isAuthor && (
                  <Link
                    href={`/dashboard/edit/${post._id}`}
                    className="text-green-600 hover:text-green-800 font-medium"
                  >
                    Edit this Post
                  </Link>
                )}
              </div>
            </div>
          </div>
        </article>

        {/* Author Card */}
        {post.author && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              About the Author
            </h3>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white text-xl font-bold">
                {post.author.name?.charAt(0) || "A"}
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-gray-900 mb-1">
                  {post.author.name}
                </h4>
                {post.author.email && (
                  <p className="text-gray-600 mb-3">{post.author.email}</p>
                )}
                <p className="text-gray-600">
                  This post was created by the author on{" "}
                  {format(new Date(post.createdAt), "MMMM dd, yyyy")}.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
