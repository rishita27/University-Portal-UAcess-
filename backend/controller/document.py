"""Document Controller.

Authors:
    * Aasif Faizal <aasif@dal.ca>
"""
from uuid import UUID

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlmodel import Session

from config import Config
from schema.application import ApplicationFilesSchema
from schema.user import UserImage
from service.document import get_application_document_obj, create_and_upload_document, make_document_response
from storage.application import application_operations
from storage.db import get_engine
from schema.document import Document, DocumentsFetchSchema, DocumentUploadFileSchema, DocumentUploadFormSchema
from storage.document import document_operations
from storage.user import user_operations
from service.cloud import upload_file
from controller.validator import validate
from custom_types import File
document_blueprint = Blueprint(
    'document_blueprint', __name__, url_prefix='/document')


@document_blueprint.get('/<string:document_id>')
@jwt_required()
def get_document(document_id: str):
    """Controller that fetches document from the cloud by its id.

    Args:
        document_id (str): The id of the document that needs to be fetched.

    Returns:
        File: The document fetched from the cloud.
    """
    email = get_jwt_identity()
    with Session(get_engine()) as session:
        document = document_operations.get_user_document(session, document_id, email)
        if not document:
            return jsonify({'error_message': 'Document not found'}), 404
        response = make_document_response(document)
    return response


@document_blueprint.post('/upload_application_package')
@jwt_required()
@validate
def upload_application_documents(files: ApplicationFilesSchema):
    """Controller that uploads the application related files to the cloud.

    Args:
        files (ApplicationFilesSchema): The files necessary for the creation of university application.

    Returns:
        dict: The key value pair of document along with its id.
    """
    email = get_jwt_identity()
    response_data = {}
    with Session(get_engine()) as session:
        user = user_operations.get_by_email(session, email)
        documents = get_application_document_obj(files, user)
        response_data['user_id'] = user.id
        for document_type, document in documents.items():
            file = getattr(files, document_type)
            create_and_upload_document(session, document, file)
            response_data[document_type] = document.id
        return jsonify(response_data)


@document_blueprint.post('/profile_picture')
@jwt_required()
@validate
def profile_picture(files: UserImage):
    """Controller that uploads the user image and returns the uploaded URL.

    Args:
        files (UserImage): The user image being uploaded.

    Returns:
        dict. The dictionary containing the document_url
    """
    email = get_jwt_identity()
    with Session(get_engine()) as session:
        user = user_operations.get_by_email(session, email)
        file_extension = files.image.content_type.split('/')[-1]
        filename = f'{user.id}.{file_extension}'
        upload_file(Config.PROFILE_PIC_BUCKET_NAME, filename, files.image.read())
        return jsonify({
            'image_url': f'{Config.PROFILE_PIC_URL_PREFIX}/{filename}'
        })


@document_blueprint.get('/get_all')
@jwt_required()
def get_all_docs():
    """Fetches all the document for a user."""
    email = get_jwt_identity()
    with Session(get_engine()) as session:
        documents = document_operations.get_user_documents(session, email)
        response_obj = DocumentsFetchSchema(documents=documents)
        return jsonify(response_obj.dict())


@document_blueprint.post('/')
@jwt_required()
@validate
def upload_document(files: DocumentUploadFileSchema, form: DocumentUploadFormSchema):
    """The controller helps in uploading a document.

    Args:
        files(DocumentUploadFileSchema): The files' dict which contains the
            document to be uploaded.
        form(DocumentUploadFormSchema): The document details.

    """
    email = get_jwt_identity()
    with Session(get_engine()) as session:
        user = user_operations.get_by_email(session, email)
        document = Document(name=files.document.filename, type=form.file_type, user_id=user.id)
        create_and_upload_document(session, document, files.document)
        return jsonify({'message': 'Document uploaded successfully'})


@document_blueprint.get('/reviewer/<string:application_id>/<string:document_id>')
@jwt_required()
def get_review_document(application_id: str, document_id: str):
    email = get_jwt_identity()
    with Session(get_engine()) as session:
        application = application_operations.get_reviewer_application(session, application_id, email)
        documents = {application.resume_doc_id, application.language_test_doc_id, application.transcript_doc_id}
        document = document_operations.get_by_id(session, document_id)
        if UUID(document_id) not in documents or not document:
            return jsonify({'error_message': 'Document not found'}), 404
        response = make_document_response(document)
    return response


@document_blueprint.get('/dumm_doc')
def add_dummy_user():
    """
    Dummy function to create document directly without the business logic.
    Returns:
        Success on creation.
    """
    with Session(get_engine()) as session:
        user_data = {
            'user_id': 'acc9b258f47f420e893acdec0b65e32f',
            'type': 'language_test',
            'url': 'something'
        }
        document_operations.create(session, Document(**user_data))
    return "success"

