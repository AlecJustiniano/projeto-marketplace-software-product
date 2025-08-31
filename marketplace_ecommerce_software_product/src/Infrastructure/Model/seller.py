from config.data_base import db
from sqlalchemy import Boolean
from flask import jsonify



class Seller(db.Model):
    __tablename__ = 'seller'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)  # Nome do mini mercado
    cnpj = db.Column(db.String(100), unique=True, nullable=False)  # CNPJ (18 caracteres)
    email = db.Column(db.String(100), unique=True, nullable=False)  # E-mail
    phone = db.Column(db.String(15), nullable=False)  # Celular
    password = db.Column(db.String(100), nullable=False)  # Senha
    status = db.Column(Boolean, default=False, nullable=False)  # Status (Padrão: Inativo)
    code = db.Column(db.String(4), nullable=True)  # Código de verificação

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "cnpj": self.cnpj,
            "email": self.email,
            "phone": self.phone,
            "status": self.status,
            "code": self.code
    }


    
    def post_seller(data):
        name = data.get('name')
        cnpj = data.get('cnpj')
        email = data.get('email')
        phone = data.get('phone')
        password = data.get('password')
        status = data.get('status', False)
        db.session.add(Seller(name=name, cnpj=cnpj, email=email, phone=phone, password=password, status=status))
        db.session.commit()
        return jsonify({"mensagem": "Usuário registrado com sucesso"})

    def add_code_seller(id_seller, seller_code):
        seller = Seller.query.get(id_seller)
        if not seller:
            return None
        seller.code = seller_code
        db.session.commit()
        return seller.to_dict()
    
    def get_sellers():
        return jsonify([seller.to_dict() for seller in Seller.query.all()])
    
    def get_seller_by_cnpj(cnpj):
        seller = Seller.query.filter_by(cnpj=cnpj).first()
        if not seller:
            return None
        return seller.id
    
    def delete_seller(id_seller):
        seller = Seller.query.get(id_seller)
        if not seller:
            return None
        db.session.delete(seller)
        db.session.commit()
        return jsonify([seller.to_dict() for seller in Seller.query.all()])