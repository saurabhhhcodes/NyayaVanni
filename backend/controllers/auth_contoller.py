from flask import request, jsonify, current_app
from database.db import mysql, bcrypt
from utils.validators import is_valid_email, is_strong_password
import jwt
import datetime


# REGISTER
def register():
    try:
        data = request.get_json()
        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        # Validation
        if not name or not email or not password:
            return jsonify({
                "message": "All fields are required"
            }), 400

        if not is_valid_email(email):
            return jsonify({
                "message": "Invalid email format"
            }), 400

        if not is_strong_password(password):
            return jsonify({
                "message": "Password must contain uppercase, lowercase, number and 8+ chars"
            }), 400

        cur = mysql.connection.cursor()

        # Check existing email
        cur.execute(
            "SELECT * FROM users WHERE email=%s",
            (email,)
        )

        existing_user = cur.fetchone()

        if existing_user:
            cur.close()

            return jsonify({
                "message": "Email already exists"
            }), 409

        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        cur.execute(
            "INSERT INTO users(name, email, password) VALUES(%s, %s, %s)",
            (name, email, hashed_password)
        )

        mysql.connection.commit()

        cur.close()

        return jsonify({
            "message": "User Registered Successfully"
        }), 201

    except Exception as e:

        return jsonify({
            "message": str(e)
        }), 500


# LOGIN
def login():

    try:

        data = request.get_json()

        email = data.get("email")
        password = data.get("password")

        if not email or not password:

            return jsonify({
                "message": "Email and password required"
            }), 400

        cur = mysql.connection.cursor()

        cur.execute(
            "SELECT * FROM users WHERE email=%s",
            (email,)
        )

        user = cur.fetchone()

        cur.close()

        if not user:

            return jsonify({
                "message": "Invalid Email or Password"
            }), 401

        stored_password = user[3]

        if not bcrypt.check_password_hash(stored_password, password):

            return jsonify({
                "message": "Invalid Email or Password"
            }), 401

        # JWT Token
        token = jwt.encode({
            "id": user[0],
            "email": user[2],
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        },
        current_app.config["JWT_SECRET"],
        algorithm="HS256")

        return jsonify({
            "message": "Login Successful",
            "token": token
        }), 200

    except Exception as e:

        return jsonify({
            "message": str(e)
        }), 500