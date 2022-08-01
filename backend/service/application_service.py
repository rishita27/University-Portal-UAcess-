"""Application Service.

Authors:
    * Amrita Krishna <amrita@dal.ca>
    * Rishita Kotiyal <rs677988@dal.ca>
"""
import uuid

from sqlmodel import Session, select

from schema.application import Application, ApplicationStatus, LanguageTest, ApplicantInstitution, ApplicationRequest
from schema.user import User, UniversityUser
from storage.application import application_operations, applicant_institution_operations
from storage.universityUser import university_user_operations
from storage.user import user_operations
from storage.db import get_engine
from assets.email_notification_submitted import submitted_plain_text, submitted_html_content
from assets.email_notification_review import review_plain_text, review_html_content
from assets.email_notification_rejected import rejected_plain_text, rejected_html_content
from assets.email_notification_approved import approved_plain_text, approved_html_content
from service.notification_service import (send_notification)

status_content = {
    ApplicationStatus.REJECTED: {
        'plain_text': rejected_plain_text,
        'html_content': rejected_html_content

    },
    ApplicationStatus.APPROVED: {
        'plain_text': approved_plain_text,
        'html_content': approved_html_content

    },
    ApplicationStatus.IN_REVIEW: {
        'plain_text': review_plain_text,
        'html_content': review_html_content
    }
}


def add_application(application_body: ApplicationRequest) -> None:
    """
    Adds the application to the database by inserting the related table entries first.
    Args:
        application_body(ApplicationRequest): request body to add application

    Returns:
        None

    """
    with Session(get_engine()) as session:
        language_test_obj = LanguageTest(**application_body.language_test.dict())
        session.add(language_test_obj)

        application_data = application_body.copy(
            deep=True, exclude={'language_test', 'applicant_institutions'}).dict()
        application_obj = Application(**application_data)
        application_obj.language_test = language_test_obj
        application_db_obj = application_operations.create(session, application_obj)

        for application_institute in application_body.applicant_institutions:
            applicant_institution_obj = ApplicantInstitution(**application_institute.dict())
            applicant_institution_obj.application = application_db_obj
            applicant_institution_operations.create(session, applicant_institution_obj)

        send_notification(submitted_plain_text, submitted_html_content, get_applicant_email(application_body.student_id))


def get_applicant_email(student_id: uuid.UUID) -> str:
    with Session(get_engine()) as session:
        student = user_operations.get_by_id(session, student_id)
        return student.email


def withdraw_application(application_id: str):
    """
    Sets the status of the application as withdrawn and removes the reviewer and updates the db.
    Args:
        application_id(str): Application id

    Returns:
        None
    """
    with Session(get_engine()) as session:
        existing_application = application_operations.get_by_id(session, application_id)
        new_application = Application.from_orm(existing_application)
        new_application.status = ApplicationStatus.WITHDRAWN
        new_application.reviewer_id = None
        application_operations.update(session, existing_application, new_application)


def review_application(query_model, email: str):
    with Session(get_engine()) as session:
        existing_application = application_operations.get_by_id(session, query_model.application_id)
        reviewer = university_user_operations.get_user_by_email(session, email)
        if existing_application is None or reviewer is None:
            raise ValueError("Invalid Application id/Reviewer id is passed")
        new_application = Application.from_orm(existing_application)
        new_application.status = query_model.status
        new_application.reviewer_id = reviewer.id
        application_operations.update(session, existing_application, new_application)
        mail_content = status_content[new_application.status]
        send_notification(mail_content['plain_text'], mail_content['html_content'],
                          get_applicant_email(existing_application.student_id))


def get_student_applications(email: str):
    """
    Returns all the applications from the db for a given student.
    Args:
        email(str): email id of the student

    Returns:
        List of applications mapped to the required response type.
    """
    with Session(get_engine()) as session:
        statement = select(Application).join(User).where(User.email == email)
        applications = session.exec(statement).all()
        return list(map(map_response_student, applications))


def get_university_applications(session: Session, university_id: uuid.UUID):
    applications = application_operations.get_all(session)

    return list(map(lambda x: x.id, filter(lambda x: x.program.university.id == university_id, applications)))


def get_application_by_id(application_id: str):
    """
    Gets a single application given the application id.
    Args:
        application_id(str): Application id

    Returns:
        The complete detail of the application including language test and applicant institution details.
    """
    with Session(get_engine()) as session:
        application = application_operations.get_by_id(session, application_id)
        language_test = application.language_test.dict().copy()
        language_test["type"] = application.language_test.type.value
        application_detail = application.dict().copy()
        application_detail["id "]= str(application.id)
        application_detail["program"] = application.program.name
        application_detail["university"] = application.program.university.name
        application_detail["program_requirements"] = application.program.requirements
        application_detail["status"] = application.status.value
        application_detail["reviewer_name"] = application.reviewer.user.name if application.reviewer else None
        application_detail["language_test"] = language_test
        application_detail["applicant_institutions"] = list(map(map_application_institution, application.applicant_institutions))
        return application_detail


def map_application_institution(applicant_institution):
    """
    Maps the institution completion status value for serialization.
    Args:
        applicant_institution(ApplicantInstitution):

    Returns:
        dict value of the applicant institution with completion status as string.
    """
    mapped_value = applicant_institution.dict()
    mapped_value["completion_status"] = applicant_institution.completion_status.value
    return mapped_value


def get_reviewer_applications(email: str):
    with Session(get_engine()) as session:
        statement = (select(Application)
                     .join(User, Application.reviewer_id == User.id)
                     .where(User.email == email and Application.status != ApplicationStatus.WITHDRAWN))
        applications = session.exec(statement).all()
        return list(map(map_response_reviewer, applications))


def map_response_student(application: Application):
    """
    Maps the application to the a response required by the Applications list page.
    Args:
        application(Application): Complete application

    Returns:
        Only required fields from the application as a dict.
    """
    id = application.id
    program = application.program.name
    university = application.program.university.name
    status = application.status.value
    return {"id": id, "program": program, "university": university, "status": status}


def map_response_reviewer(application: Application):
    return {"id": application.id, "program": application.program.name, "student": application.student_id,
            "status": application.status.value}
