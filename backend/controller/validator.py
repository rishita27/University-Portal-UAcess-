"""Request validators.

Authors:
    * Aasif Faizal <aasif@dal.ca>
    * Amrita Krishna <amrita@dal.ca>

This validator validates the request body, forms, query parameters, and files.
"""

from functools import wraps
from flask import request, Request, jsonify

from inspect import signature

from pydantic import ValidationError
from sqlmodel.main import ModelMetaclass


def validate_body(schema: ModelMetaclass, req: Request):
    """Function that validates the body passed in the flask request.
          Args:
              schema (ModelMetaclass): Pydantic or SQLModel Schema with which
                  the request data needs to be validated against.
              req (Request): The Flask request.

          Returns:
              ModelMetaclass: The validated object.

          Raises:
              ValidationError: Validation error raised if data doesn't match with the schema.
          """
    return schema.validate(req.json)


def validate_query_params(schema: ModelMetaclass, req: Request):
    """Function that validates the query params passed in the flask request.
          Args:
              schema (ModelMetaclass): Pydantic or SQLModel Schema with which
                  the query params needs to be validated against.
              req (Request): The Flask request.

          Returns:
              ModelMetaclass: The validated object.

          Raises:
              ValidationError: Validation error raised if data doesn't match with the schema.
          """
    return schema.validate(req.args)


def validate_form(schema: ModelMetaclass, req: Request):
    """Function that validates the request form data.
    Args:
        schema (ModelMetaclass): Pydantic or SQLModel Schema with which
            the form data needs to be validated against.
        req (Request): The Flask request.

    Returns:
        ModelMetaclass: The validated object.

    Raises:
        ValidationError: Validation error raised if data doesn't match with the schema.
    """
    return schema.validate(req.form)


def validate_files(schema: ModelMetaclass, req: Request):
    """Function that validates the files passed in the flask request.
      Args:
          schema (ModelMetaclass): Pydantic or SQLModel Schema with which
              the form data needs to be validated against.
          req (Request): The Flask request.

      Returns:
          ModelMetaclass: The validated object.

      Raises:
          ValidationError: Validation error raised if data doesn't match with the schema.
      """
    return schema.validate(req.files)


VALIDATION_FN_MAPPING = {
    'body': validate_body,
    'query': validate_query_params,
    'form': validate_form,
    'files': validate_files
}

    
def validate(func):
    """Function that validates the arguments passed in the flask request. It checks the type based of validation
    function mapping and then appropriate functions are invoked for validation.
          Args:
              kwargs: Arguments of the function

          Returns:
             Errors if any after validation

          """
    @wraps(func)
    def wrapper(**kwargs):
        sign = signature(func)
        _kwargs = {}
        errors = {}
        for key, value in sign.parameters.items():
            try:
                validation_fn = VALIDATION_FN_MAPPING.get(key, None)
                if validation_fn:
                    _kwargs[key] = validation_fn(value.annotation, request)
                else:
                    _kwargs[key] = value.annotation(kwargs.get(key))
            except ValidationError as e:
                errors[key] = e.errors()
        if errors:
            return jsonify(errors), 412
        return func(**_kwargs)
    return wrapper

