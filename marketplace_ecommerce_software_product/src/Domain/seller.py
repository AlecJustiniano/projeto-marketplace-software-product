class SellerDomain:
    def __init__(self, name, email, password, cnpj=None, phone=None, status=False):
        self.name = name
        self.email = email
        self.password = password
        self.cnpj = cnpj
        self.phone = phone
        self.status = status
    
    def to_dict(self):
        return {
            "name": self.name,
            "email": self.email,
            "password": self.password,
            "cnpj": self.cnpj,
            "phone": self.phone,
            "status": self.status
        }
