from typing import List

from sqlmodel import select, Session

from schema.application import Application
from storage.base import BaseOperations
from schema.document import Document
from schema.user import User


class DocumentOperations(BaseOperations):
    model = Document

    def get_user_document(self, session, document_id: str, email: str) -> Document:
        statement = select(self.model).join(User).where(
            self.model.id == document_id, User.email == email)
        return session.exec(statement).first()

    def get_user_documents(self, session, email: str) -> List[Document]:
        statement = select(self.model).join(User).where(User.email == email)
        return session.exec(statement).all()


document_operations = DocumentOperations()
