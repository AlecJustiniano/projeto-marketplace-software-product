import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './produto.css';

function VisualizarProduto() {
  const { product_id } = useParams(); // Pega o ID da URL
  const navigate = useNavigate();
  const [produto, setProduto] = useState(null);
  const [erro, setErro] = useState('');

  const id_seller = localStorage.getItem('id_seller');
  const handleVoltar = () => {
    navigate(`/products/${id_seller}`);
  };

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/product/${product_id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProduto(response.data);
      } catch (err) {
        console.error(err);
        setErro(err.response?.data?.erro || 'Erro ao carregar o produto.');
      }
    };

    fetchProduto();
  }, [product_id]);

  if (erro) {
    return <div className="erro-produto"><p>{erro}</p></div>;
  }

  if (!produto) {
    return <div className="carregando"><p>Carregando produto...</p></div>;
  }

  return (
    <div className="visualizar-container">
      <h2>Detalhes do Produto</h2>
      <div className="produto-detalhes">
        <p><strong>ID:</strong> {produto.id}</p>
        <p><strong>Nome:</strong> {produto.name}</p>
        <p><strong>Preço:</strong> R$ {produto.price}</p>
        <p><strong>Unidades:</strong> {produto.units}</p>
        <p><strong>Status:</strong> {produto.status ? 'Ativo' : 'Inativo'}</p>
        <p><strong>ID do Vendedor:</strong> {produto.id_seller}</p>
        <img src={produto.image} alt={produto.name} width="200" />
      </div>
      <button onClick={handleVoltar}>Voltar</button>
    </div>
  );
}

export default VisualizarProduto;