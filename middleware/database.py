import os
import csv
import json
from models import Professor
from extensions import db

def SeedDatabase():
    with open(os.path.join(os.getcwd(), "rmp.csv"), mode ='r') as file:
        csvFile = list(csv.reader(file))
    for entry in csvFile:
        professor = Professor(
            full_name = entry[0],
            first_name = entry[1],
            last_name = entry[2],
            school = entry[3],
            job_description = entry[4],
            department = entry[5],
            earnings = entry[6],
            year = entry[7],
            rmp_url = entry[8],
            prof_rating = entry[9],
            num_ratings = entry[10],
            would_take_again = entry[11],
            level_of_difficulty = entry[12],
            rmp_dept = entry[13],
            tags = json.dumps(entry[13])
        )

        db.session.add(professor)
        db.session.commit()