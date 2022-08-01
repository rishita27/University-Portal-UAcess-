from typing import List
from uuid import UUID

from sqlmodel import Session, select

from storage.base import BaseOperations
from schema.user import UniversityUser, User


class UniversityUserOperations(BaseOperations):
    model = UniversityUser

    def get_user_by_email(self, session: Session, email: str) -> UniversityUser:
        statement = select(self.model).join(User).where(User.email == email)
        return session.exec(statement).first()

    def get_university_users(self, session: Session, university_id: UUID) -> List[UniversityUser]:
        statement = select(self.model).where(
            self.model.university_id == university_id)
        return session.exec(statement).all()


university_user_operations = UniversityUserOperations()
