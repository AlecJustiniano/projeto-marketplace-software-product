import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; // ajuste o caminho se necessário
import './login.css';

function Login_comprador() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/login/comprador', { identifier, password });
      alert('Login realizado com sucesso!');
      const compradorId = response.data.id_seller_comprador;
      localStorage.setItem('compradorId', compradorId);
      navigate('/lojas'); // redireciona após o login
    } catch (error) {
      alert(error.response?.data?.erro || 'Erro ao fazer login {erro}');
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

export default Login_comprador;
