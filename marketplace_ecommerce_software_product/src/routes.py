# import sys
# import os
# sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), 'src')))
from Application.Controllers.seller_controller import SellerController
from flask import jsonify, make_response, request, Blueprint
from Infrastructure.http.whats_app import gerar_codigo, gerar_mensagem, enviar_historico_vendas
from config.data_base import db
from sqlalchemy.exc import IntegrityError
from Infrastructure.Model.seller import Seller
from Infrastructure.Model.product import Product
from Infrastructure.Model.sale import Sale
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

seller_blueprint = Blueprint('seller_bp', __name__)
product_blueprint = Blueprint('product_bp', __name__)

def init_routes(app):    
    @app.route('/api', methods=['GET'])
    def health():
        return make_response(jsonify({
            "mensagem": "API - OK; Docker - Up",
        }), 200)
    
@seller_blueprint.route('/seller', methods=['POST'])
def register_seller():
    data = request.get_json()
    email = data.get('email')
    cnpj = data.get('cnpj')

        # Verificar se o e-mail já existe no banco de dados
    seller_existente = Seller.query.filter_by(email=email).first()
    if seller_existente:
        return make_response(jsonify({"erro": "O e-mail já está em uso."}), 400)

        # Verificar se o CNPJ já existe no banco de dados
    seller_cnpj_existente = Seller.query.filter_by(cnpj=cnpj).first()
    if seller_cnpj_existente:
        return make_response(jsonify({"erro": "O CNPJ já está em uso."}), 400)

    try:
            # Registrar novo seller
        seller = Seller.post_seller(data)
        if not seller:
            return make_response(jsonify({"erro": "Missing required fields"}), 400)
        
            # Gerar código de verificação e associar ao seller
        codigo_verificacao = gerar_codigo()
        seller_id = Seller.get_seller_by_cnpj(cnpj)
        Seller.add_code_seller(seller_id, codigo_verificacao)
        seller_criado = Seller.query.get(seller_id)
        telefone = seller_criado.phone
        gerar_mensagem(telefone, codigo_verificacao)
        return jsonify({
        "seller": "Criado",
        "codigo": codigo_verificacao,
        "mensagem": "Código enviado com sucesso",
        "seller_id": seller_id  # <- isso aqui é essencial
        })
        
    except IntegrityError as e:
        db.session.rollback()  # Desfaz a transação no banco
        return make_response(jsonify({"erro": "Erro ao criar usuário: Duplicidade detectada (CNPJ ou E-mail)."}), 400)
    except Exception as e:
        db.session.rollback()  # Garante que a sessão seja revertida em qualquer exceção
        return make_response(jsonify({"erro": f"Erro inesperado: {str(e)}"}), 500)        

    
    
@seller_blueprint.route('/seller/verify/<int:seller_id>', methods=['POST'])   
def verify_seller_code(seller_id):
    seller = Seller.query.get(seller_id)
    if not seller:
        return make_response(jsonify({"erro": "Usuário não encontrado"}), 404)
    data = request.get_json()
    print(data)
    codigo = int(data.get('code'))
    seller_code = int(seller.code)
    print(seller_code)
    if seller_code == codigo:
        seller.status = True
        db.session.commit()
        return jsonify({"mensagem": "Código verificado com sucesso", "status": "ATIVO"})
    return make_response(jsonify({"erro": "Código inválido"}), 400)
        
@seller_blueprint.route("/login", methods=["POST"])
def login():
    identifier = request.json.get("identifier", None)  # Pode ser e-mail ou CNPJ
    password = request.json.get("password", None)

        # Verificar se o identificador é um e-mail ou um CNPJ
    if "@" in identifier:
        # O identificador é um e-mail
        seller = Seller.query.filter_by(email=identifier).first()
    else:
        # O identificador é um CNPJ
        seller = Seller.query.filter_by(cnpj=identifier).first()

    # Verificar se o usuário foi encontrado
    if not seller:
        return make_response(jsonify({"erro": "Usuário não encontrado."}), 404)
        
    if seller.status == False:
        return make_response(jsonify({"erro": "Usuário inativo.", "mensagem": "Impossivel de fazer login!"}), 401)

    # Verificar se a senha está correta
    seller_password = seller.password
    if seller_password != password:
        return make_response(jsonify({"erro": "Senha incorreta."}), 401)

    # Gera o token de acesso JWT
    access_token = create_access_token(identity=seller.id)

    return jsonify(access_token=access_token, id_seller=seller.id), 200

@seller_blueprint.route("/login/comprador", methods=["POST"])
def login_compra():
    identifier = request.json.get("identifier")
    password   = request.json.get("password")

    # 1) Verifica se enviou identifier e password
    if not identifier or not password:
        return jsonify({"erro": "Identifier e password são obrigatórios"}), 400

    # 2) Busca pelo email (você disse que só e-mail faz login aqui)
    seller = Seller.query.filter_by(email=identifier).first()

    if not seller:
        return jsonify({"erro": "Usuário não encontrado."}), 404


    if seller.password != password:
        return jsonify({"erro": "Senha incorreta."}), 401

    # Tudo ok, devolve o id do comprador
    return jsonify({"id_seller_comprador": seller.id}), 200



    

@seller_blueprint.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200
    
        
@seller_blueprint.route('/seller/<int:seller_id>', methods=['GET'])
def get_seller(seller_id):
    return SellerController.get_seller(seller_id)
    
@seller_blueprint.route('/seller/<int:seller_id>', methods=['PUT'])
def update_seller(seller_id):
    return SellerController.update_seller(seller_id)
    
@seller_blueprint.route('/seller/<int:seller_id>', methods=['DELETE'])
def delete_seller(seller_id):
    Seller.delete_seller(seller_id)
    return jsonify({"mensagem": "Usuário deletado com sucesso"})
    
@seller_blueprint.route('/sellers', methods=['GET'])
def get_all_sellers():
    return Seller.get_sellers()


@seller_blueprint.route('/sellers/<int:id_sellercomprador>', methods=['GET'])
def get_all_sellers_except(id_sellercomprador):
    # Busca todos os sellers exceto o de id igual a id_sellercomprador
    sellers = Seller.query.filter(Seller.id != id_sellercomprador).all()
    return jsonify([seller.to_dict() for seller in sellers]), 200


@product_blueprint.route('/sell/<int:seller_id>/<int:id_comprador>', methods=['POST'])
def sell_product(seller_id, id_comprador):
    data = request.get_json()
    product_id = data.get("product_id")
    quantity = data.get("quantity")

    product = Product.query.get(product_id)

    if not product or product.id_seller != seller_id:
        return jsonify({"erro": "Produto não encontrado ou não pertence ao seller."}), 404
    if not product.status:
        return jsonify({"erro": "Produto inativo."}), 400
    if product.units < quantity:
        return jsonify({"erro": "Estoque insuficiente."}), 400

    # Atualiza estoque
    product.units -= quantity
    db.session.add(product)

    # Registra venda
    sale = Sale(product_id=product_id, quantity_sold=quantity, price_at_sale=product.price, id_seller=seller_id, id_comprador=id_comprador)
    db.session.add(sale)
    db.session.commit()

    return jsonify({"mensagem": "Venda registrada com sucesso."}), 201

@product_blueprint.route('/sales/<int:id_seller>/vendas', methods=['GET'])
def list_sales(id_seller):
    sales = Sale.query.filter_by(id_seller=id_seller).all()
    return jsonify([sale.to_dict() for sale in sales]), 200

@product_blueprint.route('/sales/<int:id_seller>/vendas/', methods=['POST'])
def send_list_sales(id_seller):
    sales = Sale.query.filter_by(id_seller=id_seller).all()
    telefone = Seller.query.get(id_seller).phone
    enviar_historico_vendas(telefone=telefone, vendas=[sale.to_dict() for sale in sales])
    return jsonify({"mensagem": "Historico enviado com sucesso"}), 200

@product_blueprint.route('/sales/<int:id_comprador>/compras', methods=['GET'])
def list_shopping(id_comprador):
    sales = Sale.query.filter_by(id_comprador=id_comprador).all()
    return jsonify([sale.to_dict() for sale in sales]), 200

@product_blueprint.route('/product', methods=['POST'])
@jwt_required()
def create_product():
    seller_id = get_jwt_identity()
    data = request.get_json()

    try:
        product = Product(
            name=data['name'],
            price=data['price'],
            units=data['units'],
            status=data.get('status', True),
            image=data['image'],
            id_seller=seller_id
        )
        db.session.add(product)
        db.session.commit()
        return jsonify({"mensagem": "Produto cadastrado com sucesso."}), 201
    except KeyError as e:
        return jsonify({"erro": f"Campo obrigatório ausente: {str(e)}"}), 400

@product_blueprint.route('/products/<int:seller_id>', methods=['GET'])
def list_products(seller_id):
    products = Product.query.filter_by(id_seller=seller_id).all()
    return jsonify([product.to_dict() for product in products]), 200

@product_blueprint.route('/product/<int:product_id>', methods=['GET'])
@jwt_required()
def get_product(product_id):
    seller_id = get_jwt_identity()
    product = Product.query.get(product_id)
    if not product or product.id_seller != seller_id:
        return jsonify({"erro": "Produto não encontrado."}), 404
    return jsonify(product.to_dict()), 200

@product_blueprint.route('/product/<int:product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    seller_id = get_jwt_identity()
    product = Product.query.get(product_id)
    if not product or product.id_seller != seller_id:
        return jsonify({"erro": "Produto não encontrado ou acesso negado."}), 404

    data = request.get_json()
    for key in ['name', 'price', 'units', 'status', 'image']:
        if key in data:
            setattr(product, key, data[key])

    db.session.commit()
    return jsonify({"mensagem": "Produto atualizado com sucesso."}), 200

@product_blueprint.route('/product/<int:product_id>/inactivate', methods=['PATCH'])
@jwt_required()
def inactivate_product(product_id):
    seller_id = get_jwt_identity()
    product = Product.query.get(product_id)
    if not product or product.id_seller != seller_id:
        return jsonify({"erro": "Produto não encontrado ou acesso negado."}), 404

    product.status = False
    db.session.commit()
    return jsonify({"mensagem": "Produto inativado com sucesso."}), 200

@product_blueprint.route('/product/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    seller_id = get_jwt_identity()
    product = Product.query.get(product_id)
    if not product or product.id_seller != seller_id:
        return jsonify({"erro": "Produto não encontrado ou acesso negado."}), 404

    db.session.delete(product)
    db.session.commit()
    return jsonify({"mensagem": "Produto excluído com sucesso."}), 200


@product_blueprint.route('/product/<int:product_id>/copy', methods=['POST', 'OPTIONS'])
@jwt_required(optional=True)
def copy_product(product_id):
    from Infrastructure.Model.product import Product
    # Se for preflight OPTIONS, apenas retorna 200
    if request.method == 'OPTIONS':
        return '', 200

    seller_id = get_jwt_identity()
    original = Product.query.get(product_id)
    if not original or original.id_seller != seller_id:
        return jsonify({"erro": "Produto não encontrado ou acesso negado."}), 404

    copy = Product(
        name=original.name,
        price=original.price,
        units=original.units,
        status=original.status,
        id_seller=original.id_seller,
        image=original.image
    )
    db.session.add(copy)
    db.session.commit()
    return jsonify(copy.to_dict()), 201