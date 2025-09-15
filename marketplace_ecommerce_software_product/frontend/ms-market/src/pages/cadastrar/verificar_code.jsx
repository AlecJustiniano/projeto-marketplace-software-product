import { useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import './verificar_code.css';

function VerificarCodigo() {
  const { seller_id } = useParams();
  const [code, setCode] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`/seller/verify/${seller_id}`, { code });
      alert(response.data.mensagem);
      // Redirecionar para dashboard ou login após verificação bem-sucedida
    } catch (error) {
      alert(error.response?.data?.erro || 'Erro ao verificar código');
    }
  };

  return (
    <div className="verificar-container">
        <h2>Verificação de Código</h2>
        <form onSubmit={handleVerify}>
            <input
            type="text"
            placeholder="Digite o código recebido"
            value={code}
            onChange={(e) => setCode(e.target.value)}
        />
        <button type="submit">Verificar</button>
        </form>
    </div>
  );
}

export default VerificarCodigo;
