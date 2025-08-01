# File Upload Backend

A Node.js Express backend application that handles file uploads using Multer and stores files on Cloudinary.

## Features

- ✅ Single file upload
- ✅ Multiple files upload from single field
- ✅ Multiple fields with arrays of files
- ✅ Cloudinary integration for cloud storage
- ✅ Automatic cleanup of temporary files
- ✅ CORS support
- ✅ Error handling
- ✅ File type validation
- ✅ File size limits

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Cloudinary account

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd file-upload-backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env
```

4. Configure your Cloudinary credentials in `.env`:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

## Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### 1. Upload Single File
**POST** `/api/upload/single`

Upload a single file to Cloudinary.

**Form Data:**
- `file`: The file to upload

**Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "originalName": "example.jpg",
    "cloudinaryId": "single-uploads/example-123456789",
    "url": "https://res.cloudinary.com/...",
    "size": 1024000,
    "format": "jpg",
    "uploadedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### 2. Upload Multiple Files
**POST** `/api/upload/multiple`

Upload multiple files from a single field to Cloudinary.

**Form Data:**
- `files`: Array of files to upload

**Response:**
```json
{
  "success": true,
  "message": "3 files uploaded successfully",
  "data": [
    {
      "originalName": "file1.jpg",
      "cloudinaryId": "multiple-uploads/file1-123456789",
      "url": "https://res.cloudinary.com/...",
      "size": 1024000,
      "format": "jpg",
      "uploadedAt": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

### 3. Upload Multiple Fields
**POST** `/api/upload/multifield`

Upload multiple fields, each containing arrays of files.

**Form Data:**
- `images`: Array of image files
- `documents`: Array of document files
- `videos`: Array of video files

**Response:**
```json
{
  "success": true,
  "message": "Multifield files uploaded successfully",
  "data": {
    "images": [
      {
        "originalName": "image1.jpg",
        "cloudinaryId": "multifield-uploads/images/image1-123456789",
        "url": "https://res.cloudinary.com/...",
        "size": 1024000,
        "format": "jpg",
        "uploadedAt": "2024-01-01T12:00:00.000Z"
      }
    ],
    "documents": [
      {
        "originalName": "document1.pdf",
        "cloudinaryId": "multifield-uploads/documents/document1-123456789",
        "url": "https://res.cloudinary.com/...",
        "size": 2048000,
        "format": "pdf",
        "uploadedAt": "2024-01-01T12:00:00.000Z"
      }
    ]
  }
}
```

## File Restrictions

- **Maximum file size**: 10MB per file
- **Maximum files**: 10 files per request
- **Allowed file types**:
  - Images: JPEG, JPG, PNG, GIF, WebP
  - Documents: PDF, TXT, DOC, DOCX

## Error Handling

The API returns appropriate error messages for:
- File size exceeded
- Invalid file type
- No files uploaded
- Cloudinary upload failures
- Server errors

## Testing with cURL

### Single File Upload
```bash
curl -X POST \
  http://localhost:3000/api/upload/single \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@/path/to/your/file.jpg'
```

### Multiple Files Upload
```bash
curl -X POST \
  http://localhost:3000/api/upload/multiple \
  -H 'Content-Type: multipart/form-data' \
  -F 'files=@/path/to/file1.jpg' \
  -F 'files=@/path/to/file2.png'
```

### Multifield Upload
```bash
curl -X POST \
  http://localhost:3000/api/upload/multifield \
  -H 'Content-Type: multipart/form-data' \
  -F 'images=@/path/to/image1.jpg' \
  -F 'images=@/path/to/image2.png' \
  -F 'documents=@/path/to/document1.pdf'
```

## Deployment to Render.com

### Step 1: Push to GitHub

1. Initialize git repository (if not already done):
```bash
git init
git add .
git commit -m "Initial commit"
```

2. Create a new repository on GitHub and push your code:
```bash
git remote add origin https://github.com/yourusername/your-repo-name.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Render.com

1. Go to [Render.com](https://render.com) and sign up/login
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `file-upload-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or choose your preferred plan)

5. Add environment variables in Render dashboard:
   - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: Your Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
   - `NODE_ENV`: `production`
   - `CORS_ORIGIN`: Your frontend URL (or `*` for development)

6. Click "Create Web Service"

### Step 3: Update CORS Configuration

After deployment, update your `.env` file with the production URL:
```env
CORS_ORIGIN=https://your-app-name.onrender.com
```

## Project Structure

```
file-upload-backend/
├── config/
│   └── cloudinary.js          # Cloudinary configuration
├── controllers/
│   └── uploadController.js    # Upload logic
├── middleware/
│   └── upload.js             # Multer middleware
├── routes/
│   └── uploadRoutes.js       # API routes
├── uploads/                  # Temporary file storage
├── .env                      # Environment variables
├── .gitignore               # Git ignore file
├── package.json             # Dependencies
├── server.js                # Main server file
└── README.md                # Documentation
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret | Yes |
| `PORT` | Server port | No (default: 3000) |
| `NODE_ENV` | Environment mode | No (default: development) |
| `CORS_ORIGIN` | CORS origin URL | No (default: localhost:3000) |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details 