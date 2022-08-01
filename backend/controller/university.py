"""University Controller. It is used for performing CRUD operations on university table.

Authors:
    * Aasif Faizal <aasif@dal.ca>
    * Amrita Krishna <amrita@dal.ca>
    * Foram Gaikwad <foram.gaikwad@dal.ca>
    * Rushit Jasoliya <rushit.jasoliya@dal.ca>
"""
from flask import Blueprint, jsonify, request
from sqlmodel import Session, select
from storage.db import get_engine
from schema.university import University, UniversitySearchQuerySchema, UniversityRead
from service.university import get_university_search_results
from service.object_presence_decorators import is_university_present
from controller.validator import validate
from storage.university import university_operations
from controller.user import get_by_email
from flask_jwt_extended import jwt_required
from config import Config
from service.cloud import upload_file
 

university_blueprint = Blueprint(
    'university_blueprint', __name__, url_prefix='/university')


# fetching university from university table
@university_blueprint.route("/get-university",  methods=['POST'])
@jwt_required()
def get_university():
    with Session(get_engine()) as session:
        request_body = request.get_json()
        university_obj = university_operations.get_by_id(
            session, request_body['id'])
        if university_obj is None:
            return {"status": False, "message": "No University found"}, 404
        else:
            email = university_obj.dict()['email']
            userRec = get_by_email(session, email)
            uni_rec = university_obj.dict()
            uni_rec['password'] = userRec.dict()['password']
            return {"status": True, "message": "University found", "data": uni_rec}, 200


# fetching all university for admin from university table
@university_blueprint.get("/getAllUnivesities")
@jwt_required()
def get_all_universities():
    with Session(get_engine()) as session:
        statement = select(University)
        university_obj = session.exec(statement).all()
        if university_obj is None:
            return {"status": False, "message": "No University found"}, 404
        else:
            universities = []
            for uni in university_obj:
                universities.append(uni.dict())
            return {"status": True, "message": "University found", "data": universities}, 200


# fetching university from university table
@university_blueprint.route("/get-university-email",  methods=['POST'])
@jwt_required()
def get_university_by_email():
    with Session(get_engine()) as session:
        request_body = request.get_json()
        statement = select(University).where(
            University.email == request_body['email'])
        result = session.exec(statement).first()
        if result is None:
            return {"status": False, "message": "University Not Exist in system."}, 404
        else:
            return {"status": True, "message": "University Found", "data": result.dict()}, 200


# creating university row in university table
@university_blueprint.post("/createUniversity")
def create_university():
    with Session(get_engine()) as session:
        req_data = request.get_json()
        university_data = {
            'name': req_data['name'],
            'description': req_data['description'],
            'address': req_data['address'],
            'phone': req_data['phone'],
            'email': req_data['email'],
            'status': req_data['status'],
        }
        uni_obj = University(**university_data)
        university_operations.create(session, uni_obj)
        return {"status": True, "message": "University created", "data": uni_obj.dict()}, 200


# updating university status in university table
@university_blueprint.post("/updateUniversityStatus")
@jwt_required()
def update_university_status():
    with Session(get_engine()) as session:
        request_body = request.get_json()
        university_data = {
            'status': request_body['status'],
            'id': request_body['id'],
        }
        new_university_obj = University(**university_data)
        old_university_obj = university_operations.get_by_id(
            session, request_body['id'])
        result = university_operations.update(
            session, old_university_obj, new_university_obj)
    return {"status": True, "message": "University Status Updated Successfully !!!", "data": result.dict()}, 200


# updating university row in university table
@university_blueprint.route("/update-university",  methods=['PUT'])
@jwt_required()
def update_university():
    with Session(get_engine()) as session:
        imageData = request.files['content']
        file_extension = imageData.content_type.split('/')[-1]
        uniId = request.form['id']
        filename = f'{uniId}.{file_extension}'
        print("Imagename : ", filename)
        upload_file(Config.PROFILE_PIC_BUCKET_NAME, filename, imageData.read())

        university_data = {
            'name': request.form['name'],
            'description': request.form['description'],
            'address': request.form['address'],
            'phone': request.form['phone'],
            'email': request.form['email'],
            'id': request.form['id'],
            'image_url': f'{Config.PROFILE_PIC_URL_PREFIX}/{filename}'
        }

        new_university_obj = University(**university_data)
        old_university_obj = university_operations.get_by_id(
            session, request.form['id'])
        result = university_operations.update(
            session, old_university_obj, new_university_obj)
    return {"status": True, "message": "University updated", "data": result.dict()}, 200


@university_blueprint.get('/get-universities')
@jwt_required()
@validate
def get_universities(query: UniversitySearchQuerySchema):
    """Controller which fetches the paginated list of universities. By default,
    page 0 is being fetched with no search key if both aren't provided.

    Args:
        query (UniversitySearchQuerySchema): Query parameters of the request
            containing optional page_no and optional search_key.

    Returns:
        UniversitySearchResponseSchema: List of paginated universities and
            more flag which indicates if there are more data in the DB.
    """
    with Session(get_engine()) as session:
        result = get_university_search_results(
            session, query.search_key, query.page)
    return jsonify(result.dict())


@university_blueprint.get('/<string:university_id>')
@jwt_required()
@is_university_present
def get_university_details(university_id: str):
    """Controller that fetches details of the university by its id.
    Args:
        university_id (str): The id of the university that needs to be fetched.

    Returns:
        UniversityRead: The university details.
    """
    with Session(get_engine()) as session:
        result = university_operations.get_by_id(session, university_id)
        return jsonify(UniversityRead.from_orm(result).dict())
