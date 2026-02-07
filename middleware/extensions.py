from flask_sqlalchemy import SQLAlchemy
from flask import jsonify, Response
db = SQLAlchemy()

def super_jsonify(content, code=200) -> tuple[Response, int]:
    response = jsonify(content)
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:4200")
    response.headers.add("Access-Control-Allow-Credentials", "true")
    return response, code