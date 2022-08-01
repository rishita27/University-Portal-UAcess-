"""DB interaction base file.

Authors:
    * Aasif Faizal <aasif@dal.ca>

Common interactions with DB.
"""

from abc import ABC, abstractmethod
from uuid import UUID
from typing import Type, List, Tuple, TypeVar, Union, Any

from sqlalchemy.sql import Select
from sqlmodel import Session, select, func
from storage.db import BaseModel

DBResult = TypeVar('DBResult')


class BaseOperations(ABC):
    """Abstract class for DB operations."""
    PAGINATION_LIMIT = 510
    EXCLUDED_FIELDS = ['id']

    @property
    @abstractmethod
    def model(self) -> Type[BaseModel]:
        """The model for which the operations need to be executed."""
        pass

    def get_by_id(self, session: Session, uuid: Union[UUID, str]) -> DBResult:
        """Fetches the object from DB by its ID

        Args:
            session (Session): The DB session
            uuid (Union[UUID, str]): The uuid of the object.

        Returns:
            DBResult. The object corresponding to the uuid provided.
        """
        statement = select(self.model).where(self.model.id == uuid)
        return session.exec(statement).first()

    def get_multiple_rows(
        self, session: Session,
        offset: int = 0,
        limit: int = PAGINATION_LIMIT,
        sa_query: Select = None
    ) -> List[DBResult]:
        statement_prefix = sa_query if sa_query is not None else select(self.model)
        statement = statement_prefix.offset(offset).limit(limit)
        return session.exec(statement).all()

    def get_paginated_rows(
        self, session: Session,
        sa_query: Select = None,
        where_clause: bool = None,
        page: int = 0,
    ) -> Tuple[List[DBResult], bool]:
        count_statement = select(func.count(self.model.id))
        if where_clause is not None:
            count_statement = count_statement.where(where_clause)
            sa_query = sa_query.where(where_clause)
        count: int = session.exec(count_statement).first()
        offset: int = page * self.PAGINATION_LIMIT if page else 0
        more = True if count > offset + self.PAGINATION_LIMIT + 1 else False
        return self.get_multiple_rows(session, offset, sa_query=sa_query), more

    def get_all(self, session: Session) -> List[DBResult]:
        statement = select(self.model)
        return session.exec(statement).all()

    @staticmethod
    def create(session: Session, obj: BaseModel) -> BaseModel:
        session.add(obj)
        session.commit()
        session.refresh(obj)
        return obj

    def update(
        self,
        session: Session,
        obj: BaseModel,
        new_obj: BaseModel,
        autocommit: bool = True
    ) -> BaseModel:
        updated_data = new_obj.dict(exclude_unset=True)
        for field, value in updated_data.items():
            if field not in self.EXCLUDED_FIELDS:
                setattr(obj, field, value)
        session.add(obj)
        if autocommit:
            session.commit()
            session.refresh(obj)
        return obj
