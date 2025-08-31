from flask import request, jsonify, make_response
from Application.Service.seller_service import SellerService
import re

class SellerController:
    @staticmethod
    def register_seller():
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        cnpj = data.get('cnpj')
        phone = data.get('phone')
        status = data.get('status', False)

        if not name or not email or not password or not cnpj or not phone:
            return make_response(jsonify({"erro": "Missing required fields"}), 400)

        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            return make_response(jsonify({"erro": "Invalid email format"}), 400)

        if not re.match(r"\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}", cnpj):
            return make_response(jsonify({"erro": "Invalid CNPJ format"}), 400)

        try:
            seller = SellerService.create_seller(name, email, password, cnpj, phone, status)
        except Exception as e:
            return make_response(jsonify({"erro": f"Error creating user: {str(e)}"}), 500)

        return make_response(jsonify({
            "mensagem": "User registered successfully",
            "usuario": seller.to_dict()
        }), 201)