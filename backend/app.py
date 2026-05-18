from flask import Flask
from flask_cors import CORS

from config import Config
from database.db import mysql, bcrypt
from routes.auth_routes import auth_bp

app = Flask(__name__)

app.config.from_object(Config)

# Restrict CORS
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5173"]
    }
})

mysql.init_app(app)
bcrypt.init_app(app)

app.register_blueprint(auth_bp)

if __name__ == "__main__":
    app.run(debug=True)