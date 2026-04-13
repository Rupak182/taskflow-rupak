import uvicorn
import logging
import os
from src.config import Config

def main():
    # Setup structured JSON format logging
    logging.basicConfig(
        level=logging.INFO,
        format='{"time": "%(asctime)s", "name": "%(name)s", "level": "%(levelname)s", "message": "%(message)s"}'
    )
    
    logger = logging.getLogger("taskflow")
    logger.info("Initializing TaskFlow Backend App Entrypoint...")
    
    is_prod = Config.ENVIRONMENT == "production"
    
    uvicorn.run(
        "src.__init__:app", 
        host="0.0.0.0" if is_prod else "127.0.0.1", 
        port=8000, 
        reload=not is_prod,
        log_level="info"
    )

if __name__ == "__main__":
    main()
