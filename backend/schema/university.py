"""University Schema.

Authors:
    * Aasif Faizal <aasif@dal.ca>
    * Amrita Krishna <amrita@dal.ca>
    * Foram Gaikwad <foram.gaikwad@dal.ca>
    * Rushit Jasoliya <rushit.jasoliya@dal.ca>
"""

import enum
import uuid
from typing import Optional, List, TYPE_CHECKING
from storage.db import BaseModel
from sqlmodel import Enum, Field, Column, Text, Relationship, SQLModel

if TYPE_CHECKING:
    from schema.application import Application
    from schema.user import UniversityUser


class CourseLevel(str, enum.Enum):
    """Different course levels supported."""
    GRAD = 'graduate'
    UNDER_GRAD = 'under_graduate'


class UniversityStatus(str, enum.Enum):
    """Different statuses of the university"""
    APPROVED = 'approved'
    REJECTED = 'rejected'
    PENDING = 'pending'


class UniversityBase(SQLModel):
    """The base class of the university entity containing the common fields."""
    name: str
    description: str = Field(sa_column=Column(Text), nullable=False)
    address: str
    phone: str
    email: str  # Check if it needs to be removed
    image_url: str = Field(sa_column=Column(Text))


class University(BaseModel, UniversityBase, table=True):
    """Stores the university."""
    status: UniversityStatus = Field(
        sa_column=Column(Enum(UniversityStatus), server_default=UniversityStatus.PENDING))
    users: Optional[List["UniversityUser"]] = Relationship(
        back_populates='university')
    programs: Optional[List["UniversityProgram"]
                       ] = Relationship(back_populates='university')


class UniversityProgram(BaseModel, table=True):
    """Stores the programs that are offered by the university"""
    name: str
    university_id: uuid.UUID = Field(
        foreign_key="university.id", nullable=False)
    description: str = Field(sa_column=Column(Text), nullable=False)
    term_length: int
    course_level: CourseLevel = Field(
        sa_column=Column(Enum(CourseLevel)), nullable=False)
    department: str
    fees: int
    scholarship: str
    requirements: str = Field(sa_column=Column(Text), nullable=False)
    university: University = Relationship(back_populates='programs')
    applications: "Application" = Relationship(back_populates='program')


class UniversityRead(UniversityBase):
    """The schema for pre-populating the programs under a university."""
    programs: Optional[List[UniversityProgram]]


UniversityRead.update_forward_refs()


class UniversitySearchQuerySchema(SQLModel):
    """Schema for the query params used in university search."""
    search_key: Optional[str]
    page: Optional[int] = 0


class UniversitySearchEntitySchema(SQLModel):
    """The schema for the response of each university card
    in university search."""
    id: uuid.UUID
    name: str
    address: str
    image_url: Optional[str]
    avg_fees: Optional[float]
    programs: int


class UniversitySearchResponseSchema(SQLModel):
    """The schema for the response of search university."""
    page: int
    more: bool
    universities: List[UniversitySearchEntitySchema]
