"""Application entry file.

Authors:
    * Aasif Faizal <aasif@dal.ca>
    * Amrita Krishna <amrita@dal.ca>
    * Foram Gaikwad <foram.gaikwad@dal.ca>
    * Rushit Jasoliya <rushit.jasoliya@dal.ca>

All blueprints and routes are registered to the application.
"""
from datetime import timedelta

from flask import Flask, jsonify
from sqlmodel import Session

from storage.db import get_engine
from controller.university import university_blueprint
from controller.application import application_blueprint
from controller.user import user_blueprint
from controller.program import program_blueprint
from controller.document import document_blueprint
from controller.countries import countries_blueprint
from controller.universityUser import university_user_blueprint

from flask_cors import CORS
from flask_jwt_extended import JWTManager

app = Flask(__name__)
CORS(app, resources={r'/*': {'origins': '*'}}, support_credentials=True)

app.config["JWT_SECRET_KEY"] = "wewontsharethiswithyou"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWTManager(app)

app.register_blueprint(university_blueprint)
app.register_blueprint(application_blueprint)
app.register_blueprint(user_blueprint)
app.register_blueprint(program_blueprint)
app.register_blueprint(document_blueprint)
app.register_blueprint(university_user_blueprint)
app.register_blueprint(countries_blueprint)


@app.get('/health_check')
def health_check():
    try:
        with Session(get_engine()) as session:
            db_status = 'UP'
    except Exception:
        db_status = 'DOWN'
    return jsonify({
        'db': db_status,
        'server': 'UP'
    })
