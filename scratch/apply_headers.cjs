const fs = require('fs');
const path = require('path');

const updates = [
  { file: 'src/pages/Funil.tsx', title: 'Esi.leads', subtitle: 'Gestão de oportunidades', icon: 'Kanban' },
  { file: 'src/pages/Contatos.tsx', title: 'Contatos', subtitle: 'Gerencie clientes e proprietários', icon: 'Users' },
  { file: 'src/pages/Imoveis.tsx', title: 'Imóveis', subtitle: 'Catálogo de imóveis e captações', icon: 'Home' },
  { file: 'src/pages/Empreendimentos.tsx', title: 'Empreendimentos', subtitle: 'Gestão de lançamentos e obras', icon: 'Building' },
  { file: 'src/pages/Agenda.tsx', title: 'Agenda', subtitle: 'Seus compromissos e tarefas', icon: 'Calendar' },
  { file: 'src/pages/MeuDesempenho.tsx', title: 'Meu Desempenho', subtitle: 'Acompanhe suas metas', icon: 'TrendingUp' },
  { file: 'src/pages/Analytics.tsx', title: 'Analytics', subtitle: 'Estatísticas e relatórios avançados', icon: 'BarChart3' },
  { file: 'src/pages/EditorSite.tsx', title: 'Esi.sites', subtitle: 'Gerencie seu site imobiliário', icon: 'Globe' },
  { file: 'src/pages/EsiBank.tsx', title: 'Esi.bank', subtitle: 'Conta digital integrada', icon: 'CreditCard' },
  { file: 'src/pages/EsiChat.tsx', title: 'Esi.chat', subtitle: 'Central de mensagens omnichanel', icon: 'MessageCircle' },
  { file: 'src/pages/AutomacaoImobiliaria.tsx', title: 'Automação', subtitle: 'Fluxos de trabalho com IA', icon: 'Bot' },
  { file: 'src/pages/GestaoLocacoes.tsx', title: 'Locações', subtitle: 'Administração de aluguéis', icon: 'Key' },
  { file: 'src/pages/Financeiro.tsx', title: 'Esi.finance', subtitle: 'Gestão financeira completa', icon: 'DollarSign' },
  { file: 'src/pages/GestaoFinanceira.tsx', title: 'Esi.finance', subtitle: 'Gestão financeira completa', icon: 'DollarSign' },
  { file: 'src/pages/GestaoSolicitacoes.tsx', title: 'Solicitações', subtitle: 'Atendimentos e suportes', icon: 'HelpCircle' },
  { file: 'src/pages/SistemaVistoria.tsx', title: 'Vistoria', subtitle: 'Relatórios de imóveis', icon: 'Camera' },
  { file: 'src/pages/Usuarios.tsx', title: 'Usuários', subtitle: 'Gerencie acessos e perfis', icon: 'UserCircle' },
  { file: 'src/pages/Equipes.tsx', title: 'Equipes', subtitle: 'Gestão de corretores', icon: 'UsersRound' },
  { file: 'src/pages/Configuracoes.tsx', title: 'Configurações', subtitle: 'Ajustes do sistema', icon: 'Settings' }
];

updates.forEach(u => {
  const filePath = path.join(__dirname, '..', u.file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${u.file}, not found.`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Update the title and add subtitle/icon if PageHeader exists
  let newContent = content.replace(
    /(<PageHeader\s+)(title="[^"]*")([\s\S]*?)(breadcrumbs=\{)/g,
    (match, p1, p2, p3, p4) => {
      // Avoid duplicating subtitle and icon if already injected
      if (p3.includes('subtitle=')) {
        return `${p1}title="${u.title}"\n        subtitle="${u.subtitle}"\n        icon={<${u.icon} />}\n        ${p4}`;
      }
      return `${p1}title="${u.title}"\n        subtitle="${u.subtitle}"\n        icon={<${u.icon} />}\n        ${p4}`;
    }
  );

  // Fallback for cases where it was written in one line or didn't have breadcrumbs just yet
  // If no change was made, it means the regex didn't hit.
  if (newContent === content) {
    newContent = content.replace(
      /(<PageHeader\s+)(title="[^"]*")/g,
      (match, p1, p2) => {
        return `${p1}title="${u.title}" subtitle="${u.subtitle}" icon={<${u.icon} />}`;
      }
    );
  }

  // Ensure the icon is imported
  const importRegex = new RegExp(`import\\s+\\{[^\\}]*${u.icon}[^\\}]*\\}\\s+from\\s+['"]lucide-react['"]`);
  if (!importRegex.test(newContent) && newContent.includes(`<${u.icon} />`)) {
    // Inject the import at the end of the first lucide-react import
    if (newContent.includes('lucide-react')) {
       newContent = newContent.replace(
         /(import\s+\{)([^}]*)(\}\s+from\s+['"]lucide-react['"])/,
         (match, p1, p2, p3) => {
           return `${p1}${u.icon}, ${p2}${p3}`;
         }
       );
    } else {
       // if no lucide-react import, add it after react imports
       newContent = newContent.replace(
         /(import.*?from ['"]react.*?['"];?\n)/,
         `$1import { ${u.icon} } from 'lucide-react';\n`
       );
    }
  }

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent);
    console.log(`Updated ${u.file}`);
  }
});
