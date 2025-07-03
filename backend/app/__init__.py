from flask import Flask
from flask_cors import CORS
import os
from .database import Database
from .utils.scraper import AMCScraper
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def create_app():
    app = Flask(__name__)
    CORS(app)

    mongo_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
    try:
        app.db = Database(mongo_uri)
        logger.info("MongoDB connection established")
    except Exception as e:
        logger.warning(f"MongoDB not available, running without database: {str(e)}")
        app.db = None

    
    app.scraper = AMCScraper()
    logger.info("Data scraper initialized")

    # Import and register blueprints
    from .routes import main
    app.register_blueprint(main)
    logger.info("Routes registered")

    return app