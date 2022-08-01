"""DB Connection file.

Authors:
    * Aasif Faizal <aasif@dal.ca>
"""

import os
import re
import uuid

from sqlalchemy.engine import Engine
from sqlalchemy.orm import declared_attr
from sqlmodel import SQLModel, Field, create_engine
from typing import Optional
import urllib.parse


def get_underscore_table_name(name: str) -> str:
    """Converts string to underscored value.
    Used the logic from infection library.
    https://github.com/jpvanhal/inflection/blob/b00d4d348b32ef5823221b20ee4cbd1d2d924462/inflection/__init__.py#L397
    Args:
        name (str): Table name

    Returns:
        str: The underscored string.
    """
    name = re.sub(r"([A-Z]+)([A-Z][a-z])", r'\1_\2', name)
    name = re.sub(r"([a-z\d])([A-Z])", r'\1_\2', name)
    name = name.replace("-", "_")
    return name.lower()


def uuid_generator() -> uuid.UUID:
    """This function is used to generate an uuid for a new object before inserting
    it to the database. This is a workaround for the sqlmodel's issue of throwing
    error for uuids with leading 0's
    https://github.com/tiangolo/sqlmodel/issues/25#issuecomment-982039809
    # TODO: Remove this method when SQLModel updates GUID handling.
    Returns:
        UUID. A new uuid.
    """
    _uuid = uuid.uuid4()
    while _uuid.hex[0] == '0':
        _uuid = uuid.uuid4()
    return _uuid


class BaseModel(SQLModel):
    @declared_attr
    def __tablename__(cls) -> str:
        return get_underscore_table_name(cls.__name__)

    id: Optional[uuid.UUID] = Field(
        default_factory=uuid_generator, primary_key=True, index=True)


def get_engine() -> Engine:
    config = {
        'engine': os.getenv('DB_ENGINE'),
        'user': os.getenv('DB_USER'),
        'password': urllib.parse.quote(os.getenv('DB_PASSWORD')),
        'host': os.getenv('DB_HOST'),
        'db': os.getenv('DB_DATABASE')
    }
    engine = create_engine(
        '{engine}://{user}:{password}@{host}/{db}'.format(**config))
    return engine
