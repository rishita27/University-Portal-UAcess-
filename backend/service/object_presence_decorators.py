"""Object presence decorators.

Authors:
    * Aasif Faizal <aasif@dal.ca>

This service checks if the object is present in the DB.
"""

from functools import wraps

from flask import request, jsonify
from sqlmodel import Session

from storage.db import get_engine
from storage.university import university_operations


def is_university_present(func):
    """Handler decorator that checks if the university in provided in
    its url is present or not.

    Args:
        func: The Flask request handler.

    Returns:
        function: The new decorated function that checks the presence of
            the university before the request is carried away
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        """Checks if university is present.
        Args:
            *args: The arguments of the handler.
            **kwargs: The keyword arguments of the handler.

        Returns:

        """
        university_id = (
            kwargs.get('university_id')
            or request.args.get('university_id')
            or request.json.get('university_id')
        )
        with Session(get_engine()) as session:
            university = university_operations.get_by_id(session, university_id)
            if not university:
                return jsonify({'error_message': 'university not found'}), 404
        return func(*args, **kwargs)
    return wrapper
