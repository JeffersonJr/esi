import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { Funil } from './pages/Funil';
import { DeletedLeads } from './pages/DeletedLeads';
import { Contatos } from './pages/Contatos';
import ContatoPerfil from './pages/ContatoPerfil';
import ContatoEditar from './pages/ContatoEditar';
import { Imoveis } from './pages/Imoveis';
import ImovelDetalhes from './pages/ImovelDetalhes';
import CadastroImovel from './pages/CadastroImovel';
import { Agenda } from './pages/Agenda';
import { Analytics } from './pages/Analytics';
import { Usuarios } from './pages/Usuarios';
import { Equipes } from './pages/Equipes';
import { Configuracoes } from './pages/Configuracoes';
import { EsiSites } from './pages/EditorSite';
import LeadDetalhes from './pages/LeadDetalhes';
import { Login } from './pages/Login';
import { Perfil } from './pages/Perfil';
import { RecuperarSenha } from './pages/RecuperarSenha';
import { VerificarCodigo } from './pages/VerificarCodigo';
import { RedefinirSenha } from './pages/RedefinirSenha';
import { EsiBank } from './pages/EsiBank';
import { EsiChat } from './pages/EsiChat';
import { AutomacaoImobiliaria } from './pages/AutomacaoImobiliaria';
import { GestaoLocacoes } from './pages/GestaoLocacoes';
import { GestaoFinanceira } from './pages/GestaoFinanceira';
import { GestaoSolicitacoes } from './pages/GestaoSolicitacoes';
import { SistemaVistoria } from './pages/SistemaVistoria';
import NotFound from './pages/NotFound';
import { Toaster } from './components/ui/toaster';
import { ThemeProvider } from './contexts/theme-context';
import { AnimationProvider } from './components/shared/ActionAnimation';

function App() {
  return (
    <ThemeProvider>
      <AnimationProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/recuperar-senha" element={<RecuperarSenha />} />
            <Route path="/verificar-codigo" element={<VerificarCodigo />} />
            <Route path="/redefinir-senha" element={<RedefinirSenha />} />
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="funil" element={<Funil />} />
              <Route path="lixeira" element={<DeletedLeads />} />
              <Route path="leads/:id" element={<LeadDetalhes />} />
              <Route path="contatos" element={<Contatos />} />
              <Route path="contatos/perfil/:id" element={<ContatoPerfil />} />
              <Route path="contatos/editar/:id" element={<ContatoEditar />} />
              <Route path="imoveis" element={<Imoveis />} />
              <Route path="imoveis/detalhes/:id" element={<ImovelDetalhes />} />
              <Route path="imoveis/cadastrar" element={<CadastroImovel />} />
              <Route path="imoveis/editar/:id" element={<CadastroImovel />} />
              <Route path="agenda" element={<Agenda />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="usuarios" element={<Usuarios />} />
              <Route path="equipes" element={<Equipes />} />
              <Route path="site" element={<EsiSites />} />
              <Route path="esibank" element={<EsiBank />} />
              <Route path="esichat" element={<EsiChat />} />
              <Route path="automacao" element={<AutomacaoImobiliaria />} />
              <Route path="locacoes" element={<GestaoLocacoes />} />
              <Route path="financeiro" element={<GestaoFinanceira />} />
              <Route path="solicitacoes" element={<GestaoSolicitacoes />} />
              <Route path="vistoria" element={<SistemaVistoria />} />
              <Route path="configuracoes" element={<Configuracoes />} />
              <Route path="perfil" element={<Perfil />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </AnimationProvider>
    </ThemeProvider>
  );
}

export default App;
