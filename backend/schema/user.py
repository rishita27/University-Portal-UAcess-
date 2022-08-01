"""User Schema.

Authors:
    * Aasif Faizal <aasif@dal.ca>
    * Amrita Krishna <amrita@dal.ca>
    * Rushit Jasoliya <rushit.jasoliya@dal.ca>
    * Foram Gaikwad <foram.gaikwad@dal.ca>
"""

import enum
import uuid
import datetime
from sqlmodel import Field, Enum, Column, Relationship, String, Text, SQLModel
from sqlalchemy.orm import relationship, backref

from custom_types import File
from storage.db import BaseModel
from typing import TYPE_CHECKING, Optional

if TYPE_CHECKING:
    from schema.university import University
    from schema.application import Application


class UserType(str, enum.Enum):
    """The types of user in the application."""
    ADMIN = 'admin'
    STAFF = 'staff'
    STUDENT = 'student'
    UNIVERSITY = 'university'


class User(BaseModel, table=True):
    """Stores the generalized users registering to the application"""
    name: str
    email: str = Field(sa_column=Column(String(255), unique=True, nullable=False))
    password: str
    type: UserType = Field(sa_column=Column(Enum(UserType), nullable=False))


class UniversityUser(BaseModel, table=True):
    """Stores university as a specialized user."""
    id: uuid.UUID = Field(foreign_key='user.id', primary_key=True)
    university_id: uuid.UUID = Field(foreign_key='university.id')
    date_of_birth: datetime.date
    department: str
    qualification: str
    gender: str
    image_url: str = Field(sa_column=Column(Text))
    user: User = Relationship(sa_relationship=relationship(
        'User', backref=backref('university_user', uselist=False)))
    university: "University" = Relationship(back_populates='users')
    applications: "Application" = Relationship(back_populates='reviewer')


class UserImage(SQLModel):
    image: File
