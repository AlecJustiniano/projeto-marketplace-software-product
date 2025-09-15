import './cadastrar_produto.css';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function CadastrarProduto() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [units, setUnits] = useState('');
  const [status, setStatus] = useState(true);
  const [image, setImage] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token'); // Certifique-se de que o token está armazenado
      const id_seller =  localStorage.getItem('id_seller')
      const response = await api.post(
        '/product',
        {
          name,
          price,
          units,
          status,
          image
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setMensagem(response.data.mensagem);
      // Opcional: resetar formulário
      setName('');
      setPrice('');
      setUnits('');
      setImage('');
      setStatus(true);
      navigate(`/products/${id_seller}`); // Redirecionar para a lista de produtos
    } catch (error) {
      console.error(error);
      setMensagem(error.response?.data?.erro || 'Erro ao cadastrar produto');
    }
  };

  return (
    <div className="form-container">
      <h2>Cadastrar Produto</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome do Produto"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Preço"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Unidades"
          value={units}
          onChange={(e) => setUnits(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="URL da Imagem"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          required
        />
        <label>
          Ativo:
          <input
            type="checkbox"
            checked={status}
            onChange={(e) => setStatus(e.target.checked)}
          />
        </label>
        <button type="submit">Cadastrar</button>
      </form>
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}

export default CadastrarProduto;