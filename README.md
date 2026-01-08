# 🤖 AI-Powered Blog Application

> A full-stack blog platform combining Google's Gemini API for intelligent content generation with Cloudinary for seamless media management.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![React](https://img.shields.io/badge/React-18-blue)
![Gemini API](https://img.shields.io/badge/Gemini-API-orange)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-blue)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [AI Content Generation](#ai-content-generation)
- [Image Management](#image-management)
- [Authentication](#authentication)
- [Project Structure](#project-structure)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

This project is a modern, full-stack blog application that leverages generative AI to transform content creation. Built with Next.js 14 and powered by Google's Gemini API, it enables users to generate high-quality blog posts with intelligent AI assistance while managing media assets efficiently through Cloudinary.

The application provides a complete blogging ecosystem with user authentication, AI-powered content generation, and scalable media handling—all through a clean, maintainable architecture.

## ✨ Features

- 🔐 **User Authentication** - Secure user registration, login, and profile management
- 🤖 **AI Content Generation** - Generate blog titles and full articles using Gemini API
- 📝 **Plain-Text Output** - AI generates clean, readable content without markdown formatting
- 🖼️ **Image Upload** - Seamless image uploads with Cloudinary integration
- ⚡ **Optimized Media Delivery** - Automatic image optimization and transformation
- 📚 **Full CRUD Operations** - Create, read, update, and delete blog posts
- 🔄 **Centralized Auth Context** - Global authentication state management
- 🛡️ **Protected Routes** - Automatic redirection based on authentication status
- 🏗️ **Modular Architecture** - Clean separation of concerns for scalability
- 🚀 **Performance Optimized** - Built with Next.js App Router for optimal performance

## 🛠️ Tech Stack

### Frontend

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **Context API** - Global state management
- **Fetch API** - HTTP client for API calls

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **Gemini API** - AI content generation
- **Cloudinary SDK** - Media storage and optimization

### Utilities

- **Prompt Engineering** - Controlled AI content generation
- **Content Sanitization** - Output formatting and cleanup

## 🏛️ Architecture

The application follows a modular architecture with clear separation of responsibilities:

```
┌─────────────────────────────────────────┐
│          Client (Next.js)               │
│  ┌──────────────────────────────────┐   │
│  │     Auth Context Provider        │   │
│  │  (Global Authentication State)   │   │
│  └──────────────────────────────────┘   │
│              │                           │
│         ┌────┴────┐                      │
│    ┌────▼───┐ ┌──▼─────┐                │
│    │ Pages  │ │Components│              │
│    └────────┘ └─────────┘                │
└─────────────────┬───────────────────────┘
                  │
    ┌─────────────┴─────────────┐
    │                           │
┌───▼──────────┐      ┌────────▼────────┐
│  API Routes  │      │  External APIs  │
│  /api/*      │      │  - Gemini       │
│              │      │  - Cloudinary   │
└──────────────┘      └─────────────────┘
```

### Key Design Principles

- **Single Source of Truth**: Auth Context manages authentication state globally
- **API Abstraction**: Dedicated routes for blog posts, AI content, and uploads
- **Decoupled Services**: AI generation and media storage are isolated
- **Scalable Structure**: Modular design supports future feature additions

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Google Gemini API key
- Cloudinary account

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/DangetiPardheevKrishna/judix
   cd ai-blog-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory (see [Environment Variables](#environment-variables))

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Database Configuration (if applicable)
MONGODB_URI=your_database_connection_string

# JWT Secret (for authentication)
JWT_SECRET=your_jwt_secret_key
```

### Getting API Keys

- **Gemini API**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Cloudinary**: Sign up at [Cloudinary](https://cloudinary.com/) and get credentials from your dashboard

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/user/profile` - Get current user profile

### Blog Posts

- `GET /api/posts` - Get all blog posts
- `GET /api/posts/[id]` - Get single post
- `POST /api/posts` - Create new post
- `PUT /api/posts/[id]` - Update post
- `DELETE /api/posts/[id]` - Delete post

### AI & Media

- `POST /api/posts/aicontent` - Generate AI blog content

## 🤖 AI Content Generation

The application uses Google's Gemini API with carefully crafted system prompts to generate high-quality blog content.

### Content Generation Process

1. User provides a blog topic or title
2. Request sent to Gemini API with structured prompt
3. AI generates plain-text blog article
4. Content is sanitized and formatted
5. Output returned ready for publishing

### Prompt Engineering

The system prompt enforces strict rules to ensure:

- ✅ Plain-text output (no markdown)
- ✅ Natural paragraph structure
- ✅ Informative and engaging content
- ✅ Blog-appropriate tone and length
- ❌ No bullet points or special formatting
- ❌ No code blocks or technical syntax

### Example Usage

```javascript
const response = await fetch("/api/posts/aicontent", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    topic: "The Future of Web Development",
    tone: "professional",
  }),
});

const { title, content } = await response.json();
```

## 🖼️ Image Management

Cloudinary handles all image storage, optimization, and delivery.

### Upload Process

1. User selects image from file picker
2. Image sent to `/api/upload` endpoint
3. Server uploads to Cloudinary using SDK
4. Cloudinary returns optimized URL
5. URL stored with blog post data

### Benefits

- 🚀 **Fast Delivery**: Global CDN distribution
- 🔄 **Auto-Optimization**: Automatic format and quality optimization
- 📐 **Transformations**: Resize and crop on-the-fly
- 💾 **Scalable Storage**: No server storage limitations
- 🔒 **Secure**: Protected uploads with API authentication

### Example Upload Code

```javascript
const formData = new FormData();
formData.append("image", file);

const response = await fetch("/api/upload", {
  method: "POST",
  body: formData,
});

const { url } = await response.json();
```

## 🔐 Authentication

The application uses a centralized authentication system with Context API.

### Auth Flow

```
User Login → JWT Token → HTTP-Only Cookie → Auth Context → Protected Routes
```

### Features

- **Context-Based State**: Global auth state via React Context
- **Automatic Redirects**: Protected routes redirect unauthenticated users
- **Session Persistence**: Secure cookie-based sessions
- **Profile Management**: User data accessible throughout app

### Protected Route Example

```javascript
"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function ProtectedPage() {
  const { user, userLoading } = useAuth();
  const router = useRouter();

  if (userLoading) return <div>Loading...</div>;
  if (!user) router.push("/login");

  return <div>Welcome, {user.name}</div>;
}
```

## 📁 Project Structure

```ai-blog-app/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.js
│   │   └── register/
│   │       └── page.js
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.js
│   │   │   ├── logout/
│   │   │   │   └── route.js
│   │   │   ├── me/
│   │   │   │   └── route.js
│   │   │   └── register/
│   │   │       └── route.js
│   │   ├── posts/
│   │   │   ├── [id]/
│   │   │   │   └── route.js
│   │   │   ├── aicontent/
│   │   │   │   └── route.js
│   │   │   ├── user/
│   │   │   │   └── route.js
│   │   │   └── route.js
│   │   ├── protected/
│   │   │   └── route.js
│   │   └── user/
│   │       └── profile/
│   │           └── route.js
│   ├── dashboard/
│   │   ├── edit/
│   │   │   └── page.js
│   │   ├── new/
│   │   │   └── page.js
│   │   └── page.js
│   ├── posts/
│   │   ├── [id]/
│   │   │   └── page.js
│   │   └── page.js
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── components/
│   └── [UI components]
├── context/
│   └── AuthContext.js
├── hooks/
│   └── [custom hooks]
├── lib/
│   ├── auth.js
│   ├── cloudinary.js
│   ├── db.js
│   └── generateContent.js
├── middleware/
│   └── [middleware functions]
├── models/
│   └── [database models]
├── node_modules/
├── public/
│   └── [static assets]
├── utils/
│   └── helpers.js
├── .env
├── .gitignore
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
└── README.md
```

## 🚀 Future Enhancements

- [ ] **SEO Optimization** - Meta tags and structured data for AI content
- [ ] **Tone Customization** - Professional, casual, technical writing styles
- [ ] **Word Count Control** - Specify desired article length
- [ ] **Multi-Language** - Generate content in multiple languages
- [ ] **Role-Based Access** - Admin, editor, and author permissions
- [ ] **Middleware Protection** - Server-side route authentication
- [ ] **Draft Management** - Save and publish drafts
- [ ] **Comment System** - Reader engagement features
- [ ] **Analytics Dashboard** - Post performance metrics
- [ ] **Social Sharing** - One-click social media integration

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code follows the existing style and includes appropriate tests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini** - For providing powerful AI generation capabilities
- **Cloudinary** - For robust media management infrastructure
- **Next.js Team** - For an excellent React framework
- **Open Source Community** - For inspiration and support

## 📞 Contact

For questions or support, please open an issue on GitHub or contact the maintainers.

---

**Built with ❤️ using Next.js, Gemini AI, and Cloudinary**
