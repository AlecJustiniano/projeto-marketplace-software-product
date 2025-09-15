import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import './listar_produto.css';
import logo from '../../assets/logo-ms-market.png';

function ListarProdutos() {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const token = localStorage.getItem('token');
        const getId_seller = localStorage.getItem('id_seller');
        const response = await api.get(`/products/${getId_seller}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProdutos(response.data);
      } catch (err) {
        console.error(err);
        setErro('Erro ao carregar os produtos.');
      }
    };

    fetchProdutos();
  }, []);

  const handleEditar = (id) => {
    const confirmar = window.confirm("Tem certeza que deseja editar este produto?");
    if (!confirmar) return;
    navigate(`/editar/${id}`);
  };

  const handleInativar = async (id) => {
    const confirmar = window.confirm("Tem certeza que deseja excluir este produto?");
    if (!confirmar) return;

    try {
      const token = localStorage.getItem('token');
      await api.patch(`product/${id}/inactivate`, null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProdutos(produtos.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      setErro('Erro ao inativar o produto.');
    }
  };

  const handleCopiar = async (id) => {
    const confirmar = window.confirm("Deseja copiar este produto?");
    if (!confirmar) return;
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(`/product/${id}/copy`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProdutos([response.data, ...produtos]);
    } catch (err) {
      console.error(err);
      setErro('Erro ao copiar o produto.');
    }
  };

  return (
    <>
      <header className="header">
        <div className="header-content">
          <img src={logo} alt="Logo Temporário" className="logo" />
          <h1>MS Market</h1>
          <button onClick={() => navigate('/product')}>Cadastrar Produto</button>
          <button onClick={() => navigate('/historico')}>Visualizar Vendas</button>
        </div>
      </header>
      <div className="produtos-container">
        <h2>Meus Produtos</h2>
        {erro && <p className="erro">{erro}</p>}
        {produtos.length === 0 ? (
          <p>Nenhum produto cadastrado.</p>
        ) : (
          <table className="produtos-tabela">
            <thead>
              <tr>
                <th>Imagem</th>
                <th>Nome</th>
                <th>Preço</th>
                <th>Unidades</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((produto) => (
                <tr key={produto.id}>
                  <td>
                    <img src={produto.image} alt={produto.name} width="80" />
                  </td>
                  <td>{produto.name}</td>
                  <td>R$ {produto.price}</td>
                  <td>{produto.units}</td>
                  <td>{produto.status ? 'Ativo' : 'Inativo'}</td>
                  <td>
                    <button onClick={() => handleEditar(produto.id)}>Editar</button>
                    <button onClick={() => handleInativar(produto.id)}>Inativar</button>
                    <button onClick={() => navigate(`/product/${produto.id}`)}>Visualizar</button>
                    <button onClick={() => handleCopiar(produto.id)}>Copiar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <footer className="footer">
        <p>&copy; 2023 MS Market. Todos os direitos reservados.</p>
      </footer>
    </>
  );
}

export default ListarProdutos;