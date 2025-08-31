from Domain.seller import SellerDomain
from Infrastructure.Model.seller import Seller
from config.data_base import db 

class SellerService:
    @staticmethod
    def create_seller(name, email, password, cnpj, phone, status=False):
        new_seller = SellerDomain(name, email, password, cnpj, phone, status)
        seller = Seller(
            name=new_seller.name,
            email=new_seller.email,
            password=new_seller.password,
            cnpj=cnpj,
            phone=phone,
            status=status
        )
        from config.data_base import db

        db.create_all()        
        db.session.add(seller)
        db.session.commit()
        return seller
