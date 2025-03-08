from PyPDF2 import PdfReader, PdfWriter
import logging

# Configure logging
logger = logging.getLogger(__name__)

class PDFError(Exception):
    """Custom exception for PDF processing errors"""
    pass

def unlock_pdf(input_path: str, output_path: str, password: str) -> tuple[bool, str]:
    """
    Unlock a PDF file using the provided password.
    Returns a tuple of (success: bool, error_message: str)
    """
    try:
        # Create PDF reader object
        logger.info(f"Opening PDF file: {input_path}")
        reader = PdfReader(input_path)
        
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
            
            # Write decrypted PDF to output file
            logger.info(f"Writing unlocked PDF to: {output_path}")
            with open(output_path, 'wb') as output_file:
                writer.write(output_file)
                
            return True, ""
            
        except Exception as e:
            error_msg = f"Error processing PDF pages: {str(e)}"
            logger.error(error_msg)
            return False, error_msg
            
    except FileNotFoundError:
        error_msg = f"PDF file not found: {input_path}"
        logger.error(error_msg)
        return False, error_msg
    except Exception as e:
        error_msg = f"Error opening PDF: {str(e)}"
        logger.error(error_msg)
        return False, error_msg
