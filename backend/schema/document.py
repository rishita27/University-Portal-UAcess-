"""Document Schema.

Authors:
    * Aasif Faizal <aasif@dal.ca>
"""

import uuid
import enum

from custom_types import File
from storage.db import BaseModel
from typing import Optional, List
from sqlmodel import Enum, Column, Text, Field, SQLModel


class DocumentType(str, enum.Enum):
    """The different document types accepted."""
    TRANSCRIPT = 'transcript'
    RESUME = 'resume'
    LANGUAGE_TEST = 'language_test'


class Document(BaseModel, table=True):
    """Stores the document details of the uploaded file."""
    user_id: uuid.UUID = Field(foreign_key='user.id', nullable=False)
    name: str
    type: DocumentType = Field(sa_column=Column(Enum(DocumentType)), nullable=False)
    # Currently,  url is not set
    url: str = Field(sa_column=Column(Text))


class DocumentsFetchSchema(SQLModel):
    documents: List[Document]

    class Config:
        use_enum_values = True


class DocumentUploadFileSchema(SQLModel):
    document: File


class DocumentUploadFormSchema(SQLModel):
    file_type: str
