# 🎨 HireITIan Frontend

<div align="center">

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](../LICENSE)

Modern, responsive web application for the HireITIan job board platform, built with React 18 and TypeScript.

</div>

---

## 📋 Overview

This is the frontend application for HireITIan, providing a beautiful and intuitive user interface for job seekers, employers, and administrators. Built with modern React 18, TypeScript, and Vite for optimal performance.

### Key Features
- ✅ **Responsive Design** - Mobile-first, works on all devices
- ✅ **Type-Safe** - Full TypeScript support
- ✅ **Fast Performance** - Vite + React optimization
- ✅ **Component-Based** - Reusable, maintainable components
- ✅ **State Management** - React Context API
- ✅ **Modern Styling** - TailwindCSS utility classes
- ✅ **API Integration** - Axios HTTP client
- ✅ **Accessibility** - WCAG compliant components

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cat > .env << EOF
VITE_API_URL=http://localhost:8000/api
EOF

# 3. Start development server
npm run dev
```

Application available at: `http://localhost:5173`

---

## 📁 Project Structure

```
src/
├── components/                 # Reusable UI Components
│   ├── Auth/                  # Authentication components
│   ├── Job/                   # Job-related components
│   ├── Application/           # Application components
│   ├── Common/                # Common/shared components
│   └── Layout/                # Layout components
├── pages/                      # Page components (routes)
│   ├── Home.tsx
│   ├── Jobs/
│   ├── Applications/
│   ├── Profile/
│   ├── Admin/
│   └── Auth/
├── services/                   # API service layer
│   ├── api.ts                 # HTTP client
│   ├── authService.ts
│   ├── jobService.ts
│   └── ...
├── context/                    # React Context providers
│   ├── AuthContext.tsx
│   └── UserContext.tsx
├── types/                      # TypeScript type definitions
│   ├── index.ts
│   ├── user.ts
│   ├── job.ts
│   └── ...
├── lib/                        # Utility functions
│   ├── helpers.ts
│   ├── formatters.ts
│   └── validators.ts
├── App.tsx                     # Root app component
├── main.tsx                    # Entry point
├── index.css                   # Global styles
└── vite-env.d.ts              # Vite environment types
```

---

## 🎯 Key Pages & Features

### 🌐 Public Pages
- **Home** - Landing page with search
- **Jobs Listing** - Browse all job postings with filters
- **Job Details** - Full job information and application form
- **Auth** - Login and registration

### 👨‍💼 Candidate Features
- **Profile Management** - Update resume, skills, portfolio
- **Job Applications** - Apply for jobs, track status
- **Saved Jobs** - Bookmark interesting positions
- **Notifications** - Stay updated on application status
- **Messages** - Communicate with employers

### 👔 Employer Features
- **Dashboard** - Overview of posted jobs and applications
- **Post Job** - Create new job listings
- **Manage Applications** - Review and update application status
- **Company Profile** - Setup and update company information
- **Analytics** - View job performance metrics

### 🛡️ Admin Features
- **User Management** - Manage all user accounts
- **Content Moderation** - Approve/reject job postings
- **Activity Logs** - Monitor platform activity
- **System Health** - Platform statistics and reports

---

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev              # Runs on http://localhost:5173

# Build for production
npm run build            # Creates optimized build in dist/

# Preview production build
npm run preview          # Locally preview production build

# Run linting
npm run lint             # Check code quality

# Format code
npm run format           # Format with Prettier
```

---

## 🔐 Authentication

The application uses JWT token-based authentication with localStorage.

### Login Flow
```typescript
// 1. User logs in
const login = async (email, password) => {
  const response = await authService.login({ email, password });
  // Response includes { token, user }
}

// 2. Token stored in localStorage
localStorage.setItem('auth_token', response.token);

// 3. Token sent with all requests
Authorization: Bearer <token>
```

### Protected Routes
- `/profile` - User profile
- `/applications` - My applications
- `/saved-jobs` - Saved jobs
- `/dashboard` - Employer/Admin dashboard

### User Roles
- **Admin** - Full platform access
- **Employer** - Post and manage jobs
- **Candidate** - Apply for jobs

---

## 📡 API Integration

### Service Layer
All API calls go through dedicated service files:

```typescript
// services/jobService.ts
export const jobService = {
  getAll: () => api.get('/jobs'),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
};
```

### HTTP Client
Configured in `services/api.ts` with:
- Base URL from environment
- Automatic token injection
- Error handling
- Request/response interceptors

### Environment Configuration
```env
VITE_API_URL=http://localhost:8000/api
```

---

## 🎨 Styling

### TailwindCSS
Utility-first CSS framework for rapid UI development.

```tsx
// Example component
<div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
  <h1 className="text-2xl font-bold text-gray-900">Welcome</h1>
  <p className="mt-2 text-gray-600">This is a styled component</p>
</div>
```

### Custom Styles
Global styles in `index.css` with Tailwind directives and custom utilities.

---

## 📦 Dependencies

### Core
- **react** - UI library
- **typescript** - Type safety
- **react-router-dom** - Client-side routing
- **axios** - HTTP client

### Styling
- **tailwindcss** - Utility CSS framework
- **autoprefixer** - CSS vendor prefixes

### Build & Development
- **vite** - Modern build tool
- **@vitejs/plugin-react** - React plugin for Vite

See `package.json` for complete dependency list.

---

## 🧪 Testing

### Setup
```bash
npm install --save-dev vitest @testing-library/react
```

### Run Tests
```bash
npm run test              # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

### Example Test
```typescript
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/Common/Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

---

## 🚀 Production Build

### Optimize
```bash
# Build production bundle
npm run build

# Files generated in dist/
# - Minified JavaScript
# - Optimized CSS
# - Compressed images
# - Source maps
```

### Deploy
The `dist/` folder can be served by any static hosting service:
- Netlify
- Vercel
- AWS S3 + CloudFront
- GitHub Pages
- Traditional web server (nginx, Apache)

### Server Configuration Example (nginx)
```nginx
server {
    listen 80;
    server_name example.com;
    
    location / {
        root /var/www/job_board/web/dist;
        try_files $uri /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:8000;
    }
}
```

---

## 🔍 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## 📚 Documentation

- **[Main Project README](../README.md)** - Full project overview
- **[Backend API Docs](../api/README.md)** - API documentation
- **[React Documentation](https://react.dev)** - React framework docs
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)** - TypeScript reference
- **[TailwindCSS Docs](https://tailwindcss.com/docs)** - Styling framework
- **[Vite Documentation](https://vitejs.dev)** - Build tool docs

---

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Follow the code style and conventions
3. Write clear commit messages
4. Submit a pull request

### Code Style
- Use TypeScript for type safety
- Follow React best practices
- Use meaningful component names
- Keep components small and focused
- Write descriptive comments

---

## 🐛 Troubleshooting

### Port 5173 Already in Use
```bash
# Use different port
npm run dev -- --port 3000
```

### API Connection Issues
- Check `VITE_API_URL` environment variable
- Ensure backend API is running
- Check CORS configuration on backend

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules dist
npm install
npm run build
```

---

## 📝 License

This project is open source under the MIT License.

---

<div align="center">

Built with ❤️ using React | [View Full Project](../README.md)

</div>
