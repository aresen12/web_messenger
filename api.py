import os
from flask import (
    Blueprint, redirect, render_template, request,
)
from data import db_session
from data.user import User
from flask_login import current_user, login_user, logout_user
from data.message import Message
from data.chat import Chat, get_chats
from data.File import File, get_files
from data.black_list import Black

api = Blueprint('api', __name__, url_prefix='/api')
api_key = "key_api"


@api.route("/login_device")
def login_device():
    data = request.get_json()
    if data["key"] == api_key:
        db_sess = db_session.create_session()
        user = db_sess.query(User).filter(User.email == data["user_name"]).first()
        if user and user.check_password(data["password"]):
            login_user(user)
            db_sess.close()
            return {"log": True}
        else:
            db_sess.close()
            return {"log": "Bad password"}
    else:
        return {'log': "Bad api key"}


@api.route("/logout_device")
def logout_device():
    data = request.get_json()
    if data["key"] == api_key:
        logout_user()
    else:
        return {'log': "Bad api key"}
