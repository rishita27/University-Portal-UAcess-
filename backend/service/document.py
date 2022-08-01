"""Document Services.

Authors:
    * Aasif Faizal <aasif@dal.ca>
"""
from flask import make_response, Response

from custom_types import File
from sqlmodel import Session
from schema.document import Document, DocumentType
from schema.application import ApplicationFilesSchema
from schema.user import User
from service.cloud import upload_file, get_file
from config import Config
from storage.document import document_operations
from typing import Dict


def get_document_key(document: Document):
    """This handler forms the unique document key necessary for file upload.

    Args:
        document (Document): The document of which the key needs to be generated.

    Returns:
        str. The generated unique document key.
    """
    return '{}/{}_{}'.format(
        document.user_id, document.id, document.name)


def get_application_document_obj(
    files: ApplicationFilesSchema,
    user: User,
) -> Dict[str, Document]:
    """This service forms the document object for all the
    files in the application package.

    Args:
        files (ApplicationFilesSchema): The files in the application package.
        user (User): The user who has uploaded the files.

    Returns:
        dict[str, Document]: The key value pair containing document type
            and the document.
    """
    application_documents = {}
    for file_type, _file in files.dict().items():
        document = Document(
            user_id=user.id,
            type=DocumentType(file_type),
            name=_file.filename
        )
        application_documents[file_type] = document
    return application_documents


def create_and_upload_document(
    session: Session,
    document: Document,
    file: File,
) -> None:
    """The service that stores the document details as well
    uploads the file to the cloud. Document is the details of the
    file that is stored in the DB.

    Args:
        session (Session): The db session.
        document: The document details that needs to be created.
        file: The file that needs to be uploaded to the cloud.
    """
    document_operations.create(session, document)
    key = get_document_key(document)
    upload_file(Config.DOCUMENT_BUCKET_NAME, key, file.read())


def make_document_response(document: Document) -> Response:
    """Makes the document response required to send back to the user

    Args:
        document(Document): The document that needs to be made into an attachment

    Returns:
        Response. The flask response object.
    """
    document_key = get_document_key(document)
    response = make_response(get_file(Config.DOCUMENT_BUCKET_NAME, document_key).read())
    response.headers['Content-Disposition'] = 'attachment;filename={}'.format(document.name)
    return response
