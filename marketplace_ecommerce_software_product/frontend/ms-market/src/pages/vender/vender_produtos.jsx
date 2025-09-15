import './vender_produtos.css';
import api from '../../services/api';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'

function VenderProduto() {
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const id_seller = localStorage.getItem('id_seller');
        const response = await api.get(`/products/${id_seller}`, {});
        setProdutos(response.data.filter(p => p.status)); // só ativos
      } catch (err) {
        console.error(err);
        setMensagem('Erro ao carregar os produtos.');
      }
    };

    carregarProdutos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem('');

    try {
      const id_seller = localStorage.getItem('id_seller');
      const id_comprador = localStorage.getItem('compradorId');
      const response = await api.post(`/sell/${id_seller}/${id_comprador}`, {
        product_id: produtoSelecionado,
        quantity: Number(quantidade)
      }, {});

      setMensagem(response.data.mensagem);
      setQuantidade('');
      setProdutoSelecionado('');
      navigate(`/historico/compras`); // Redireciona para a página de produtos
    } catch (err) {
      console.error(err);
      setMensagem(err.response?.data?.erro || 'Erro ao registrar venda.');
    }
  };

  return (
    <div className="vender-container">
      <h2>Realizar Compra</h2>
      <button onClick={() => navigate('/lojas')}>Voltar para Lojas</button>
      <form onSubmit={handleSubmit}>
        <select
          value={produtoSelecionado}
          onChange={(e) => setProdutoSelecionado(e.target.value)}
          required
        >
          <option value="">Selecione um produto</option>
          {produtos.map((produto) => (
            <option key={produto.id} value={produto.id}>
              {produto.name} (Estoque: {produto.units})
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Quantidade"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          min="1"
          required
        />

        <button type="submit">Vender</button>
      </form>
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}

export default VenderProduto;
