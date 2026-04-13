import uvicorn
import logging

def main():
    # Setup structured JSON format logging
    logging.basicConfig(
        level=logging.INFO,
        format='{"time": "%(asctime)s", "name": "%(name)s", "level": "%(levelname)s", "message": "%(message)s"}'
    )
    
    logger = logging.getLogger("taskflow")
    logger.info("Initializing TaskFlow Backend App Entrypoint...")
    
    uvicorn.run(
        "src.__init__:app", 
        host="127.0.0.1", 
        port=8000, 
        reload=True,
        log_level="info"
    )

if __name__ == "__main__":
    main()
