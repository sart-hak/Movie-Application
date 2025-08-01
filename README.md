# Movie Database Application

A full-stack movie management application built with Next.js 14 (SSR) and NestJS, featuring secure authentication, CRUD operations, and file uploads.

## Features

- 🔐 **Secure Authentication** - HTTP-only cookies with JWT
- 🎬 **Movie Management** - Create, read, update, delete movies
- 🖼️ **Image Upload** - Upload and manage movie posters
- 🔍 **Search & Pagination** - Fast search with debouncing and pagination
- 📱 **Responsive Design** - Works on desktop and mobile
- ⚡ **SSR Performance** - Server-side rendering for optimal performance
- 🎨 **Modern UI** - Dark theme with Figma design implementation

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Query** - Data fetching and state management
- **React Hook Form** - Form handling
- **Axios** - HTTP client

### Backend
- **NestJS** - Node.js framework
- **TypeScript** - Type safety
- **TypeORM** - Database ORM
- **SQLite** - Database
- **JWT** - Authentication
- **Multer** - File uploads
- **bcryptjs** - Password hashing

## Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Development Setup

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd movie_application
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

4. **Start Backend (Terminal 1)**
```bash
cd backend
npm run start:dev
```

5. **Start Frontend (Terminal 2)**
```bash
cd frontend
npm run dev
```

6. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api

## Docker Deployment

### Using Docker Compose (Recommended)

1. **Build and run both services**
```bash
docker-compose up --build
```

2. **Run in background**
```bash
docker-compose up -d --build
```

3. **Stop services**
```bash
docker-compose down
```

### Individual Docker Builds

**Backend:**
```bash
cd backend
docker build -t movie-app-backend .
docker run -p 3001:3001 movie-app-backend
```

**Frontend:**
```bash
cd frontend
docker build -t movie-app-frontend .
docker run -p 3000:3000 movie-app-frontend
```

## Environment Variables

### Backend (.env)
```env
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-in-production
DATABASE_PATH=./database.sqlite
PORT=3001
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Movies
- `GET /api/movies` - Get paginated movies
- `GET /api/movies/:id` - Get movie by ID
- `POST /api/movies` - Create new movie
- `PATCH /api/movies/:id` - Update movie
- `DELETE /api/movies/:id` - Delete movie

### Query Parameters
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 8)
- `search` - Search term

## Project Structure

```
movie_application/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── movies/         # Movies module
│   │   ├── users/          # Users module
│   │   └── main.ts         # Application entry point
│   ├── uploads/            # Uploaded files
│   └── Dockerfile
├── frontend/               # Next.js Application
│   ├── app/               # App Router pages
│   ├── components/        # React components
│   ├── lib/              # Utilities and API
│   └── Dockerfile
├── docker-compose.yml     # Docker Compose configuration
└── README.md
```

## Security Features

- ✅ HTTP-only cookies for JWT tokens
- ✅ CORS configuration
- ✅ Password hashing with bcrypt
- ✅ Input validation and sanitization
- ✅ File upload restrictions
- ✅ XSS and CSRF protection

## Performance Optimizations

- ✅ Server-side rendering (SSR)
- ✅ Image optimization
- ✅ React Query caching
- ✅ Debounced search
- ✅ Code splitting
- ✅ Docker multi-stage builds

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email your-email@example.com or create an issue in the repository.

