from flask import (
    Blueprint, redirect, render_template, request,
)
from flask_login import current_user, logout_user
from data.my_orm.message import Message
from data.my_orm.engine import SessionDB
from python_modules.messanger import m_st

api = Blueprint('api', __name__, url_prefix='/api')


@api.route("/logout_device")
def logout_device():
    logout_user()
    return redirect("/")


@api.route("/android", methods=["GET", "POST"])
def android():
    return m_st()


@api.route("/search_in_chat", methods=["POST"])
def search_response():
    data = request.get_json()
    db_sess = SessionDB(f"db/chats/chat{data['chat_id']}.db")
    json_response = {"list_message": []}
    messages = db_sess.query(Message()).all()
    for message in messages:
        if not (message[2] is None) and data["search_text"] in message[2]:
            json_response["list_message"].append(message[0])
    db_sess.close()
    return json_response
