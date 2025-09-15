import './editar.css';
import api from '../../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

function EditarProduto() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    units: '',
    image: '',
    status: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  useEffect(() => {
    const carregarProduto = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/product/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setFormData(response.data);
      } catch (error) {
        alert('Erro ao carregar produto.');
        console.error(error);
      }
    };

    carregarProduto();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const id_seller = localStorage.getItem("id_seller")
      const response = await api.put(`/product/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      alert(response.data.mensagem);
      navigate(`/products/${id_seller}`);
    } catch (error) {
      alert(error.response?.data?.erro || 'Erro ao atualizar produto.');
      console.error(error);
    }
  };

  return (
    <div className="editar-container">
      <button onClick={() => navigate(`/products/${id_seller}`)} > Produtos </button>
      <form onSubmit={handleSubmit}>
        <h1>Editar Produto</h1>
        <input
          name="name"
          type="text"
          placeholder="Nome do Produto"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          name="price"
          type="number"
          placeholder="Preço"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <input
          name="units"
          type="number"
          placeholder="Unidades"
          value={formData.units}
          onChange={handleChange}
          required
        />
        <input
          name="image"
          type="text"
          placeholder="URL da Imagem"
          value={formData.image}
          onChange={handleChange}
        />
        <label className="checkbox">
          Ativo:
          <input
            name="status"
            type="checkbox"
            checked={formData.status}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}

export default EditarProduto;
