# TempShare - Temporary File Sharing Application

A production-ready temporary file sharing application with automatic expiration and cleanup. Files are stored locally and automatically deleted after 30 minutes.

## Features

- ✅ Create temporary rooms with 30-minute expiration
- ✅ Upload files up to 100MB per room
- ✅ Unique 8-character room codes
- ✅ Real-time synchronized countdown timer (synced across all users)
- ✅ Automatic file cleanup on expiration
- ✅ Secure against path traversal attacks
- ✅ Rate limiting protection
- ✅ Responsive, modern UI
- ✅ No third-party storage dependencies
- ✅ SEO optimized with meta tags, Open Graph, and Twitter Cards
- ✅ Docker containerization for easy deployment

## Tech Stack

### Backend

- Node.js + Express + TypeScript
- Multer (local file storage)
- MVVM architecture
- In-memory room management
- Background cleanup jobs

### Frontend

- React 18 + TypeScript
- Vite
- TailwindCSS + shadcn/ui
- React Query (TanStack Query)
- React Router
- Axios

## Project Structure

```
Share-me/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration & constants
│   │   ├── controllers/     # HTTP request handlers
│   │   ├── services/        # Business logic
│   │   ├── routes/          # API routes
│   │   ├── middlewares/     # Express middlewares
│   │   ├── models/          # TypeScript interfaces
│   │   ├── utils/           # Helper functions
│   │   ├── jobs/            # Background cleanup jobs
│   │   ├── app.ts           # Express app setup
│   │   └── server.ts        # Entry point
│   ├── uploads/             # Temporary file storage
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/             # Axios client & API calls
    │   ├── components/      # Reusable UI components
    │   ├── features/        # Feature-specific components
    │   ├── hooks/           # Custom React hooks
    │   ├── pages/           # Route pages
    │   ├── types/           # TypeScript types
    │   ├── utils/           # Helper functions
    │   ├── App.tsx
    │   └── main.tsx
    └── package.json
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm

### Backend Setup

1. Navigate to backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp .env.example .env
```

4. Configure environment variables (optional):

```env
PORT=5000
NODE_ENV=development
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=104857600
ROOM_EXPIRATION_MINUTES=30
CLEANUP_INTERVAL_SECONDS=60
```

5. Start development server:

```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp .env.example .env
```

4. Configure API URL (optional):

```env
VITE_API_URL=http://localhost:5000/api
```

5. Start development server:

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## Production Build

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
npm run preview
```

## Docker Deployment

### Using Docker

**Prerequisites**: Docker installed on your system

#### Build Docker Image

```bash
cd backend
docker build -t share-me-backend .
```

#### Run Docker Container

```bash
docker run -d \
  -p 5000:5000 \
  -e NODE_ENV=production \
  -e ROOM_EXPIRATION_MINUTES=30 \
  -v $(pwd)/uploads:/app/uploads \
  -v $(pwd)/logs:/app/logs \
  --name share-me-backend \
  share-me-backend
```

#### Stop Container

```bash
docker stop share-me-backend
docker rm share-me-backend
```

### Using Docker Compose

**Easiest way to deploy**

```bash
# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

### Docker Environment Variables

Configure these in your docker-compose.yml or pass with `-e` flag:

- `NODE_ENV`: Environment (production/development)
- `PORT`: Server port (default: 5000)
- `UPLOAD_DIR`: Upload directory path
- `MAX_FILE_SIZE`: Maximum file size in bytes (default: 104857600 = 100MB)
- `ROOM_EXPIRATION_MINUTES`: Room lifetime in minutes (default: 30)
- `CLEANUP_INTERVAL_SECONDS`: Cleanup job interval (default: 60)

### Health Check

The Docker container includes a health check that verifies the server is responding:

```bash
docker ps  # Check container health status
```

## API Endpoints

| Method | Endpoint                           | Description         |
| ------ | ---------------------------------- | ------------------- |
| GET    | `/api/time`                        | Get server time     |
| POST   | `/api/rooms`                       | Create a new room   |
| GET    | `/api/rooms/:code`                 | Get room details    |
| GET    | `/api/rooms/:code/files`           | List files in room  |
| POST   | `/api/rooms/:code/upload`          | Upload file to room |
| GET    | `/api/rooms/:code/files/:filename` | Download file       |

## Usage

### Creating a Room

1. Visit the homepage
2. Click "Create Room"
3. Share the generated room code

### Joining a Room

1. Enter the room code
2. Click "Join Room"
3. Upload or download files

### File Upload

- Maximum file size: 100MB
- Upload progress tracking
- Automatic room refresh after upload

### File Download

- Click download button next to any file
- Downloads with original filename

## Security Features

- **Path Traversal Protection**: Sanitizes and validates all file paths
- **Rate Limiting**: 10 requests per minute per IP
- **File Size Limits**: Enforced 100MB maximum
- **Room Code Validation**: Crypto-secure random generation
- **Input Sanitization**: All inputs validated
- **HTTP Status Codes**: Proper error responses (410 for expired rooms)

## Automatic Cleanup

- Cleanup job runs every 60 seconds
- Deletes expired rooms and their files
- Removes orphaned directories on startup
- Graceful shutdown handling

## Architecture Highlights

### Backend

- **Thin Controllers**: HTTP handling only
- **Service Layer**: Business logic separation
- **Middleware Chain**: Validation, error handling, rate limiting
- **Defensive Programming**: Comprehensive error handling
- **Structured Logging**: Contextual log messages

### Frontend

- **MVC-Style Separation**: Clear folder structure
- **React Query**: Server state management
- **Custom Hooks**: Reusable logic
- **Loading/Error States**: Proper UX handling
- **Type Safety**: Full TypeScript coverage

## License

ISC
