from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
import io
from pdf_processor import unlock_pdf, PDFError

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/v1/unlock")
async def upload_pdf(file: UploadFile = File(...), password: str = Form(...)):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    try:
        # Read file into memory
        contents = await file.read()
        input_buffer = io.BytesIO(contents)
        output_buffer = io.BytesIO()
        
        # Process PDF in memory
        success, error_message = unlock_pdf(input_buffer, output_buffer, password)
        
        if not success:
            raise HTTPException(status_code=400, detail=error_message)
        
        # Return the unlocked PDF
        output_buffer.seek(0)
        return Response(
            content=output_buffer.getvalue(),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="unlocked_{file.filename}"'
            }
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/api/v1/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/")
async def health_check():
    return '<html><body><h1>PDF Unlocker Service is Running</h1></body></html>'
