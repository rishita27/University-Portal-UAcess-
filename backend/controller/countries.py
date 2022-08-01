"""Countries Controller.

Authors:
    * Amrita Krishna <amrita@dal.ca>
"""
from flask import Blueprint, jsonify
from assets.countries_and_states import data

countries_blueprint = Blueprint(
    'countries_blueprint', __name__, url_prefix='/countries')


@countries_blueprint.get('/')
def get_countries():
    """
    Fetches the static data of the countries and their corresponding states.
    Returns:
        List of names of countries and their states.

    """
    return jsonify(data)
