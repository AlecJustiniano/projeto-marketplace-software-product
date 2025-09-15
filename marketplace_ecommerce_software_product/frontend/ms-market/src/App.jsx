import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Cadastrar from './pages/cadastrar/cadastrar'
import Login from './pages/login/login'
import VerificarCodigo from './pages/cadastrar/verificar_code'
import CadastrarProduto from './pages/cadastrar/cadastrar_produto'
import ListarProdutos from './pages/listar/listar_produtos'
import EditarProduto from './pages/cadastrar/editar_produto'
import VisualizarProduto from './pages/listar/produto_detalhado'    
import VenderProduto from './pages/vender/vender_produtos'
import HistoricoVendas from './pages/vender/historico_vendas'
import Login_comprador from './pages/login/login_sales'
import ListarSellers from './pages/listar/listar_sellers'
import HistoricoCompras from './pages/vender/historico_compras'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cadastrar" element={<Cadastrar />} />
                <Route path="/login" element={<Login />} />
                <Route path="/login/comprador" element={<Login_comprador />} />
                <Route path="/seller/verify/:seller_id" element={<VerificarCodigo />} />
                <Route path="/product" element={<CadastrarProduto />} />
                <Route path="/editar/:id" element={<EditarProduto />} />
                <Route path="/products/:seller_id" element={<ListarProdutos />} />
                <Route path="/product/:product_id" element={<VisualizarProduto />} />
                <Route path="/sell" element={<VenderProduto />} />
                <Route path="*" element={<h1>404 - Página não encontrada</h1>} />
                <Route path="/historico" element={<HistoricoVendas />} />
                <Route path="/historico/compras" element={<HistoricoCompras />} />
                <Route path="/lojas" element={<ListarSellers />} /> 
            </Routes>
        </Router>
    );
}
export default App;