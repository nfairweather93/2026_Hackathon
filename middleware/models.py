from extensions import db
from flask_sqlalchemy import SQLAlchemy

class Professor(db.Model):
    __tablename__ = "professors"

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    school = db.Column(db.String(100), nullable=False)
    job_description = db.Column(db.String(100), nullable=False)
    department = db.Column(db.String(100), nullable=False)
    earnings = db.Column(db.String(100), nullable=False)
    year = db.Column(db.String(4), nullable=False)
    rmp_url = db.Column(db.String(100), nullable=False)
    prof_rating = db.Column(db.String(100), nullable=False)
    num_ratings = db.Column(db.String(100), nullable=False)
    would_take_again = db.Column(db.String(100), nullable=False)
    level_of_difficulty = db.Column(db.String(100), nullable=False)
    rmp_dept = db.Column(db.String(100), nullable=False)
    tags = db.Column(db.String(100), nullable=False)

    def to_dict(self):
        return {
            "full_name": self.full_name,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "school": self.school,
            "job_description": self.job_description,
            "department": self.department,
            "earnings": self.earnings,
            "year": self.year,
            "rmp_url": self.rmp_url,
            "prof_rating": self.prof_rating,
            "num_ratings": self.num_ratings,
            "would_take_again": self.would_take_again,
            "level_of_difficulty": self.level_of_difficulty,
            "rmp_dept": self.rmp_dept,
            "tags": self.tags
        }