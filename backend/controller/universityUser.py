"""University user Controller. It is used for performing CRUD operations on university user table. 
 Here university user means Staff members.

Author:
    * Foram Gaikwad <foram.gaikwad@dal.ca>
    * Rushit Jasoliya <rushit.jasoliya@dal.ca>
"""

from flask import Blueprint, jsonify, request
from sqlmodel import Session, select
from storage.db import get_engine
from schema.user import UniversityUser, User
from storage.universityUser import university_user_operations
from flask_jwt_extended import jwt_required, get_jwt_identity
from assets.email_notification_new_staff import body_plain_content, body_html_content
from service.notification_service import (send_notification)

university_user_blueprint = Blueprint(
    'university_user_blueprint', __name__, url_prefix='/university')


# fetching university user from university user table
@university_user_blueprint.route("/get-university-user",  methods=['POST'])
@jwt_required()
def get_universityUser_user():
    with Session(get_engine()) as session:
        request_body = request.get_json()
        statement = select(UniversityUser).where(
            UniversityUser.university_id == request_body['university_id'])
        result = session.exec(statement).all()
        staff_members = {}
        if result is None:
            return {"status": False, "message": "No Staff Member found"}, 404
        else:
            for staff in result:
                staff_members[staff.id] = staff.dict()
            statement = select(User).where(User.id.in_((staff_members.keys())))
            result = session.exec(statement).all()

            if result is None:
                return {"status": False, "message": "No Staff Member found"}, 404
            else:
                final_list = []
                for staff in result:
                    if staff.id in staff_members:
                        staff_m = {
                            "name": staff.name,
                            "email": staff.email,
                            "type": staff.type,
                            "password": staff.password,
                            "date_of_birth": staff_members.get(staff.id)['date_of_birth'],
                            "department": staff_members.get(staff.id)['department'],
                            "qualification": staff_members.get(staff.id)['qualification'],
                            "gender": staff_members.get(staff.id)['gender'],
                            "image_url": staff_members.get(staff.id)['image_url'],
                            "university_id": staff_members.get(staff.id)['university_id'],
                            "id": staff.id,
                        }
                        final_list.append(staff_m)
                return {"status": True, "message": "Staff Members found", "data": final_list}, 200


@university_user_blueprint.post("/getUniversityUserId")
@jwt_required()
def get_uniUser_by_id():
    with Session(get_engine()) as session:
        request_body = request.get_json()
        result = university_user_operations.get_by_id(
            session, request_body['id'])
        if result is None:
            return {"status": False, "message": "No Staff Member found"}, 404
        else:
            return {"status": True, "message": "Staff Member found", "data": result.dict()}, 200


# creating university user row in university user table
@university_user_blueprint.route("/add-university_user",  methods=['POST'])
@jwt_required()
def add_university_user():
    with Session(get_engine()) as session:
        request_body = request.get_json()
        print("Request : ", request_body)
        university_user_data = {
            'id': request_body['id'],
            'university_id': request_body['university_id'],
            'date_of_birth': request_body['date_of_birth'],
            'qualification': request_body['qualification'],
            'gender': request_body['gender'],
            'department': request_body['department'],
        }
        university_user_obj = UniversityUser(**university_user_data)
        result = university_user_operations.create(
            session, university_user_obj)
        body_html = body_html_content.replace(
            "eAddress", request_body['email'])
        body_plain = body_plain_content.replace(
            "eAddress", request_body['email'])
        body_html = body_html_content.replace(
            "password", request_body['password'])
        body_plain = body_plain_content.replace(
            "password", request_body['password'])
        send_notification(body_plain, body_html, request_body['email'])

        return {"status": True, "message": "Staff Member Added", "data": result.dict()}, 200


# updating university user in university user table
@university_user_blueprint.route("/update-university-user",  methods=['PUT'])
@jwt_required()
def update_university_user():
    with Session(get_engine()) as session:
        request_body = request.get_json()
        university_user_data = {
            'id': request_body['id'],
            'university_id': request_body['university_id'],
            'date_of_birth': request_body['date_of_birth'],
            'qualification': request_body['qualification'],
            'gender': request_body['gender'],
            'department': request_body['department'],
        }

        new_university_user_obj = UniversityUser(**university_user_data)
        old_university_user_obj = university_user_operations.get_by_id(
            session,  request_body['id'])
        result = university_user_operations.update(
            session, old_university_user_obj, new_university_user_obj)
        return {"status": True, "message": "Staff Member Updated", "data": result.dict()}, 200


@university_user_blueprint.get('/users')
@jwt_required()
def get_staff_for_university():
    email = get_jwt_identity()
    try:
        with Session(get_engine()) as session:
            user = university_user_operations.get_user_by_email(session, email)
            university_users_objs = university_user_operations.get_university_users(
                session, user.university_id)
            users = list(map(lambda x: {"id": str(
                x.id), "name": x.user.name}, university_users_objs))
        return jsonify(users)
    except Exception as exception:
        return jsonify({"Success": "False", "message": str(exception)}), 500
