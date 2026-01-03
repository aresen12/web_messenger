from flask import (
    Blueprint, redirect, render_template, request, abort
)
from data import db_session
from flask_login import current_user
from data.admin import Admin, permissions
from data.user import User
from data.alerts import new_alert, Alert
from data.actions import Action, new_action
import datetime

panel = Blueprint('admin_panel', __name__, url_prefix='/panel')


@panel.route("/", methods=["GET", "POST"])
def main_page():
    if request.method == "GET":
        if current_user.is_authenticated:
            db_sess = db_session.create_session()
            if db_sess.query(Admin).filter(Admin.id_user == current_user.id).first() is None:
                db_sess.close()
                return "permission denied"
            activiti = db_sess.query(Admin.name, Admin.time_activiti, Admin.permissions).all()
            users = db_sess.query(User).all()
            actions = db_sess.query(Action).all()
            db_sess.close()
            return render_template("admin_panel.html", activiti_list=activiti, user_list=users,
                                   actions=actions, permissions=permissions)
    else:
        db_sess = db_session.create_session()
        admin = db_sess.query(Admin).filter(Admin.id_user == current_user.id).first()
        if admin is None or not ("3" in admin.permissions.split()):
            return abort(405)
        admin.time_activiti = datetime.datetime.now()
        alert = new_alert(request.form["text_alert"], current_user.id)
        db_sess.add(alert)
        action = new_action(2, current_user.id)
        db_sess.add(action)
        db_sess.commit()
        return redirect("/")


# permissions
# 1 - удаление пользователя
# 2 - блокировка пользователя
# 3 - отправка новостей


@panel.route("/delete_user_by_id", methods=["POST"])
def delete_user():
    data = request.get_json()
    if current_user.is_authenticated:
        db_sess = db_session.create_session()
        admin = db_sess.query(Admin).filter(Admin.id_user == current_user.id).first()
        if admin is None or not ("1" in admin.permissions.split()) or not admin.check_password(data["password"]):
            db_sess.close()
            return abort(400)
            # не помню коды точно bad req
        admin.time_activiti = datetime.datetime.now()
        user = db_sess.query(User).filter(User.id == data["user_id"]).first()
        user.password = ""
        user.name = "Удаленный аккаунт"
        action = new_action(1, current_user.id)
        db_sess.add(action)
        db_sess.commit()
        db_sess.close()
        return {"log": "Успешно"}


@panel.route("/news", methods=["GET", "POST"])
def news():
    if request.method == "GET":
        if current_user.is_authenticated:
            db_sess = db_session.create_session()
            if db_sess.query(Admin).filter(Admin.id_user == current_user.id).first() is None:
                db_sess.close()
                return "permission denied"
            alerts = db_sess.query(Alert).all()
            db_sess.close()
            return render_template("news.html", news=alerts)
    else:
        db_sess = db_session.create_session()
        admin = db_sess.query(Admin).filter(Admin.id_user == current_user.id).first()
        if admin is None or not ("3" in admin.permissions.split()):
            return abort(405)
        admin.time_activiti = datetime.datetime.now()
        alert = new_alert(request.form["text_alert"], current_user.id)
        action = new_action(2, current_user.id)
        db_sess.add(action)
        db_sess.add(alert)
        db_sess.commit()
        db_sess.close()
        return redirect("/")


@panel.route("/delete_news_by_id", methods=["POST"])
def delete_news():
    if current_user.is_authenticated:
        data = request.get_json()
        db_sess = db_session.create_session()
        admin = db_sess.query(Admin).filter(Admin.id_user == current_user.id).first()
        if admin is None or not ("3" in admin.permissions.split()):
            return abort(405)
        admin.time_activiti = datetime.datetime.now()
        news_ = db_sess.query(Alert).filter(Alert.id == data["id_news"]).first()
        db_sess.delete(news_)
        db_sess.commit()
        db_sess.close()
        return {"log": 200}
    return "s"


@panel.route("/profile")
def profile():
    db_sess = db_session.create_session()
    admin = db_sess.query(Admin).filter(Admin.id_user == current_user.id).first()
    db_sess.close()
    return render_template("admin_profile.html", admin=admin)


@panel.route("/edit_prof", methods=["POST"])
def edit_prof():
    if current_user.id is None:
        return {"log": False}
    data = request.get_json()
    db_sess = db_session.create_session()
    user = db_sess.query(Admin).filter(Admin.id_user == current_user.id).first()
    user.name = data["name"]
    user.time_activiti = datetime.datetime.now()
    db_sess.commit()
    db_sess.close()
    return {"log": True}


@panel.route("/edit_password", methods=["POST"])
def edit_password():
    if current_user.id is None:
        return {"log": False}
    data = request.get_json()
    db_sess = db_session.create_session()
    user = db_sess.query(Admin).filter(Admin.id == current_user.id).first()
    if user.check_password(data["old_password"]):
        user.set_password(data["new_password"])
        user.time_activiti = datetime.datetime.now()
        db_sess.commit()
    db_sess.close()
    return {"log": True}
