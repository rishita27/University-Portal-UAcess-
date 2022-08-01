"""University storage operations.

Authors:
    * Aasif Faizal <aasif@dal.ca>
"""

from sqlmodel import Session, select, func
from typing import Tuple, List
from storage.base import BaseOperations, DBResult
from schema.university import University, UniversityProgram, UniversityStatus


class UniversityOperations(BaseOperations):
    model = University

    def get_universities(
        self, session: Session,
        search_key: str,
        page: int
    ) -> Tuple[List[DBResult], bool]:

        sa_query = (select(self.model, func.avg(UniversityProgram.fees), func.count(UniversityProgram.id))
                    .where(self.model.status == UniversityStatus.APPROVED)
                    .join(UniversityProgram, isouter=True)
                    .group_by(self.model.id))
        where_clause = self.model.name.like('%{}%'.format(search_key)) if search_key else None
        return self.get_paginated_rows(
            session=session, sa_query=sa_query, where_clause=where_clause, page=page)


university_operations = UniversityOperations()
