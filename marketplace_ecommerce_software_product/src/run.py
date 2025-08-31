from flask import Flask
from config.data_base import init_db
from routes import init_routes, seller_blueprint, product_blueprint
from flask_jwt_extended import JWTManager
from flask_cors import CORS

def create_app():
    app = Flask(__name__)

    # Aplica CORS corretamente com origem permitida
    CORS(
        app,
        resources={r"/*": {"origins": "http://localhost:5173"}},
        methods=["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
        allow_headers=["Content-Type", "Authorization"]
    )

    init_db(app)
    init_routes(app)
    app.register_blueprint(seller_blueprint)
    app.register_blueprint(product_blueprint)

    app.config["JWT_SECRET_KEY"] = "super-secret"
    jwt = JWTManager(app)

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)