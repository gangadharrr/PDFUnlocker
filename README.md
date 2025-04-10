# PDF Unlocker with React UI

A web application to unlock password-protected PDF files with a modern React frontend and FastAPI backend.

## Features

- Drag and drop interface for PDF uploads
- Secure password handling
- Modern UI with Chakra UI components
- Containerized application with Docker
- FastAPI backend for efficient processing

## Project Structure

```
PDFUnlocker/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── pdf_processor.py     # PDF processing logic
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile          # Backend container configuration
├── frontend/
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   └── index.js       # React entry point
│   ├── public/
│   │   └── index.html     # HTML template
│   ├── package.json       # Node.js dependencies
│   ├── Dockerfile        # Frontend container configuration
│   └── nginx.conf        # Nginx configuration
└── docker-compose.yml    # Container orchestration
```

## Prerequisites

- Docker
- Docker Compose

## Setup and Running

1. Clone the repository:
```bash
git clone <repository-url>
cd PDFUnlocker
```

2. Build and start the containers:
```bash
docker-compose up --build
```

3. Access the application:
- Frontend: http://localhost
- Backend API: http://localhost:8000

## Usage

1. Open your web browser and navigate to http://localhost
2. Drag and drop a password-protected PDF file or click to select one
3. Enter the PDF password
4. Click "Unlock PDF"
5. The unlocked PDF will be automatically downloaded

## API Endpoints

- `POST /upload`: Upload and unlock PDF file
  - Parameters:
    - `file`: PDF file (multipart/form-data)
    - `password`: PDF password (form field)
  - Returns: Unlocked PDF file

- `GET /health`: Health check endpoint
  - Returns: `{"status": "healthy"}`

## Development

### Frontend Development

```bash
cd frontend
npm install
npm start
```

### API URL Configuration

The frontend can be configured to connect to different backend API URLs using environment variables:

1. For development, create or modify `frontend/.env` file:
   ```
   REACT_APP_API_URL=http://localhost:8000
   ```

2. For production with relative URLs (same domain), use an empty value in `frontend/.env.production`:
   ```
   REACT_APP_API_URL=
   ```

3. For production with a specific API domain:
   ```
   REACT_APP_API_URL=https://api.example.com
   ```

### Backend Development

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## Security Notes

- Files are processed in memory and cleaned up after processing
- No PDFs are stored permanently on the server
- Password is transmitted securely and not logged
- CORS is configured for local development
