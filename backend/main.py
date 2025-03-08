from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
import shutil
import os
import logging
from pathlib import Path
from pdf_processor import unlock_pdf, PDFError

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create directories if they don't exist
UPLOAD_DIR = Path("uploads")
OUTPUT_DIR = Path("outputs")
UPLOAD_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)

@app.exception_handler(PDFError)
async def pdf_error_handler(request, exc):
    return JSONResponse(
        status_code=400,
        content={"detail": str(exc)},
    )

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...), password: str = Form(...)):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    input_path = UPLOAD_DIR / file.filename
    output_filename = f"unlocked_{file.filename}"
    output_path = OUTPUT_DIR / output_filename
    
    try:
        # Save uploaded file
        logger.info(f"Saving uploaded file: {file.filename}")
        with input_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Process PDF
        logger.info(f"Processing PDF: {file.filename}")
        success, error_message = unlock_pdf(str(input_path), str(output_path), password)
        
        if not success:
            logger.error(f"Failed to unlock PDF: {error_message}")
            raise HTTPException(status_code=400, detail=error_message)
        
        logger.info(f"Successfully unlocked PDF: {file.filename}")
        # Return the unlocked PDF
        return FileResponse(
            path=str(output_path),
            filename=output_filename,
            media_type="application/pdf"
        )
    
    except Exception as e:
        logger.error(f"Error processing PDF: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    
    finally:
        # Cleanup
        logger.info("Cleaning up temporary files")
        if input_path.exists():
            input_path.unlink()
        if output_path.exists() and not success:
            output_path.unlink()

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
