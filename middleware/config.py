from dotenv import load_dotenv

class Config:
    load_dotenv()
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///app.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False