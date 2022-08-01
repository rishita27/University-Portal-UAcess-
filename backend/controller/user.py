"""User Controller. This controller file used for managing all user table related CRUD operations.

Authors:
    * Rushit Jasoliya <rushit.jasoliya@dal.ca>
"""

from flask import Blueprint, request, jsonify
from sqlmodel import Session, select
from storage.db import get_engine
from schema.user import User
from storage.user import user_operations
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from assets.email_notification_reset_password import body_html_content, body_plain_content
from service.notification_service import (send_notification)
import random


user_blueprint = Blueprint(
    'user_blueprint', __name__, url_prefix='/user')


# To get user from database based on email id, which provided via parameter in JSON form.
@user_blueprint.post("/getUser")
@jwt_required()
def get_user():
    with Session(get_engine()) as session:
        req_data = request.get_json()
        result = get_by_email(session, req_data['email'])
        if result is None:
            return {"status": False, "message": "User Not Exist in system."}
        else:
            return {"status": True, "message": "User Found", "data": result.dict()}


# To create new user with Name, Email, Password and Type of User, which provided via parameter in JSON form.
@user_blueprint.post("/registerUser")
def register_user():
    with Session(get_engine()) as session:
        req_data = request.get_json()
        actual_user_data = user_exist(session, req_data['email'])
        print("actual_user", actual_user_data)
        if not actual_user_data['status']:
            user_data = {
                'name': req_data['name'],
                'email': req_data['email'],
                'password': req_data['password'],
                'type': req_data['type']
            }
            user_obj = User(**user_data)
            user_operations.create(session, user_obj)
            return {"status": True, "message": "User Created Successfully.", "data": user_obj.dict()}, 200
        else:
            return {"status": False, "message": "User already exist with email address."}, 400


# To verify / authenticate user's login request to UAccess, email and password should provide via parameter in JSON form.
@user_blueprint.post("/loginUser")
def login_user():
    with Session(get_engine()) as session:
        req_data = request.get_json()
        actual_user_data = user_exist(session, req_data['email'])
        if actual_user_data['status']:
            user_data = actual_user_data['data']
            if req_data['password'] == user_data['password']:
                access_token = create_access_token(identity=req_data['email'])
                return {"status": True, "message": "Login Successfully.", "data": user_data, "access_token": access_token}, 200
            else:
                return {"status": False, "message": "Wrong Password"}, 400
        else:
            return {"status": False, "message": "User Not Exist in system."}, 404


# To update user's personal information on UAccess database, all details provided via parameter in JSON form.
@user_blueprint.post("/updateUser")
@jwt_required()
def update_user():
    with Session(get_engine()) as session:
        req_data = request.get_json()
        old_user_data = get_by_email(session, req_data['email'])
        print("old:",old_user_data)
        if old_user_data is None:
            return {"status": False, "message": "User Not Exist in system."}, 404
        elif old_user_data.dict().get('password') != req_data['password']:
            return {"status": False, "message": "Old password does not match"}, 404
        else:
            user_data = {
                'name': req_data['username'],
                'email': req_data['email'],
                'password': req_data['password'],
                'type': old_user_data.dict().get('type'),
                'id': old_user_data.dict().get('id')
            }
            new_user_obj = User(**user_data)

            result = user_operations.update(
                session, old_user_data, new_user_obj)
            return {"status": True, "message": "User data updated Successfully !!!", "data": result.dict()}, 200


# To send OTP code for user's forgot password request (For now it works for only gmail domain).
@user_blueprint.post("/forgotPassword")
def send_verification_code():
    with Session(get_engine()) as session:
        req_data = request.get_json()
        actual_user_data = user_exist(session, req_data['email'])
        if actual_user_data['status']:
            otp = random.randint(1000, 9999)
            otp = str(otp)
            body_html = body_html_content.replace("$(otp)", otp)
            body_plain = body_plain_content.replace("$(otp)", otp)
            send_notification(body_plain, body_html, req_data['email'])

            return {"status": True, "message": "Otp Sent to User", "otp": otp}, 200
        else:
            return {"status": False, "message": "User Not Exist in system."}, 404


# To update user's login password on UAccess database, email should be provided via parameter in JSON form.
@user_blueprint.post("/changePassword")
def change_password():
    with Session(get_engine()) as session:
        req_data = request.get_json()
        old_user_data = get_by_email(session, req_data['email'])
        if old_user_data is None:
            return {"status": False, "message": "User Not Exist in system."}, 404
        else:
            user_data = {
                'name': old_user_data.dict().get('name'),
                'email': req_data['email'],
                'password': req_data['password'],
                'type': old_user_data.dict().get('type'),
                'id': old_user_data.dict().get('id')
            }
            new_user_obj = User(**user_data)

            result = user_operations.update(
                session, old_user_data, new_user_obj)
            return {"status": True, "message": "Password Changed Successfully !!!", "data": result.dict()}, 200


# Method to check whether user exist in system or not.
def user_exist(session, email):
    statement = select(User).where(User.email == email)
    result = session.exec(statement).first()
    if result is None:
        return {"status": False, "message": "User Not Exist in system."}
    else:
        return {"status": True, "message": "User Found", "data": result.dict()}


# Method to get user via email address from database.
def get_by_email(session, email):
    statement = select(User).where(User.email == email)
    return session.exec(statement).first()

@user_blueprint.post('/validate')
@jwt_required()
def validate_user():
    """Validates the if the user is present."""
    email = get_jwt_identity()
    with Session(get_engine()) as session:
        response: dict = user_exist(session, email)
    if 'data' in response:
        response['data'].pop('password', None)
    status = 200 if response['status'] else 404
    return jsonify(response), status
