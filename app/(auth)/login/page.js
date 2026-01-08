"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiLogIn,
  FiShield,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/context/authContext";
import { useEffect } from "react";
export default function LoginPage() {
  const router = useRouter();

  const { user, userLoading, setUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  useEffect(() => {
    if (user && !userLoading) {
      router.replace("/");
    }
  }, [user, userLoading, router]);

  if (userLoading) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return false;
    }

    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      toast.error("Please enter a valid email address", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    const loadingToast = toast.loading("Signing you in...", {
      position: "top-right",
      theme: "colored",
    });

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setUser(data.user);
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Update loading toast to success
      toast.update(loadingToast, {
        render: "Login successful! 🎉",
        type: "success",
        isLoading: false,
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });

      // Show welcome back toast
      setTimeout(() => {
        toast.success("Welcome back to BlogSpace!", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      }, 500);

      // Redirect after success
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1500);
    } catch (err) {
      // Update loading toast to error
      toast.update(loadingToast, {
        render: err.message || "Invalid email or password",
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
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50 p-4">
      <ToastContainer />

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Side - Welcome Section */}
        <div className="hidden lg:flex flex-col justify-center p-8">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <FiLogIn className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  BlogSpace
                </h1>
                <p className="text-gray-600 mt-1">
                  Your creative writing platform
                </p>
              </div>
            </div>

            <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Welcome Back to Your Creative Space
            </h2>
            <p className="text-gray-600 text-lg mb-10 leading-relaxed">
              Continue your writing journey, manage your posts, and connect with
              readers.
            </p>
          </div>

          {/* Benefits List */}
          <div className="space-y-8">
            <div className="flex items-start gap-5 p-5 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-md">
                <FiCheckCircle className="text-white" size={22} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  Access All Your Content
                </h3>
                <p className="text-gray-600">
                  Manage your posts, drafts, and published articles
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5 p-5 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm">
              <div className="p-3 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl shadow-md">
                <FiShield className="text-white" size={22} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  Secure Access
                </h3>
                <p className="text-gray-600">
                  Your account is protected with advanced security
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5 p-5 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-md">
                <FiAlertCircle className="text-white" size={22} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  Real-time Notifications
                </h3>
                <p className="text-gray-600">
                  Stay updated with comments and engagement
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="text-2xl font-bold text-blue-600">24/7</div>
                <div className="text-sm text-gray-600">Access</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="text-2xl font-bold text-purple-600">99.9%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="text-2xl font-bold text-green-600">10K+</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md">
            {/* Form Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-6">
                <FiLogIn className="text-white" size={28} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Welcome Back
              </h1>
              <p className="text-gray-600">
                Sign in to continue to your dashboard
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FiMail size={16} />
                    <span>Email Address</span>
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="you@example.com"
                    />
                    <FiMail
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <FiLock size={16} />
                      <span>Password</span>
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="••••••••"
                    />
                    <FiLock
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <FiEyeOff size={20} />
                      ) : (
                        <FiEye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <FiArrowRight size={20} />
                    </>
                  )}
                </button>

                {/* Social Login */}
                {/* <div>
                  <p className="text-center text-sm text-gray-600 mb-4">
                    Or sign in with
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className="flex items-center justify-center gap-3 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">
                        Google
                      </span>
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center gap-3 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="#000000"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">
                        GitHub
                      </span>
                    </button>
                  </div>
                </div> */}

                {/* Sign Up Link */}
                <div className="text-center pt-4 border-t border-gray-100">
                  <p className="text-gray-600">
                    Don't have an account?{" "}
                    <Link
                      href="/register"
                      className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Sign up for free
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
