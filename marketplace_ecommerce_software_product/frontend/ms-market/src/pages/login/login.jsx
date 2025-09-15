import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; // ajuste o caminho se necessário
import './login.css';

function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', { identifier, password });
      const id_seller = response.data.id_seller;
      const token = response.data.access_token;
      localStorage.setItem('token', token); // armazena o token
      localStorage.setItem('id_seller', id_seller); // armazena o id do vendedor
      alert('Login realizado com sucesso!');
      navigate(`/products/${id_seller}`); // redireciona após o login
    } catch (error) {
      alert(error.response?.data?.erro || 'Erro ao fazer login');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <form onSubmit={handleLogin}>
          <h1>Login</h1>
          <input
            name="identifier"
            type="text"
            placeholder="E-mail ou CNPJ"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          <input
            name="password"
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
          <p>
            Não tem uma conta? <a href="/cadastrar">Cadastre-se</a>
          </p>
        </form>
      </div>
    </div>
  );
  
}

export default Login;
