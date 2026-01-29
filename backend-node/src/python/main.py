import io
import sys
from PyPDF2 import PdfReader, PdfWriter
import logging
from typing import Union, BinaryIO, IO
from io import BytesIO

# Configure logging
logger = logging.getLogger(__name__)

class PDFError(Exception):
    """Custom exception for PDF processing errors"""
    pass

def unlock_pdf(input_source: Union[str, BytesIO, BinaryIO], 
               output_dest: Union[str, BytesIO, BinaryIO], 
               password: str) -> tuple[bool, str]:
    """
    Unlock a PDF file using the provided password.
    
    Args:
        input_source: Either a file path string or a BytesIO/file-like object containing the PDF
        output_dest: Either a file path string or a BytesIO/file-like object to write the unlocked PDF to
        password: The password to unlock the PDF
        
    Returns:
        tuple[bool, str]: (success, error_message)
    """
    try:
        # Create PDF reader object
        logger.info("Opening PDF file")
        reader = PdfReader(input_source)
        
        # Check if PDF is encrypted
        if reader.is_encrypted:
            logger.info("PDF is encrypted, attempting to decrypt")
            try:
                success = reader.decrypt(password)
                if not success:
                    error_msg = "Invalid password for PDF file"
                    logger.error(error_msg)
                    return False, error_msg
            except Exception as e:
                error_msg = f"Error during decryption: {str(e)}"
                logger.error(error_msg)
                return False, error_msg
        else:
            logger.info("PDF is not encrypted")
            return False, "This PDF is not password protected"
        
        # Create PDF writer object
        writer = PdfWriter()
        
        try:
            # Add all pages to writer
            logger.info("Adding pages to new PDF")
            for page in reader.pages:
                writer.add_page(page)
            
            # Write decrypted PDF to output destination
            logger.info("Writing unlocked PDF")
            
            # If output_dest is a string (file path), open it and write
            if isinstance(output_dest, str):
                with open(output_dest, 'wb') as output_file:
                    writer.write(output_file)
            # If output_dest is already a file-like object, write directly
            else:
                writer.write(output_dest)
                
            return True, ""
            
        except Exception as e:
            error_msg = f"Error processing PDF pages: {str(e)}"
            logger.error(error_msg)
            return False, error_msg
            
    except FileNotFoundError:
        error_msg = "PDF file not found"
        logger.error(error_msg)
        return False, error_msg
    except Exception as e:
        error_msg = f"Error opening PDF: {str(e)}"
        logger.error(error_msg)
        return False, error_msg
    
if __name__ == "__main__":
    input_buffer = io.BytesIO(sys.stdin.buffer.read())
    output_buffer = io.BytesIO()
    success, message = unlock_pdf(input_buffer, output_buffer, sys.argv[1])
    if success:
        output_buffer.seek(0)
        sys.stdout.buffer.write(output_buffer.getvalue())
        sys.stdout.flush()
    else:
        print(f"Failed to unlock PDF: {message}")