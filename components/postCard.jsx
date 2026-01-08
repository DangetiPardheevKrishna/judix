import { FiEdit2, FiTrash2, FiEye, FiCalendar, FiUser } from "react-icons/fi";
import {
  formatDate,
  truncateText,
  getInitials,
  getRandomColor,
} from "@/utils/helpers";

export default function PostCard({ post, onEdit, onDelete, onView }) {
  return (
    <div className="group relative bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="absolute top-0 left-0 w-1 h-full rounded-l-xl bg-gradient-to-b from-blue-500 to-purple-500" />

      <div className="pl-5 pr-4 py-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0 pr-4">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
              {post.title || "Untitled Post"}
            </h3>

            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <FiCalendar size={14} />
                <span>{formatDate(post.createdAt)}</span>
              </div>

              {post.author && (
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <FiUser size={14} />
                  <span>{post.author.name || "Anonymous"}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onView(post._id)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="View post"
            >
              <FiEye size={18} />
            </button>

            <button
              onClick={() => onEdit(post._id)}
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Edit post"
            >
              <FiEdit2 size={18} />
            </button>

            <button
              onClick={() => onDelete(post._id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete post"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
          {truncateText(post.content, 200)}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${getRandomColor(
                post._id
              )} text-white text-xs font-bold`}
            >
              {getInitials(post.author?.name || "User")}
            </div>
            <span className="text-sm text-gray-500">
              {post.author?.name || "You"}
            </span>
          </div>

          <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">
            Post
          </span>
        </div>
      </div>
    </div>
  );
}
