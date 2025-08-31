from config.data_base import db
from sqlalchemy import Boolean
from flask import jsonify

class Product(db.Model):
    __tablename__ = "product"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    units = db.Column(db.Integer, nullable=False)
    status = db.Column(db.Boolean, default=True, nullable=False)
    id_seller = db.Column(db.Integer, db.ForeignKey('seller.id'), nullable=False)
    image = db.Column(db.String(200), nullable=False)
    
    seller = db.relationship('Seller', backref='products')

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "price": self.price,
            "units": self.units,
            "status": self.status,
            "id_seller": self.id_seller,
            "image": self.image,
            "seller": {
                "id": self.seller.id,
                "name": self.seller.name
            } if self.seller else None
    }


    def post_product(data):
        name = data.get("name")
        price = data.get("price")
        units = data.get("units")
        status = data.get("status")
        id_seller = data.get("id_seller")
        image = data.get("seller")
        db.session.add(Product(name=name, price=price, units=units, status=status, id_seller=id_seller, image=image))
        db.session.commit()
        return jsonify({"mensagem": "Produto registrado com sucesso"})
