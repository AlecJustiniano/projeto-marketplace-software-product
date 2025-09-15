import './cadastrar.css';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Cadastrar() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cnpj: '',
    phone: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/seller', formData);
      const sellerId = response.data.seller_id || response.data.id || response.data.sellerId; // ajuste conforme retorno
      alert(response.data.mensagem);
      navigate(`/seller/verify/${sellerId}`);
    } catch (error) {
      alert(error.response?.data?.erro || 'Erro ao cadastrar vendedor.');
      console.error(error);
    }
  };

  return (
    <div className="cadastrar-container">
      <button onClick={() =>navigate("/")} >Home</button>
      <form onSubmit={handleSubmit}>
        <h1>Cadastro</h1>
        <input name='name' type='text' placeholder='Nome' onChange={handleChange} required />
        <input name='email' type='email' placeholder='Email' onChange={handleChange} required />
        <input name='cnpj' type='text' placeholder='CNPJ' onChange={handleChange} required />
        <input name='phone' type='text' placeholder='Telefone' onChange={handleChange} required />
        <input name='password' type='password' placeholder='Senha' onChange={handleChange} required />
        <button type='submit'>Cadastrar</button>
      </form>
    </div>
  );
}

export default Cadastrar;