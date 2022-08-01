"""Application Controller.

Authors:
    * Amrita Krishna <amrita@dal.ca>
    * Rishita Kotiyal <rs677988@dal.ca>
"""

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlmodel import SQLModel, Session

from controller.validator import validate
from schema.application import ApplicationRequest, ApplicationStatus
from service.application_service import (
    add_application, withdraw_application, get_student_applications,
    get_application_by_id, get_reviewer_applications, review_application, get_university_applications)
from storage.db import get_engine
from storage.universityUser import university_user_operations

application_blueprint = Blueprint('application_blueprint', __name__, url_prefix='/application')


class RequestModel(SQLModel):
    application_id: str
    status: ApplicationStatus


@application_blueprint.post('')
@jwt_required()
@validate
def create_application(body: ApplicationRequest):
    """
    Controller that creates an application.
    Args:
        body(ApplicationRequest): Post request data to create the application for a student

    Returns:
        Success/Error response after insertion of application to the db

    """
    try:
        add_application(body)
        return jsonify({"Success": "True"})
    except Exception as exception:
        return jsonify({"Success": "False", "message": str(exception)}), 500


@application_blueprint.put('/<string:application_id>/withdraw')
@jwt_required()
@validate
def withdraw_an_application(application_id: str):
    """
    Controller that withdraws an application.
    Args:
        application_id(str): Application id of the application to be withdrawn

    Returns:
        Success/Error response after updating the status of application to the db

    """
    try:
        withdraw_application(application_id)
        return jsonify({"Success": "True"})
    except Exception as exception:
        return jsonify({"Success": "False", "message": str(exception)}), 500


@application_blueprint.get('')
@jwt_required()
def get_applications():
    """
    Controller that retrieves the applications created by a student.
    Returns:
        List of applications with relevant details required by the List view.
    """
    email = get_jwt_identity()
    try:
        applications = get_student_applications(email)
        return jsonify(applications)
    except Exception as exception:
        return jsonify({"Success": "False", "message": str(exception)}), 500


@application_blueprint.get('/university')
@jwt_required()
def get_applications_university():
    email = get_jwt_identity()
    try:
        with Session(get_engine()) as session:
            user = university_user_operations.get_user_by_email(session, email)
            applications = get_university_applications(session, user.university_id)
            return jsonify(applications)
    except Exception as exception:
        return jsonify({"Success": "False", "message": str(exception)}), 500


@application_blueprint.get('/detail/<string:application_id>')
def get_application_detail(application_id: str):
    """

    Args:
        application_id(str): Application id of the application to be withdrawn

    Returns:
        All the details of the application requested.

    """
    try:
        return jsonify(get_application_by_id(application_id))
    except Exception as exception:
        return jsonify({"Success": "False", "message": str(exception)}), 500


@application_blueprint.get('/review')
@jwt_required()
def get_applications_for_reviewer():
    email = get_jwt_identity()
    try:
        return jsonify(get_reviewer_applications(email))
    except Exception as exception:
        return jsonify({"Success": "False", "message": str(exception)}), 500


@application_blueprint.put('/review/update')
@jwt_required()
def update_and_review_application():
    email = get_jwt_identity()
    try:
        review_application(RequestModel(**request.json), email)
        return jsonify({"Success": "True"})
    except Exception as exception:
        return jsonify({"Success": "False", "message": str(exception)}), 500


