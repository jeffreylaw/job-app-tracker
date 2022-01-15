import os
import flask
import jwt

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