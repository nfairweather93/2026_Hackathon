# External Imports
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
import csv
# Local Imports
from config import Config
from extensions import db
from models import Professor
from database import SeedDatabase

app = Flask(__name__)

app.config.from_object(Config)

CORS(
    app,
    resources={r"/*": {"origins": "http://localhost:3000"}},
    supports_credentials=True
)

db.init_app(app=app)

with app.app_context():
    if os.path.exists("instance/app.db"):
        os.remove("instance/app.db")
    db.create_all()
    SeedDatabase()


@app.route("/api/professors", methods=["GET"])
def GetProfessors():
    professors = Professor.query.all()
    return jsonify([professor.to_dict() for professor in professors]), 200

@app.route("/api/health")
def health():
    return jsonify({"status": "ok"}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)