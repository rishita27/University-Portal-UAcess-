"""ApplicationOperations, LanguageTestOperations and ApplicantInstitutionOperations.

Authors:
    * Amrita Krishna <amrita@dal.ca>

"""
from sqlmodel import Session, select

from schema.user import User
from storage.base import BaseOperations
from schema.application import Application, LanguageTest, ApplicantInstitution


class ApplicationOperations(BaseOperations):
    model = Application

    def get_reviewer_application(
        self, session: Session,
        application_id: str,
        reviewer_email: str
    ) -> Application:
        statement = (select(self.model)
                     .join(User, self.model.reviewer_id == User.id)
                     .where(self.model.id == application_id, User.email == reviewer_email))
        return session.exec(statement).first()


class LanguageTestOperations(BaseOperations):
    model = LanguageTest


class ApplicantInstitutionOperations(BaseOperations):
    model = ApplicantInstitution


application_operations = ApplicationOperations()
language_test_operations = LanguageTestOperations()
applicant_institution_operations = ApplicantInstitutionOperations()
