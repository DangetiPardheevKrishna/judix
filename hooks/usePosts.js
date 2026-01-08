import { useState } from "react";
import { useRouter } from "next/navigation";
import {removeMarkdown} from "@/utils/helpers"
export function usePosts() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  
const generateContent = async (title) => {
  try {
    const response = await fetch("/api/posts/aicontent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate content");
    }

    const data = await response.json();

    const cleanContent = removeMarkdown(data.content);
    return cleanContent;

  } catch (error) {
    console.error(error);
    return "";
  }
};


  const fetchUserPosts = async () => {
    try {
      const response = await fetch("/api/posts/user");

      if (response.status === 401) {
        router.push("/login");
        return [];
      }

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deletePost = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData) => {
    try {
      setLoading(true);
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (id, postData) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    deletePost,
    createPost,
    updatePost,
    fetchUserPosts,
    generateContent
  };
}
