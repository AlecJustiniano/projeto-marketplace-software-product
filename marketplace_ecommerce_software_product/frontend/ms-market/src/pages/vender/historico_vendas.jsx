import './historico_vendas.css';
import api from '../../services/api';
import { useEffect, useState } from 'react';

function HistoricoVendas() {
  const [vendas, setVendas] = useState([]);
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    const carregarVendas = async () => {
      try {
        const id_seller = localStorage.getItem('id_seller');
        const response = await api.get(`/sales/${id_seller}/vendas`);
        setVendas(response.data);
      } catch (err) {
        console.error(err);
        setErro('Erro ao carregar histórico de vendas.');
      }
    };

    carregarVendas();
  }, []);

    const handleEnviarHistorico = async () => {
    try {
      const id_seller = localStorage.getItem('id_seller');
      const response = await api.post(`/sales/${id_seller}/vendas/`);
      setMensagem(response.data.message);
      alert('Histórico de vendas enviado com sucesso!');
    } catch (err) {
      console.error(err);
      setMensagem('Erro ao enviar histórico.');
    }
  };
  return (
    <div className="historico-container">
      <h2>Histórico de Vendas</h2>
      <button onClick={() => window.history.back()}>Voltar</button>
      <button onClick={handleEnviarHistorico}>
        Enviar histórico de vendas
      </button>
      {mensagem && <p className="mensagem">{mensagem}</p>}
      {erro && <p className="erro">{erro}</p>}
      {vendas.length === 0 ? (
        <p>Nenhuma venda registrada.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Preço Unitário</th>
              <th>Total</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {vendas.map((venda) => (
              <tr key={venda.id}>
                <td>{venda.id}</td>
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

export default HistoricoVendas;