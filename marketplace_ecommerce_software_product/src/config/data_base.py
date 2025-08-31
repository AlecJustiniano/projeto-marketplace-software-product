from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import inspect
import time

db = SQLAlchemy()

def init_db(app):
    """
    Inicializa o banco de dados com o app Flask e o SQLAlchemy.
    Verifica e cria as tabelas automaticamente se não existirem.
    """
    # Configuração do banco de dados
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:root@mercado_db:3306/market_management'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Inicializa o SQLAlchemy com o app Flask
    db.init_app(app)
    
    # Tenta conectar ao banco de dados (com retry para casos de inicialização com Docker)
    max_retries = 5
    retry_delay = 2
    
    for attempt in range(max_retries):
        try:
            with app.app_context():
                # Verifica se o banco de dados existe, se não, cria
                inspector = inspect(db.engine)
                
                # Cria todas as tabelas definidas nos modelos
                db.create_all()
                
                # Verificação adicional para tabela específica (opcional)
                if 'seller' not in inspector.get_table_names():
                    print("Tabela 'seller' não encontrada. Criando todas as tabelas...")
                    db.create_all()
                
                print("Banco de dados inicializado com sucesso.")
                break
                
        except Exception as e:
            if attempt == max_retries - 1:
                print(f"Falha ao conectar ao banco de dados após {max_retries} tentativas.")
                raise
            print(f"Tentativa {attempt + 1} de {max_retries}: Banco de dados não disponível. Tentando novamente em {retry_delay} segundos...")
            time.sleep(retry_delay)