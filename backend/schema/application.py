"""Application Schema

Authors:
    * Aasif Faizal <aasif@dal.ca>
    * Amrita Krishna <amrita@dal.ca>
"""

import enum
import uuid
from sqlmodel import Field, Column, Enum, Text, Relationship, SQLModel
from sqlalchemy.orm import relationship, backref

from storage.db import BaseModel
from typing import Optional, TYPE_CHECKING, List
from schema.user import User, UniversityUser
from custom_types import File

if TYPE_CHECKING:
    from schema.university import UniversityProgram


class CompletionStatus(enum.Enum):
    """The completion status of an applicant in an institution."""
    ONGOING = 'ongoing'
    COMPLETED = 'completed'
    NOT_COMPLETED = 'not_completed'


class LanguageTestType(enum.Enum):
    """The different language tests."""
    IELTS = 'ielts'
    TOEFL = 'toefl'
    PTE = 'pte'
    OTHER = 'other'


class ApplicationStatus(enum.Enum):
    """The different student application statuses"""
    SUBMITTED = 'submitted'
    IN_REVIEW = 'in_review'
    APPROVED = 'approved'
    REJECTED = 'rejected'
    WITHDRAWN = 'withdrawn'


class ApplicantInstitutionBase(SQLModel):
    """The base class for applicant's previous or present
    institutes required for the application.
    """
    name: str
    degree: str
    course: str
    major: str
    cgpa: float
    city: str
    country: str
    completion_status: CompletionStatus = Field(
        sa_column=Column(Enum(CompletionStatus), nullable=False))


class ApplicantInstitution(BaseModel, ApplicantInstitutionBase, table=True):
    """Stores the previous or current institute details
    in the university application.
    """
    application_id: uuid.UUID = Field(foreign_key='application.id')
    application: "Application" = Relationship(back_populates='applicant_institutions')


class LanguageBase(SQLModel):
    """The base class for language test result of the applicant."""
    type: LanguageTestType = Field(sa_column=Column(Enum(LanguageTestType), nullable=False))
    reading: float
    writing: float
    listening: float
    speaking: float
    overall: float


class LanguageTest(BaseModel, LanguageBase, table=True):
    """Stores the language test details of an applicant for an application."""
    pass


class ApplicationBaseClass(SQLModel):
    """The base class of application"""
    program_id: uuid.UUID = Field(foreign_key='university_program.id')
    student_id: uuid.UUID = Field(foreign_key='user.id')
    first_name: str
    middle_name: Optional[str]
    last_name: str
    address_line_1: str
    address_line_2: Optional[str]
    city: str
    country: str
    province: str
    zip: str
    phone: str
    sop: str = Field(sa_column=Column(Text), nullable=False)
    resume_doc_id: uuid.UUID = Field(foreign_key='document.id')
    transcript_doc_id: uuid.UUID = Field(foreign_key='document.id')
    language_test_doc_id: uuid.UUID = Field(foreign_key='document.id')


class Application(BaseModel, ApplicationBaseClass, table=True):
    """Stores the student application."""
    reviewer_id: Optional[uuid.UUID] = Field(foreign_key='university_user.id')
    language_test_id: uuid.UUID = Field(foreign_key='language_test.id')
    status: ApplicationStatus = Field(
        sa_column=Column(Enum(ApplicationStatus)), default=ApplicationStatus.SUBMITTED)
    program: "UniversityProgram" = Relationship(back_populates='applications')
    student: User = Relationship(sa_relationship=relationship(
        'User', backref=backref('application', uselist=False)))
    reviewer: UniversityUser = Relationship(back_populates='applications')
    language_test: LanguageTest = Relationship(sa_relationship=relationship(
        'LanguageTest', backref=backref('application', uselist=False)))
    applicant_institutions: Optional[List[ApplicantInstitution]] = Relationship(back_populates='application')


class ApplicationRequest(ApplicationBaseClass):
    """The application request schema used."""
    language_test: LanguageBase
    applicant_institutions: List[ApplicantInstitutionBase]


class ApplicationFilesSchema(SQLModel):
    """The schema for uploading files required for an application."""
    resume: File
    transcript: File
    language_test: File


class ApplicationResponse(ApplicationRequest):
    """The application specific response shown."""
    id: str
    university: str
    program: str
    program_requirements: str
    status: str
    reviewer_name: str

