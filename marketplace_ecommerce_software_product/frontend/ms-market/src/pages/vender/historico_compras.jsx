import './historico_vendas.css';
import api from '../../services/api';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HistoricoCompras() {
  const [vendas, setVendas] = useState([]);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const carregarVendas = async () => {
      try {
        const id_comprador = localStorage.getItem('compradorId');
        const response = await api.get(`/sales/${id_comprador}/compras`, {
        });
        setVendas(response.data);
      } catch (err) {
        console.error(err);
        setErro('Erro ao carregar histórico de compras.');
      }
    };

    carregarVendas();
  }, []);

  return (
    <div className="historico-container">
      <h2>Histórico de Compras</h2>
      <button onClick={() => navigate('/lojas')}>Voltar para Lojas</button>
      {erro && <p className="erro">{erro}</p>}
      {vendas.length === 0 ? (
        <p>Nenhuma venda registrada.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Produto</th>
              <th>Nome do Produto</th>
              <th>Quantidade</th>
              <th>Preço da Compra</th>
              <th>Total</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {vendas.map((venda) => (
              <tr key={venda.id}>
                <td>{venda.id}</td>
                <td>{venda.product_id}</td>
                <td>{venda.product_name}</td>
                <td>{venda.quantity_sold}</td>
                <td>R$ {Number(venda.price_at_sale).toFixed(2)}</td>
                <td>R$ {(venda.price_at_sale * venda.quantity_sold).toFixed(2)}</td>
                <td>{venda.timestamp || 'Sem data'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
      )}
    </div>
  );
}

export default HistoricoCompras;
