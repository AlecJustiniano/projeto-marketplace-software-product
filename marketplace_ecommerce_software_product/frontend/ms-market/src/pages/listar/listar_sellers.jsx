import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import './listar_sellers.css';

function ListarSellers() {
  const [sellers, setSellers] = useState([]);
  const [erro, setErro]     = useState('');
  const navigate            = useNavigate();

  useEffect(() => {
    const carregarSellers = async () => {
      const compradorId = localStorage.getItem('compradorId');
      if (!compradorId) {
        setErro('Você precisa fazer login antes.');
        return;
      }
      try {
        const response = await api.get(`/sellers/${compradorId}`, {
        });
        setSellers(response.data);
      } catch (err) {
        console.error(err);
        setErro('Erro ao carregar os vendedores.');
      }
    };

    carregarSellers();
  }, []);

  const verProdutos = (sellerId) => {
    localStorage.setItem('id_seller', sellerId)
    navigate(`/sell`);
  };

  return (
    <div className="sellers-container">
      <h2>Vendedores Disponíveis</h2>
      <button onClick={() => navigate('/historico/compras')}>Historico de Compras</button>
      {erro && <p className="erro">{erro}</p>}
      {sellers.length === 0 ? (
        <p>Nenhum vendedor disponível.</p>
      ) : (
        <table className="sellers-tabela">
  <thead>
    <tr>
      <th>Nome</th>
      <th>E-mail</th>
      <th>CNPJ</th>
      <th>Telefone</th>
      <th>Status</th>
      <th>Ações</th>
    </tr>
  </thead>
  <tbody>
    {sellers.map((seller) => (
      <tr key={seller.id}>
        <td>{seller.name}</td>
        <td>{seller.email}</td>
        <td>{seller.cnpj}</td>
        <td>{seller.phone}</td>
        <td>{seller.status ? 'Ativo' : 'Inativo'}</td>
        <td>
          <button onClick={() => verProdutos(seller.id)}>
            Ver Produtos
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
      )}
    </div>
  );
}

export default ListarSellers;
