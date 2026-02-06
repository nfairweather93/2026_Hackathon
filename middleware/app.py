# External Imports
from flask import Flask, jsonify
from flask_cors import CORS
# Local Imports
from config import Config

app = Flask(__name__)

app.config.from_object(Config)

CORS(
    app,
    resources={r"/*": {"origins": "http://localhost:3000"}},
    supports_credentials=True
)