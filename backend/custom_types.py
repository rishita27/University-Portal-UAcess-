"""Custom Types.

Authors:
    * Aasif Faizal <aasif@dal.ca>
"""

from werkzeug.datastructures import FileStorage


class File(FileStorage):

    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not isinstance(v, FileStorage):
            raise TypeError('File required')
        return v

    def __repr__(self):
        return f'File()'
