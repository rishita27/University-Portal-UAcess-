"""Program Controller. It is used for performing CRUD operations on program table. 
 Here University's programs are been added or modified.

Author:
    * Foram Gaikwad <foram.gaikwad@dal.ca>
"""

from flask import Blueprint, jsonify, request
from sqlmodel import Session, select
from storage.db import get_engine
from schema.university import UniversityProgram
from storage.program import program_operations
from storage.db import BaseModel
from uuid import UUID
from flask_jwt_extended import jwt_required


program_blueprint = Blueprint(
    'program_blueprint', __name__, url_prefix='/university')


# updating program row in university program table
@program_blueprint.route("/update-program",  methods=['POST'])
@jwt_required()
def update_program():
    with Session(get_engine()) as session:
        request_body = request.get_json()
        program_data = {
            'name': request_body['name'],
            'university_id': request_body['university_id'],
            'description': request_body['description'],
            'term_length': request_body['term_length'],
            'course_level': request_body['course_level'],
            'department': request_body['department'],
            'fees': request_body['fees'],
            'scholarship': request_body['scholarship'],
            'requirements': request_body['requirements'],
            'id': request_body['id'],
        }

        new_program_obj = UniversityProgram(**program_data)

        old_program_obj = program_operations.get_by_id(
            session, request_body['id'])
        result = program_operations.update(
            session, old_program_obj, new_program_obj)
    return {"status": True, "message": "Programs updated", "data": result.dict()}, 200


# creating program row in university program table
@program_blueprint.route("/add-program",  methods=['POST'])
@jwt_required()
def add_program():
    with Session(get_engine()) as session:
        request_body = request.get_json()
        program_data = {
            'name': request_body['name'],
            'university_id': request_body['university_id'],
            'description': request_body['description'],
            'term_length': request_body['term_length'],
            'course_level': request_body['course_level'],
            'department': request_body['department'],
            'fees': request_body['fees'],
            'scholarship': request_body['scholarship'],
            'requirements': request_body['requirements'],
        }
        result = get_all_programs(
            session, UniversityProgram, request_body['university_id'])
        if result['status']:
            programData = result['data']
            for P in programData:
                if(P['name'] == request_body['name'] and P['department'] == request_body['department']):
                    return {"status": False, "message": "Same program found"}, 400

        new_program_obj = UniversityProgram(**program_data)
        result = program_operations.create(session, new_program_obj)

        return {"status": True, "message": "Programs added", "data": result.dict()}, 200


# fetching all programs from university program table
@program_blueprint.route("/get-programs",  methods=['POST'])
@jwt_required()
def get_programs():
    with Session(get_engine()) as session:
        request_body = request.get_json()
        old_program_obj = get_programs_by_uuid(
            session, UniversityProgram, request_body['university_id'])
        programs = []
        for p1 in old_program_obj:
            programs.append(p1.dict())

        if(programs):
            return {"status": True, "message": "All programs found", "data": programs}, 200
        else:
            return {"status": False, "message": "No program found"}, 404


def get_all_programs(session: Session, obj: BaseModel, uuid: UUID):
    statement = select(obj).where(
        obj.university_id == uuid)
    result = session.exec(statement).all()
    old_programs = []
    if result is None:
        return {"status": False, "message": "No program found"}
    else:
        for prog in result:
            old_programs.append(prog.dict())
        return {"status": True, "message": "Programs found", "data": old_programs}


def get_programs_by_uuid(session: Session, obj: BaseModel, uuid: UUID):
    statement = select(UniversityProgram).where(
        UniversityProgram.university_id == uuid)
    return session.exec(statement).all()
