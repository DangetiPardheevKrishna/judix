"use client";

import { useState, useEffect } from "react";
import {
  FiUser,
  FiEdit2,
  FiCamera,
  FiSave,
  FiX,
  FiMail,
  FiCalendar,
  FiFileText,
  FiEye,
  FiHeart,
  FiGlobe,
  FiUpload,
  FiCheck,
} from "react-icons/fi";
import { format } from "date-fns";
import { getInitials } from "@/utils/helpers";
import { toast } from "react-toastify";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    bio: "",
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);

      // Fetch user profile
      const userRes = await fetch("/api/user/profile");
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData.user);
        setProfileData({
          name: userData.user.name || "",
          bio: userData.user.bio || "",
        });
      }

      // Fetch user posts for stats
      const postsRes = await fetch("/api/posts/user");
      if (postsRes.ok) {
        const postsData = await postsRes.json();
        setPosts(postsData);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      toast.error("Image size should be less than 5MB");
      return;
    }

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("image", file);

    // If user has existing Cloudinary image, send its public_id
    if (user.image && user.image.includes("cloudinary")) {
      const publicId = user.image.split("/").pop().split(".")[0];
      formData.append("oldImagePublicId", `blog-app/users/${publicId}`);
    }

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        toast.success("Profile image updated successfully!");
      } else {
        toast.error(data.error || "Failed to update image");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const formData = new FormData();
      Object.keys(profileData).forEach((key) => {
        formData.append(key, profileData[key]);
      });

      const response = await fetch("/api/user/profile", {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setShowEditModal(false);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(data.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile");
    }
  };

  const openEditModal = () => {
    setProfileData({
      name: user?.name || "",
      bio: user?.bio || "",
    });
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
        <div className="animate-pulse space-y-4">
          {/* Profile image skeleton */}
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>

          {/* Stats skeleton */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-6xl mb-4">👤</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Profile Not Found
        </h3>
        <p className="text-gray-600">Unable to load profile information</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 mb-8">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
              {/* Profile Image */}
              <div className="relative group">
                <div className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500 text-white text-2xl font-bold">
                            ${getInitials(user?.name)}
                          </div>
                        `;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500 text-white text-2xl font-bold">
                      {getInitials(user?.name) || "U"}
                    </div>
                  )}
                </div>

                {/* Image Upload Button */}
                <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                  {uploadingImage ? (
                    <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <FiCamera className="text-white" size={24} />
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-16 pb-6 px-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-center flex-1">
                <h2 className="text-xl font-bold text-gray-900">
                  {user?.name}
                </h2>
                <p className="text-gray-600 flex items-center justify-center gap-2 mt-1">
                  <FiMail size={14} />
                  {user?.email}
                </p>
              </div>

              {/* Edit Button */}
              <button
                onClick={openEditModal}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit Profile"
              >
                <FiEdit2 size={20} />
              </button>
            </div>

            {/* Bio */}
            {user?.bio && (
              <div className="mb-6 text-center">
                <p className="text-gray-600 text-sm leading-relaxed">
                  {user.bio}
                </p>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">
                  {posts.length}
                </div>
                <div className="text-xs text-gray-600">Posts</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-lg font-bold text-purple-600">
                  {posts.reduce((sum, post) => sum + (post.views || 0), 0)}
                </div>
                <div className="text-xs text-gray-600">Views</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">
                  {posts.reduce((sum, post) => sum + (post.likes || 0), 0)}
                </div>
                <div className="text-xs text-gray-600">Likes</div>
              </div>
            </div>

            {/* Member Since */}
            <div className="text-center text-sm text-gray-500">
              <FiCalendar className="inline-block mr-1" size={14} />
              Joined{" "}
              {user?.createdAt
                ? format(new Date(user.createdAt), "MMM dd, yyyy")
                : "N/A"}
            </div>
          </div>
        </div>

        {/* Profile Stats Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FiGlobe size={20} />
            <span>Profile Stats</span>
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiFileText className="text-blue-600" size={18} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Posts Created</p>
                  <p className="text-sm text-gray-600">Total number of posts</p>
                </div>
              </div>
              <span className="text-xl font-bold text-blue-600">
                {posts.length}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FiEye className="text-green-600" size={18} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Total Views</p>
                  <p className="text-sm text-gray-600">All-time post views</p>
                </div>
              </div>
              <span className="text-xl font-bold text-green-600">
                {posts.reduce((sum, post) => sum + (post.views || 0), 0)}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <FiHeart className="text-pink-600" size={18} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Total Likes</p>
                  <p className="text-sm text-gray-600">All-time post likes</p>
                </div>
              </div>
              <span className="text-xl font-bold text-pink-600">
                {posts.reduce((sum, post) => sum + (post.likes || 0), 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Account Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-700">Email</span>
              <span className="text-gray-600 font-medium">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-700">Member Since</span>
              <span className="text-gray-600 font-medium">
                {user?.createdAt
                  ? format(new Date(user.createdAt), "MMM dd, yyyy")
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-200 bg-white rounded-t-2xl">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Edit Profile
                </h3>
                <p className="text-gray-600 mt-1">
                  Update your personal information
                </p>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX size={24} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Profile Image Section */}
              <div className="mb-8">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden">
                      {user?.image ? (
                        <img
                          src={user.image}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500 text-white text-3xl font-bold">
                          {getInitials(user?.name) || "U"}
                        </div>
                      )}
                    </div>
                    <label className="absolute bottom-2 right-2 p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg cursor-pointer hover:from-blue-700 hover:to-purple-700 transition-all">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploadingImage}
                      />
                      {uploadingImage ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <FiCamera size={20} />
                      )}
                    </label>
                  </div>
                  <p className="text-sm text-gray-600">
                    Click the camera icon to update your profile picture
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FiUser size={16} />
                    <span>Full Name</span>
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter your name"
                  />
                </div>

                {/* Email Field (Read-only) */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FiMail size={16} />
                    <span>Email Address</span>
                  </label>
                  <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-600">
                    {user?.email}
                  </div>
                  <p className="text-xs text-gray-500">
                    Email cannot be changed
                  </p>
                </div>

                {/* Bio Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FiUser size={16} />
                    <span>Bio</span>
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        bio: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                    placeholder="Tell us about yourself..."
                    maxLength={500}
                  />
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">
                      Share something about yourself
                    </span>
                    <span
                      className={`${
                        profileData.bio.length > 450
                          ? "text-red-500"
                          : "text-gray-500"
                      }`}
                    >
                      {profileData.bio.length}/500
                    </span>
                  </div>
                </div>

                {/* Stats Preview */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-xl p-5">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Your Profile Stats
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {posts.length}
                      </div>
                      <div className="text-sm text-gray-600">Posts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {posts.reduce(
                          (sum, post) => sum + (post.views || 0),
                          0
                        )}
                      </div>
                      <div className="text-sm text-gray-600">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {posts.reduce(
                          (sum, post) => sum + (post.likes || 0),
                          0
                        )}
                      </div>
                      <div className="text-sm text-gray-600">Likes</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 flex items-center justify-between p-6 border-t border-gray-200 bg-white rounded-b-2xl">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleProfileUpdate}
                className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl"
              >
                <FiSave size={20} />
                <span>Save Changes</span>
                <FiCheck size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
