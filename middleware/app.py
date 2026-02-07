# External Imports
from flask import Flask, jsonify, request, render_template, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import case
import os
import csv
# Local Imports
from config import Config
from extensions import db, super_jsonify
from models import Professor
from database import SeedDatabase

app = Flask(__name__)

app.config.from_object(Config)

CORS(
    app,
    resources={r"/*": {"origins": "http://localhost:4200"}},
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
    return super_jsonify([professor.to_dict() for professor in professors], 200)

@app.route("/api/professors/name", methods=["GET"])
def GetProfessorsNames():
    partial_full_name = request.args.get('input')
    if partial_full_name:
        priority = case(
            (Professor.first_name.contains(partial_full_name), 1),  # highest priority
            (Professor.last_name.contains(partial_full_name), 2),   # second
            (Professor.full_name.contains(partial_full_name), 3),    # third
            else_=4  # everything else
        )

        results = Professor.query.filter(
            (Professor.first_name.contains(partial_full_name)) |
            (Professor.last_name.contains(partial_full_name)) |
            (Professor.full_name.contains(partial_full_name))
        ).order_by(priority).limit(100).all()
        return super_jsonify([professor.full_name for professor in results], 200)
    else:
        return super_jsonify("Queried full_name was null", 300)
    
@app.route("/api/professors/name/full", methods=["GET"])
def GetProfessorByName():
    partial_full_name = request.args.get('input')
    if partial_full_name:
        priority = case(
            (Professor.first_name.contains(partial_full_name), 1),  # highest priority
            (Professor.last_name.contains(partial_full_name), 2),   # second
            (Professor.full_name.contains(partial_full_name), 3),    # third
            else_=4  # everything else
        )

        results = Professor.query.filter(
            (Professor.first_name.contains(partial_full_name)) |
            (Professor.last_name.contains(partial_full_name)) |
            (Professor.full_name.contains(partial_full_name))
        ).order_by(priority).first()
        return super_jsonify(results.to_dict(), 200)
    else:
        return super_jsonify("Queried full_name was null", 300)

@app.route("/api/professors/department/", methods=["GET"])
def GetProfessorsByDepartment():
    dept_name = request.args.get('input')
    if dept_name:
        priority = case(
            (Professor.rmp_dept.contains(dept_name), 1),  # highest priority
            (Professor.department.contains(dept_name), 2),   # second
            else_=3  # everything else
        )

        results = Professor.query.filter(
            (Professor.rmp_dept.contains(dept_name)) |
            (Professor.department.contains(dept_name))
        ).order_by(priority).limit(100).all()
        return super_jsonify([professor.to_dict() for professor in results], 200)
    else:
        return super_jsonify("Queried full_name was null", 300)

@app.route("/api/health")
def health():
    return super_jsonify({"status": "ok"}, 200)


@app.route("/")
def home():
    return render_template("index.html")

@app.route("/results")
def results():
    return render_template("results.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)