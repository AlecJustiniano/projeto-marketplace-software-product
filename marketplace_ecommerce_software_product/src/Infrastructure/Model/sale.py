from config.data_base import db
from datetime import datetime
from sqlalchemy.sql import func

class Sale(db.Model):
    __tablename__ = 'sales'

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity_sold = db.Column(db.Integer, nullable=False)
    price_at_sale = db.Column(db.Float, nullable=False)

    id_seller = db.Column(db.Integer, db.ForeignKey('seller.id'), nullable=False)
    id_comprador = db.Column(db.Integer, db.ForeignKey('seller.id'), nullable=False)

    timestamp = db.Column(
        db.DateTime(timezone=True),
        default=datetime.utcnow,
        server_default=func.now()
    )
    
    # Relacionamentos
    seller = db.relationship(
        'Seller',
        foreign_keys=[id_seller],
        backref=db.backref('vendas_realizadas', lazy=True)
    )
    comprador = db.relationship(
        'Seller',
        foreign_keys=[id_comprador],
        backref=db.backref('vendas_compradas', lazy=True)
    )
    
    product = db.relationship('Product')

    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'product_name': self.product.name if self.product else None,
            'quantity_sold': self.quantity_sold,
            'price_at_sale': self.price_at_sale,
            'id_seller': self.id_seller,
            'id_comprador': self.id_comprador,
            'timestamp': self.timestamp.strftime('%d/%m/%Y') if self.timestamp else None
        }
