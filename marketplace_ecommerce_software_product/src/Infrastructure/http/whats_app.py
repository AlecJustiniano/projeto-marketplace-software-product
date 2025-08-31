from random import randint
from twilio.rest import Client

def gerar_codigo():
    return randint(1000, 9999)

# Função para enviar mensagem via WhatsApp
def gerar_mensagem(telefone, codigo):
    account_sid = 'ACa8f0210dabdb99004844f8a16fcde9a5'
    auth_token = 'a8dc11bb7583ba2a6264a9561095e609'
    client = Client(account_sid, auth_token)

    message = client.messages.create(
        from_='whatsapp:+14155238886',
        body=f'Seu código de verificação é: {codigo}',
        to=f'whatsapp:+55{telefone}'
    )
    return message.sid

def enviar_historico_vendas(telefone, vendas):
    account_sid = 'ACa8f0210dabdb99004844f8a16fcde9a5'
    auth_token = 'a8dc11bb7583ba2a6264a9561095e609'
    client = Client(account_sid, auth_token)
    message = client.messages.create(
        from_='whatsapp:+14155238886',
        body='Histórico de Vendas:\n' + '\n'.join(
            [f"ID: {venda['id']}, Produto: {venda['product_name']}, Quantidade: {venda['quantity_sold']}, Preço: {venda['price_at_sale']}, Data: {venda['timestamp']}" for venda in vendas]
        ),
        to=f'whatsapp:+55{telefone}'
    )
    return message.sid