"""University Services.

Authors:
    * Aasif Faizal <aasif@dal.ca>
"""

from sqlmodel import Session
from schema.university import UniversitySearchResponseSchema, UniversitySearchEntitySchema
from storage.university import university_operations


def get_university_search_results(
    session: Session,
    search_key: str,
    page: int
) -> UniversitySearchResponseSchema:
    """Fetches the paginated list of university.

    Args:
        session (Session): The DB session.
        search_key (str): The search_key by which university search
            needs to be executed.
        page (int): The page number to be fetched.

    Returns:
        UniversitySearchResponseSchema. The universities fetched from the DB.
    """
    results, more = university_operations.get_universities(session, search_key, page)
    universities = []
    for result in results:
        university, avg_fees, programs = result
        university_response = UniversitySearchEntitySchema(
            avg_fees=avg_fees, programs=programs, **university.dict())
        universities.append(university_response.dict())
    return UniversitySearchResponseSchema(universities=universities, more=more, page=page)
