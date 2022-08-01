"""User and University User (Staff Member) storage operations.

Authors:
    * Rushit Jasoliya <rushit.jasoliya@dal.ca>
"""
from sqlmodel import Session, select

from storage.base import BaseOperations
from schema.user import User
from schema.user import UniversityUser


class UserOperations(BaseOperations):
    model = User

    def get_by_email(self, session: Session, email: str) -> User:
        statement = select(self.model).where(self.model.email == email)
        return session.exec(statement).first()


class UniUserOperations(BaseOperations):
    model = UniversityUser


user_operations = UserOperations()
uni_user_operations = UniUserOperations()