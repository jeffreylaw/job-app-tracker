import os
import flask
import jwt
import re

def decode_auth_token():
    """ Return decoded payload from auth token """
    try:
        headers = flask.request.headers.get('Authorization')
        token = headers.split()[1]
        decoded = jwt.decode(token, os.getenv('SECRET'), algorithms="HS256")
        if "id" not in decoded or not decoded["id"]:
            raise KeyError("Invalid token")
        return decoded
    except (AttributeError, jwt.exceptions.DecodeError, KeyError):
        raise ValueError

def check_password(password):
    """ Check if password is valid """
    if len(password) < 8 and len(password) > 16:
        return "Password must be 8 to 16 characters long."
    if re.search('[0-9]', password) is None:
        return "Password must contain a number."
    return "valid"