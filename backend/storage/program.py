from storage.base import BaseOperations
from schema.university import UniversityProgram


class ProgramOperations(BaseOperations):
    model = UniversityProgram

program_operations = ProgramOperations()
