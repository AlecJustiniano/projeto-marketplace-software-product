import './style.css';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="page-container">
    <div className="content-box">
      <h1>Seja Bem-vindo ao <span className="highlight">Mercado Impactados</span></h1>
      <p>Essa é a home page do Mercado Impactados.</p>
      <p>Aqui você pode gerenciar seus dados e configurações dos seus produtos.</p>
      <p>Utilize o menu de navegação para acessar os diversos serviços da aplicação.</p>
      <p>Se precisar de ajuda, entre em contato com o suporte.</p>

      <button className="button" onClick={handleLoginClick}>
        Entrar como vendedor
      </button>
      <button className="button" onClick={() => navigate('/login/comprador')}>
        Entrar como comprador
      </button> 
    </div>
    </div>
  );
}

export default Home;
