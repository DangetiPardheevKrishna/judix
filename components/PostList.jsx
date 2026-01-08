import React from "react";
import Link from "next/link";
import { FiArrowRight, FiCalendar, FiUser } from "react-icons/fi";
import { format } from "date-fns";
const PostList = ({ filteredPosts, searchTerm }) => {
  return filteredPosts.length === 0 ? (
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
    filteredPosts.map((post) => <PostCard key={post._id} post={post} />)
  );
};

function PostCard({ post }) {
  return (
    <Link href={`/posts/${post._id}`}>
      <div className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300 h-full flex flex-col">
        <div className="p-6 flex-1">
          {/* Post Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
            {post.title}
          </h3>

          {/* Post Excerpt */}
          <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
            {post.content.length > 150
              ? post.content.substring(0, 150) + "..."
              : post.content}
          </p>

          {/* Meta Info */}
          <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
            <div className="flex items-center gap-2">
              <FiCalendar size={14} />
              <span>{format(new Date(post.createdAt), "MMM dd, yyyy")}</span>
            </div>

            <div className="flex items-center gap-2">
              <FiUser size={14} />
              <span>{post.author?.name || "Anonymous"}</span>
            </div>
          </div>
        </div>

        {/* Read More Button */}
        <div className="px-6 pb-6">
          <div className="inline-flex items-center gap-2 text-blue-600 font-medium group-hover:gap-3 transition-all">
            <span>Read More</span>
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Hover Effect Line */}
        <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-xl" />
      </div>
    </Link>
  );
}

export default PostList;
