import { useSearchParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import {
  Save,
  Eye,
  RotateCcw,
  Palette,
  Type,
  Layout,
  Grid,
  Users,
  Plus,
  Trash2,
  BedDouble,
  Maximize2,
  Bath,
  ChevronUp,
  ChevronDown,
  Image as ImageIcon,
  Upload,
  ChevronRight,
  Sparkles,
  Layers,
  FileText,
  X,
  Menu,
  Move,
  Globe,
  ArrowRight,
  Smartphone,
  Tablet,
  Monitor,
  Search,
  Code,
  Download,
  ArrowLeft,
} from 'lucide-react'
import { getTenantById } from '@/data/tenants'
import { mapBuilderToThemeS3, mapThemeS3ToBuilder } from '@/utils/themeAwsS3V2Mapper'
import { formatPrice } from '@/data/properties'


// ─── UTILS ──────────────────────────────────────────────────────────────────
const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

// ─── FONTS ──────────────────────────────────────────────────────────────────
const FONTS_LIST = [
  { name: 'Inter', category: 'sans-serif', desc: 'Moderno, limpo e extremamente legível' },
  { name: 'DM Sans', category: 'sans-serif', desc: 'Arrojado, contemporâneo e suave' },
  { name: 'Outfit', category: 'sans-serif', desc: 'Arquitetônico, geométrico e vanguardista' },
  { name: 'Playfair Display', category: 'serif', desc: 'Clássico, editorial e altamente luxuoso' },
  { name: 'Montserrat', category: 'sans-serif', desc: 'Urbano, corporativo e elegante' },
  { name: 'Lora', category: 'serif', desc: 'Literário, requintado e tradicional' },
  { name: 'Cormorant Garamond', category: 'serif', desc: 'Sofisticação extrema, traços finos' },
  { name: 'Syne', category: 'display', desc: 'Artesanal, autoral e focado em design' },
]

// ─── COLOR PRESETS ───────────────────────────────────────────────────────────
const COLOR_PRESETS = [
  {
    name: 'Ouro Imperial & Cream',
    desc: 'O clássico requinte de alto padrão',
    colors: { cream: '#F5F0E8', creamDark: '#EDE8DE', creamBorder: '#E0DAD0', charcoal: '#1C1916', charcoalLight: '#3D3731', warmGray: '#7C7269', gold: '#EDBF71', goldLight: '#F0D080' },
  },
  {
    name: 'Curitiba Verde Esmeralda',
    desc: 'Conexão com a sustentabilidade urbana',
    colors: { cream: '#F4F7F5', creamDark: '#E8EFEA', creamBorder: '#D2DFD6', charcoal: '#0D2114', charcoalLight: '#183824', warmGray: '#5C7465', gold: '#3A8266', goldLight: '#55A082' },
  },
  {
    name: 'Batel Noir & Platina',
    desc: 'Luxo vanguardista contemporâneo',
    colors: { cream: '#FAFAFA', creamDark: '#F4F4F5', creamBorder: '#E4E4E7', charcoal: '#09090B', charcoalLight: '#27272A', warmGray: '#717178', gold: '#18181B', goldLight: '#3F3F46' },
  },
  {
    name: 'Midnight & Safira',
    desc: 'Profundidade, prestígio e elegância noturna',
    colors: { cream: '#0B132B', creamDark: '#1C2541', creamBorder: '#3A506B', charcoal: '#FFFFFF', charcoalLight: '#F1F5F9', warmGray: '#94A3B8', gold: '#4895EF', goldLight: '#4CC9F0' },
  },
  {
    name: 'Coral Quente & Terracota',
    desc: 'Aconchego, calor e sofisticação orgânica',
    colors: { cream: '#FDFBF7', creamDark: '#F7F3EB', creamBorder: '#EFE6D5', charcoal: '#2D1E18', charcoalLight: '#4E3629', warmGray: '#8A7264', gold: '#E07A5F', goldLight: '#F4A261' },
  },
]

// ─── SYSTEM USERS (ALL CORRETORES DATABASE) ──────────────────────────────────
const ALL_SYSTEM_USERS = [
  { id: 'usr_claudia', name: 'Claudia Robles', role: 'Diretora Executiva (CEO)', phone: '(11) 99999-1111', email: 'claudia@robles.com.br', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80', instagram: 'https://instagram.com/' },
  { id: 'usr_rafaela', name: 'Rafaela Monteiro', role: 'Diretora Comercial', phone: '(11) 99847-3821', email: 'rafaela@robles.com.br', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80', instagram: 'https://instagram.com/' },
  { id: 'usr_gustavo', name: 'Gustavo Zanin', role: 'Curador de Lançamentos', phone: '(41) 99777-5555', email: 'gustavo@lumina.com.br', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', instagram: 'https://instagram.com/' },
  { id: 'usr_renata', name: 'Renata Vasconcellos', role: 'Consultora High-End', phone: '(21) 99666-4444', email: 'renata@v8.com.br', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80', instagram: 'https://instagram.com/' },
  { id: 'usr_thiago', name: 'Thiago Castilho', role: 'Gestor de Contratos', phone: '(41) 99555-3333', email: 'thiago@v8.com.br', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80', instagram: 'https://instagram.com/' },
  { id: 'usr_juliana', name: 'Juliana Lins', role: 'Especialista Batel', phone: '(41) 99444-2222', email: 'juliana@lumina.com.br', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80', instagram: 'https://instagram.com/' },
  { id: 'usr_marcos', name: 'Marcos Pontes', role: 'Vendas Internacionais', phone: '(11) 99333-1111', email: 'marcos@robles.com.br', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80', instagram: 'https://instagram.com/' },
  { id: 'usr_gabriela', name: 'Gabriela Duarte', role: 'Curadora de Coberturas', phone: '(48) 99222-0000', email: 'gabriela@v8.com.br', photo: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200&q=80', instagram: 'https://instagram.com/' }
]

// ─── STYLE PRESETS ───────────────────────────────────────────────────────────
const STYLE_PRESETS = [
  {
    id: 'moderno',
    name: 'Moderno',
    desc: 'Cores platina e safira com tipografia geométrica vanguardista.',
    colors: { cream: '#FAF9F6', creamDark: '#F0EFEA', creamBorder: '#E2E1D9', charcoal: '#0F172A', charcoalLight: '#1E293B', warmGray: '#64748B', gold: '#0EA5E9', goldLight: '#38BDF8' },
    fonts: { sans: 'Inter', display: 'Outfit' },
    settings: { headerStyle: 'minimal' as const, footerStyle: 'simple' as const, heroStyle: 'search-centered' as const, heroTitle: 'Coleção de Lançamentos Modernos', heroSubtitle: 'Apartamentos suspensos de alto padrão com arquitetura de vanguarda.', cardVariant: 'compact' as const, modules: { featured: true, categories: true, cities: true, testimonials: true, blog: true, launches: true }, moduleOrder: ['featured', 'categories', 'cities', 'testimonials'], sobreTitle: 'Vanguarda e Excelência Imobiliária', sobreText: 'Desenvolvemos curadorias específicas para clientes exigentes.', sobreImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', sobreStats: '10 Anos · 500+ Imóveis · R$ 2B+ Negociados', contatoTitle: 'Fale Conosco', contatoSubtitle: 'Fale com nossos curadores agora mesmo.', contatoAddress: 'Av. Batel, 1550 - Batel, Curitiba - PR' },
  },
  {
    id: 'minimalista',
    name: 'Minimalista',
    desc: 'Espaço, luz, contrastes puros e tipografia grotesca.',
    colors: { cream: '#FFFFFF', creamDark: '#F8F9FA', creamBorder: '#E9ECEF', charcoal: '#111111', charcoalLight: '#1F1F1F', warmGray: '#6C757D', gold: '#111111', goldLight: '#444444' },
    fonts: { sans: 'Inter', display: 'Inter' },
    settings: { headerStyle: 'transparent' as const, footerStyle: 'minimal' as const, heroStyle: 'minimalist' as const, heroTitle: 'Lumina Curadoria Imobiliária', heroSubtitle: 'Espaço, silêncio e luz natural. Uma seleção rigorosa de imóveis de grife.', cardVariant: 'horizontal' as const, modules: { featured: true, categories: false, cities: false, testimonials: false, blog: false, launches: false }, moduleOrder: ['featured', 'categories', 'cities', 'testimonials'], sobreTitle: 'Silêncio, Espaço e Luz', sobreText: 'Nossa missão é simples: filtrar o excesso.', sobreImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80', sobreStats: 'Curadoria Exclusiva · 0% Excesso · 100% Foco no Design', contatoTitle: 'Conexão Direta', contatoSubtitle: 'Seja atendido de forma confidencial por um de nossos diretores.', contatoAddress: 'Batel, Curitiba - PR' },
  },
  {
    id: 'classico',
    name: 'Clássico',
    desc: 'Tons creme aquecidos, detalhes dourados e tipografia serifada.',
    colors: { cream: '#FDFBF7', creamDark: '#F7F3EB', creamBorder: '#EFE6D5', charcoal: '#2D1E18', charcoalLight: '#4E3629', warmGray: '#8A7264', gold: '#EDBF71', goldLight: '#F0D080' },
    fonts: { sans: 'DM Sans', display: 'Playfair Display' },
    settings: { headerStyle: 'classic' as const, footerStyle: 'detailed' as const, heroStyle: 'search-left' as const, heroTitle: 'Residências de Prestígio Extraordinário', heroSubtitle: 'A herança viva da sofisticação e conforto no Batel, Cabral e Ecoville.', cardVariant: 'default' as const, modules: { featured: true, categories: true, cities: true, testimonials: true, blog: true, launches: true }, moduleOrder: ['featured', 'categories', 'cities', 'testimonials'], sobreTitle: 'Uma Tradição em Alto Padrão', sobreText: 'Há mais de uma década, somos sinônimo de excelência imobiliária.', sobreImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80', sobreStats: '15 Anos de Tradição · R$ 1.5B+ Negociados · 100% Satisfeitos', contatoTitle: 'Agende uma Reunião Privada', contatoSubtitle: 'Estamos prontos para recebê-lo em nossa sede no Batel.', contatoAddress: 'Av. do Batel, 1200 - Batel, Curitiba - PR' },
  },
  {
    id: 'luxo-esmeralda',
    name: 'Esmeralda',
    desc: 'Verde-floresta imperial com acentos dourados e tipografia display.',
    colors: { cream: '#FAF8F5', creamDark: '#EFECE5', creamBorder: '#E2DDD1', charcoal: '#050E0C', charcoalLight: '#122723', warmGray: '#7F9C96', gold: '#CBB279', goldLight: '#E1D5B5' },
    fonts: { sans: 'DM Sans', display: 'Playfair Display' },
    settings: { headerStyle: 'transparent' as const, footerStyle: 'column-grid' as const, heroStyle: 'video-ambient' as const, heroTitle: 'Coleção Imperial Esmeralda', heroSubtitle: 'Mansões contemporâneas e vilas privativas banhadas pela luz e envolvidas pelo luxo absoluto.', cardVariant: 'default' as const, modules: { featured: true, categories: true, cities: true, testimonials: true, blog: true, launches: true }, moduleOrder: ['featured', 'categories', 'cities', 'testimonials'], sobreTitle: 'Sobre a Grife Esmeralda', sobreText: 'Nossa missão é esculpir experiências e espaços sob medida.', sobreImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', sobreStats: 'Coleção Limitada · 100% Exclusividade · Selo Ouro', contatoTitle: 'Visita Privada', contatoSubtitle: 'Solicite atendimento por nossa equipe de diretores especialistas.', contatoAddress: 'São Paulo - SP' },
  },
  {
    id: 'industrial-loft',
    name: 'Loft Urbano',
    desc: 'Visual de concreto cru, aço escovado e tons terracota e laranja.',
    colors: { cream: '#F2F2F2', creamDark: '#E5E5E5', creamBorder: '#CCCCCC', charcoal: '#1A1A1A', charcoalLight: '#2D2D2D', warmGray: '#8E8E8E', gold: '#D35400', goldLight: '#E67E22' },
    fonts: { sans: 'Inter', display: 'Outfit' },
    settings: { headerStyle: 'minimal' as const, footerStyle: 'modern-newsletter' as const, heroStyle: 'split-screen' as const, heroTitle: 'Industrial Loft Living', heroSubtitle: 'Penthouses de tijolos à vista, vigas de ferro e janelas monumentais nos bairros cosmopolitas.', cardVariant: 'compact' as const, modules: { featured: true, categories: true, cities: true, testimonials: false, blog: true, launches: true }, moduleOrder: ['featured', 'categories', 'cities', 'testimonials'], sobreTitle: 'A Estética Loft', sobreText: 'Nascido em Nova Iorque, redefinido para a sua próxima vivência urbana.', sobreImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80', sobreStats: 'Estilo Industrial · Conceito Aberto · Altíssimo Padrão', contatoTitle: 'Agendar Visita', contatoSubtitle: 'Conecte-se com nossa curadoria.', contatoAddress: 'Batel, Curitiba - PR' },
  },
  {
    id: 'luxury-gold',
    name: 'Realeza',
    desc: 'Preto profundo luxuoso com dourado cintilante e sofisticação monárquica.',
    colors: { cream: '#FFFFFF', creamDark: '#F8F9FA', creamBorder: '#E9ECEF', charcoal: '#0B0C10', charcoalLight: '#1F2833', warmGray: '#C5C6C7', gold: '#D4AF37', goldLight: '#F3E5AB' },
    fonts: { sans: 'Inter', display: 'Playfair Display' },
    settings: { headerStyle: 'transparent' as const, footerStyle: 'brand-glow' as const, heroStyle: 'search-centered' as const, heroTitle: 'Vilas de Altíssimo Luxo e Penthouses', heroSubtitle: 'Casas monumentais desenhadas para superar todas as expectativas de privacidade e exclusividade.', cardVariant: 'horizontal' as const, modules: { featured: true, categories: true, cities: true, testimonials: true, blog: true, launches: true }, moduleOrder: ['featured', 'categories', 'cities', 'testimonials'], sobreTitle: 'Legado de Prestígio', sobreText: 'A redefinição da alta moradia por meio de curadoria focada em arquitetura extraordinária.', sobreImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80', sobreStats: 'Casas Palacianas · Coberturas Únicas · R$ 5B+ Comercializados', contatoTitle: 'Atendimento Premium', contatoSubtitle: 'Um de nossos diretores associados retornará seu contato confidencial.', contatoAddress: 'Jardins, São Paulo - SP' },
  },
]

// ─── CARD TAGS ───────────────────────────────────────────────────────────────
const CARD_TAGS = [
  { id: 'none', label: 'Nenhuma', color: 'bg-slate-200 text-slate-600', emoji: '—' },
  { id: 'destaque', label: 'Destaque', color: 'bg-amber-500 text-white', emoji: '⭐' },
  { id: 'exclusivo', label: 'Exclusivo', color: 'bg-violet-600 text-white', emoji: '💎' },
  { id: 'oportunidade', label: 'Oportunidade', color: 'bg-red-500 text-white', emoji: '🔥' },
  { id: 'novo', label: 'Novo', color: 'bg-emerald-500 text-white', emoji: '✨' },
  { id: 'lancamento', label: 'Lançamento', color: 'bg-blue-600 text-white', emoji: '🚀' },
]

// ─── HOME BLOCKS AVAILABLE ───────────────────────────────────────────────────
const ALL_HOME_BLOCKS = [
  { id: 'stats', label: '📊 Stats Bar', desc: 'Números de destaque da empresa' },
  { id: 'featured', label: '✨ Imóveis em Destaque', desc: 'Grid premium de imóveis selecionados' },
  { id: 'categories', label: '🗂️ Categorias', desc: 'Comprar, Alugar, Lançamentos' },
  { id: 'launches', label: '🚀 Novos Lançamentos', desc: 'Cards de empreendimentos na planta' },
  { id: 'cities', label: '🏙️ Cidades & Bairros', desc: 'Onde a empresa atua' },
  { id: 'testimonials', label: '💬 Depoimentos', desc: 'O que dizem os clientes' },
  { id: 'cta', label: '📣 CTA (Anunciar)', desc: 'Chamada para anunciar imóvel' },
  { id: 'tags', label: '🔗 Nuvem de Tags', desc: 'Termos de busca populares' },
]

// ─── PAGE STRUCTURES ─────────────────────────────────────────────────────────
const PAGE_STRUCTURES = [
  { id: 'editorial', name: 'Editorial', desc: '2 colunas · Texto + Imagem lado a lado', icon: '📰' },
  { id: 'centered', name: 'Centrado', desc: 'Conteúdo centralizado · Hero no topo', icon: '🎯' },
  { id: 'magazine', name: 'Magazine', desc: 'Header imersivo + seções em blocos', icon: '✦' },
]

const PAGE_BLOCKS_OPTIONS = [
  { id: 'hero', label: 'Hero / Banner' },
  { id: 'text', label: 'Texto Principal' },
  { id: 'stats', label: 'Estatísticas' },
  { id: 'team', label: 'Equipe' },
  { id: 'form', label: 'Formulário' },
  { id: 'testimonials', label: 'Depoimentos' },
  { id: 'cta', label: 'Call to Action' },
  { id: 'gallery', label: 'Galeria' },
]

// ─── SUBPAGES ────────────────────────────────────────────────────────────────
const SUBPAGES = [
  { id: 'comprar', label: 'Comprar', emoji: '🏠', editable: false },
  { id: 'alugar', label: 'Alugar', emoji: '🔑', editable: false },
  { id: 'lancamentos', label: 'Lançamentos', emoji: '🚀', editable: false },
  { id: 'anunciar', label: 'Anunciar', emoji: '📣', editable: true },
  { id: 'blog', label: 'Blog', emoji: '📝', editable: false },
  { id: 'sobre', label: 'Sobre', emoji: '📖', editable: true },
  { id: 'contato', label: 'Contato', emoji: '📞', editable: true },
]

// ─── MOCK PROPERTY ───────────────────────────────────────────────────────────
const mockProperty = {
  title: 'Ícaro Jardins do Batel — Cobertura Suspensa',
  neighborhood: 'Batel',
  city: 'Curitiba',
  bedrooms: 4,
  bathrooms: 5,
  area: 385,
  condoPrice: 2400,
  price: 8900000,
  purpose: 'venda',
  type: 'Cobertura',
  image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80',
}

// ─── SECTION ACCORDION ──────────────────────────────────────────────────────
function SectionAccordion({
  icon,
  title,
  isOpen,
  onToggle,
  isDisabled = false,
  children,
}: {
  icon: React.ReactNode
  title: string
  isOpen: boolean
  onToggle: () => void
  isDisabled?: boolean
  children: React.ReactNode
}) {
  return (
    <div
      id={`accordion-${title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`}
      className={`bg-white border rounded-2xl overflow-hidden shadow-sm transition-all duration-300 ${
        isDisabled ? 'opacity-40 pointer-events-none' : ''
      } ${
        isOpen ? 'border-[hsl(221_68%_50%)] ring-2 ring-blue-50 shadow-md scale-[1.01]' : 'border-slate-200'
      }`}
    >
      <button
        type="button"
        disabled={isDisabled}
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors cursor-pointer border-0"
      >
        <div className="flex items-center gap-2.5">
          <span className={isOpen ? 'text-[hsl(221_68%_45%)] scale-110 transition-transform' : 'text-slate-400'}>{icon}</span>
          <h2 className={`text-xs font-bold uppercase tracking-wider ${isOpen ? 'text-[hsl(221_68%_25%)]' : 'text-slate-800'}`}>{title}</h2>
        </div>
        <ChevronRight size={14} className={`text-slate-400 transition-transform duration-350 ${isOpen ? 'rotate-90 text-[hsl(221_68%_45%)]' : ''}`} />
      </button>
      {isOpen && !isDisabled && (
        <div className="px-5 pt-5 pb-5 space-y-5 border-t border-slate-100 bg-white">
          {children}
        </div>
      )}
    </div>
  )
}

// ─── TOGGLE ─────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <div
        onClick={() => onChange(!checked)}
        className={`relative w-9 h-5 rounded-full transition-colors ${checked ? 'bg-[hsl(221_68%_40%)]' : 'bg-slate-200'}`}
      >
        <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-4' : ''}`} />
      </div>
      <span className="text-xs text-slate-700 group-hover:text-slate-900 font-medium">{label}</span>
    </label>
  )
}

// ─── INPUT FIELD ────────────────────────────────────────────────────────────
function InputField({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[hsl(221_68%_50%)] transition-colors"
      />
    </div>
  )
}

function TextareaField({ label, value, onChange, placeholder, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <div>
      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[hsl(221_68%_50%)] transition-colors resize-none"
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export function EditorSitePage() {
  const navigate = useNavigate()
  // Get tenantId dynamically from URL query params
  const [searchParams] = useSearchParams()
  const activeTenantId = searchParams.get('tenantId') || 'lumina'
  const defaultTenant = getTenantById(activeTenantId) || getTenantById('lumina')

  // Colors & fonts
  const [colors, setColors] = useState({
    cream: '#FAFAFA', creamDark: '#F4F4F5', creamBorder: '#E4E4E7',
    charcoal: '#09090B', charcoalLight: '#27272A', warmGray: '#717178',
    gold: '#18181B', goldLight: '#3F3F46',
  })
  const [fonts, setFonts] = useState({ sans: 'Inter', display: 'Outfit' })

  // UI state
  const [activePreviewTab, setActivePreviewTab] = useState('home')
  const [activeFontTab, setActiveFontTab] = useState<'sans' | 'display'>('sans')
  const previewTabsRef = useRef<HTMLDivElement>(null)
  
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [previewNavOpen, setPreviewNavOpen] = useState(false)
  const [syncCardStyles, setSyncCardStyles] = useState(false)

  useEffect(() => {
    setPreviewNavOpen(false)
  }, [activePreviewTab])

  // Premium Toasts State & Helper
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'info' | 'error' }[]>([])
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }

  // Exclusive Accordion & Wizard state (Requirement 6)
  const [openSectionId, setOpenSectionId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const isFirst = window.localStorage.getItem('v8_builder_first_time') === 'true'
      return isFirst ? '' : 'cadastro'
    }
    return 'cadastro'
  })
  const [maxUnlockedStepIndex, setMaxUnlockedStepIndex] = useState<number>(0)
  const [isFirstTime, setIsFirstTime] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('v8_builder_first_time') === 'true'
    }
    return false
  })

  const SECTIONS_ORDER = [
    'cadastro',
    'presets',
    'colors',
    'uploads',
    'fonts',
    'cards',
    'hero',
    'subpages',
    'structures',
    'homeblocks',
    'cities',
    'team',
    'content',
    'fields',
    'domain',
    'seo',
    'css',
    's3config'
  ]

  const handleWizardNext = (currentSection: string) => {
    const currentIndex = SECTIONS_ORDER.indexOf(currentSection)
    if (currentIndex !== -1 && currentIndex < SECTIONS_ORDER.length - 1) {
      const nextSection = SECTIONS_ORDER[currentIndex + 1]
      if (isFirstTime) {
        setMaxUnlockedStepIndex(prev => Math.max(prev, currentIndex + 1))
      }
      setOpenSectionId(nextSection)
      setTimeout(() => {
        const element = document.getElementById(`accordion-${nextSection}`)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }
      }, 150)
    } else {
      setIsFirstTime(false)
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('v8_builder_first_time')
      }
      showToast('Parabéns! O seu site imobiliário modular foi construído com sucesso! Agora você pode exportar ou visualizar.', 'success')
    }
  }

  const toggleSection = (sectionId: string) => {
    if (isFirstTime) {
      const index = SECTIONS_ORDER.indexOf(sectionId)
      if (index > maxUnlockedStepIndex) {
        showToast('Por favor, complete a etapa atual e clique em Salvar & Continuar.', 'error')
        return
      }
    }
    setOpenSectionId(openSectionId === sectionId ? '' : sectionId)
  }

  const renderWizardNextButton = (sectionId: string) => {
    const isLast = sectionId === 'domain'
    return (
      <div className="flex justify-end pt-3 border-t border-slate-100 mt-4">
        <button
          type="button"
          onClick={() => handleWizardNext(sectionId)}
          className="px-5 py-2.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border-0 shadow-sm bg-[hsl(221_68%_40%)] text-white"
        >
          {isLast ? '✓ Concluir Construção' : 'Salvar & Continuar →'}
        </button>
      </div>
    )
  }

  // Custom domain fields
  const [customDomain, setCustomDomain] = useState('')
  const [customDomains, setCustomDomains] = useState<string[]>([])
  const [domainStatus, setDomainStatus] = useState<'connected' | 'pending'>('pending')
  const [newDomainInput, setNewDomainInput] = useState('')
  const [s3JsonInput, setS3JsonInput] = useState('')

  // Settings
  const [settings, setSettings] = useState({
    name: defaultTenant?.name || 'Lumina Curadoria',
    slug: defaultTenant?.slug || 'lumina',
    status: (defaultTenant?.status || 'online') as 'online' | 'offline',
    headerStyle: 'minimal' as 'transparent' | 'minimal' | 'classic',
    headerFixed: true,
    footerStyle: 'simple' as 'simple' | 'detailed' | 'minimal' | 'modern-newsletter' | 'column-grid' | 'brand-glow',
    heroStyle: 'minimalist' as 'search-centered' | 'search-left' | 'search-right' | 'minimalist' | 'split-screen' | 'video-ambient',
    heroTitle: 'Coleção Lançamentos Curitiba',
    heroSubtitle: 'Curadoria especializada de apartamentos, coberturas e residências suspensas com design assinado.',
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=85&fit=crop',
    logo: '/logo.png',
    logoLight: '',
    marcaDagua: '',
    favicon: '/favicon.ico',
    cardVerticalStyle: 'classic' as string,
    cardHorizontalStyle: 'classic' as string,
    cardTag: 'destaque' as string,
    showCardBedrooms: true,
    showCardBathrooms: false,
    showCardArea: true,
    showCardCondo: false,
    showCardPetFriendly: false,
    modules: { featured: true, categories: true, cities: true, testimonials: false, blog: true, launches: true },
    homeBlocks: ['stats', 'featured', 'categories', 'launches', 'cities', 'testimonials', 'cta', 'tags'],
    enabledPages: {
      comprar: true, alugar: true, lancamentos: true,
      anunciar: true, blog: true, sobre: true, contato: true,
    },
    pageStructures: {
      sobre: 'editorial' as 'editorial' | 'centered' | 'magazine',
      anunciar: 'editorial' as 'editorial' | 'centered' | 'magazine',
      contato: 'editorial' as 'editorial' | 'centered' | 'magazine',
      blog: 'editorial' as 'editorial' | 'centered' | 'magazine',
    },
    pageBlocks: {
      sobre: ['hero', 'text', 'stats', 'team'],
      anunciar: ['hero', 'text', 'form'],
      contato: ['hero', 'form', 'text'],
    },
    pageBlocksLayout: {
      sobre: 'stack' as 'stack' | 'grid',
      anunciar: 'stack' as 'stack' | 'grid',
      contato: 'stack' as 'stack' | 'grid',
    },
    citiesList: [
      { name: 'Porto Feliz', state: 'SP', count: 84, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80' },
      { name: 'Santana de Parnaíba', state: 'SP', count: 142, image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80' },
      { name: 'São Paulo', state: 'SP', count: 542, image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80' },
      { name: 'São Sebastião', state: 'SP', count: 78, image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80' },
      { name: 'Ubatuba', state: 'SP', count: 63, image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&q=80' },
    ] as any[],
    teamStyle: 'grid' as 'grid' | 'cards' | 'list' | 'minimal',
    formFields: {
      name: { label: 'Nome Completo', enabled: true, required: true },
      phone: { label: 'WhatsApp / Telefone', enabled: true, required: true },
      email: { label: 'E-mail', enabled: true, required: false },
      message: { label: 'Mensagem de Interesse', enabled: true, required: false },
      propertyType: { label: 'Tipo de Imóvel', enabled: false, required: false },
      neighborhood: { label: 'Bairro de Interesse', enabled: false, required: false },
    },
    homeFilters: ['tipo', 'neighborhood'],
    searchFiltersLayout: 'topbar' as 'sidebar' | 'topbar',
    detailGalleryStyle: 'slider' as 'mosaic' | 'slider' | 'grid',
    openingHours: 'Segunda a Sexta das 10h às 19h · Sábados das 10h às 16h',
    team: [] as any[],
    moduleOrder: ['featured', 'categories', 'cities', 'testimonials'] as string[],
    sobreTitle: 'Nossa História, Seu Futuro',
    sobreText: 'Na Lumina, acreditamos que encontrar um imóvel de alto padrão em Curitiba é uma arte. Selecionamos cada propriedade com rigor estético e técnico.',
    sobreImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    sobreStats: '15 Anos, De Tradição . 400+, Sonhos Realizados . R$ 1.5B+, Negociados',
    anunciarTitle: 'Anuncie seu Imóvel',
    anunciarSubtitle: 'Alcance milhares de compradores qualificados com nossa plataforma premium.',
    contatoTitle: 'Conecte-se com a Exclusividade',
    contatoSubtitle: 'Agende uma visita exclusiva com nossos curadores de imóveis no Batel.',
    contatoAddress: 'Av. do Batel, 1200 - Batel, Curitiba/PR',
    seoKeywords: '',
    googleAnalyticsId: '',
    googleTagManagerId: '',
    googleSiteVerificationId: '',
    googleAdsConversionId: '',
    googleAdsConversionLabel: '',
    googleAdsRemarketingId: '',
    facebookPixelId: '',
    facebookConversionToken: '',
    pinterestTagId: '',
    rdStationToken: '',
    rdStationScript: '',
    linkedinInsightId: '',
    tiktokPixelId: '',
    customScriptsHead: '',
    customScriptsBody: '',
    customCss: '',
  })

  const [contacts, setContacts] = useState({
    phone: '(41) 3012-9876',
    phoneRaw: '+554130129876',
    whatsapp: '(41) 98877-6655',
    whatsappRaw: '5541988776655',
    email: 'curadoria@luminaimoveis.com.br',
    creci: 'CRECI-PR 45.892-F',
    address: { street: 'Alameda Dom Pedro II, nº 321', neighborhood: 'Batel', city: 'Curitiba', state: 'PR', fullAddress: 'Edifício Batel Workspace, Batel, Curitiba - PR' },
  })

  // File upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, key: 'logo' | 'logoLight' | 'marcaDagua' | 'favicon' | 'heroImage') => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      setSettings(prev => ({ ...prev, [key]: base64 }))
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && settings.favicon) {
      const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement
      if (link) { link.href = settings.favicon }
      else { const l = document.createElement('link'); l.rel = 'icon'; l.href = settings.favicon; document.head.appendChild(l) }
    }
  }, [settings.favicon])

  // Load from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`${activeTenantId}_builder_settings`)
      if (stored) {
        try {
          const p = JSON.parse(stored)
          if (p.colors) setColors(p.colors)
          if (p.fonts) setFonts(p.fonts)
          if (p.contacts) setContacts(p.contacts)
          if (p.customDomains) setCustomDomains(p.customDomains)
          else if (p.customDomain) setCustomDomains([p.customDomain])
          if (p.customDomain) setCustomDomain(p.customDomain)
          setSettings(prev => ({
            ...prev,
            ...p,
            name: p.name || prev.name,
            slug: p.slug || prev.slug,
            status: p.status || prev.status || 'online',
            modules: { ...prev.modules, ...(p.modules || {}) },
            enabledPages: { ...prev.enabledPages, ...(p.enabledPages || {}) },
            pageStructures: { ...prev.pageStructures, ...(p.pageStructures || {}) },
            pageBlocks: { ...prev.pageBlocks, ...(p.pageBlocks || {}) },
            homeBlocks: p.homeBlocks || prev.homeBlocks,
            teamStyle: p.teamStyle || prev.teamStyle,
            formFields: { ...prev.formFields, ...(p.formFields || {}) },
            team: p.team || (defaultTenant?.builderSettings?.team || []),
          }))
        } catch (e) { console.error(e) }
      } else if (defaultTenant) {
        setSettings(prev => ({
          ...prev,
          ...defaultTenant.builderSettings,
          name: defaultTenant.name,
          slug: defaultTenant.slug,
          team: defaultTenant.builderSettings.team || [],
          formFields: (defaultTenant.builderSettings as any).formFields || prev.formFields,
          teamStyle: (defaultTenant.builderSettings as any).teamStyle || prev.teamStyle,
        }) as any)
        if (defaultTenant.colors) setColors(defaultTenant.colors)
        if (defaultTenant.fonts) setFonts(defaultTenant.fonts as any)
        if (defaultTenant.contacts) {
          setContacts({
            ...defaultTenant.contacts,
            creci: defaultTenant.creci || '',
          })
        }
      }
    }
  }, [activeTenantId])

  const handleSave = (redirectToSite = false) => {
    if (typeof window !== 'undefined') {
      const payload = { 
        ...settings, 
        colors, 
        fonts, 
        contacts, 
        creci: contacts.creci,
        customDomain: customDomains[0] || '',
        customDomains,
      }
      localStorage.setItem(`${activeTenantId}_builder_settings`, JSON.stringify(payload))
      
      // If it is a custom dynamic tenant, let's also update the custom tenant definition in v8_custom_tenants!
      if (activeTenantId.startsWith('custom_')) {
        const customTenants = JSON.parse(localStorage.getItem('v8_custom_tenants') || '[]')
        const idx = customTenants.findIndex((t: any) => t.id === activeTenantId)
        if (idx >= 0) {
          customTenants[idx] = {
            ...customTenants[idx],
            name: settings.name,
            slug: settings.slug,
            tagline: settings.heroTitle || customTenants[idx].tagline,
            creci: contacts.creci || customTenants[idx].creci,
            logo: settings.logo || customTenants[idx].logo,
            status: settings.status,
            customDomain: customDomains[0] || '',
            customDomains,
          }
          localStorage.setItem('v8_custom_tenants', JSON.stringify(customTenants))
        }
      }
      
      window.dispatchEvent(new Event('lumina_builder_updated'))
      if (redirectToSite) { window.open(`/${settings.slug || defaultTenant?.slug || 'lumina'}`, '_blank') }
      else { showToast('Identidade visual LEGO e componentes salvos com sucesso!', 'success') }
    }
  }

  const handleReset = () => {
    if (confirm('Tem certeza que deseja resetar para o padrão inicial deste tema?')) {
      if (typeof window !== 'undefined') { 
        localStorage.removeItem(`${activeTenantId}_builder_settings`); 
        window.location.reload() 
      }
    }
  }

  // Team
  const addTeamMember = () => {
    setSettings(prev => ({ ...prev, team: [...prev.team, { name: 'Novo Consultor', role: 'Especialista Batel', phone: '(41) 98888-7777', email: 'consultor@lumina.com.br', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80', instagram: 'https://instagram.com/' }] }))
  }
  const toggleSystemUser = (sysUser: any) => {
    setSettings(prev => {
      const exists = prev.team.some((t: any) => t.id === sysUser.id || t.name === sysUser.name);
      if (exists) {
        return {
          ...prev,
          team: prev.team.filter((t: any) => t.id !== sysUser.id && t.name !== sysUser.name)
        }
      } else {
        return {
          ...prev,
          team: [...prev.team, { ...sysUser }]
        }
      }
    })
  }
  const updateTeamMember = (index: number, key: string, value: string) => {
    const list = [...settings.team]; list[index] = { ...list[index], [key]: value }
    setSettings(prev => ({ ...prev, team: list }))
  }
  const removeTeamMember = (index: number) => {
    setSettings(prev => ({ ...prev, team: prev.team.filter((_: any, i: number) => i !== index) }))
  }

  // Home blocks
  const addHomeBlock = (id: string) => {
    if (!settings.homeBlocks.includes(id)) {
      setSettings(prev => ({ ...prev, homeBlocks: [...prev.homeBlocks, id] }))
    }
  }
  const removeHomeBlock = (id: string) => {
    setSettings(prev => ({ ...prev, homeBlocks: prev.homeBlocks.filter(b => b !== id) }))
  }
  const moveHomeBlock = (index: number, dir: 'up' | 'down') => {
    const list = [...settings.homeBlocks]
    const target = dir === 'up' ? index - 1 : index + 1
    if (target < 0 || target >= list.length) return
    ;[list[index], list[target]] = [list[target], list[index]]
    setSettings(prev => ({ ...prev, homeBlocks: list }))
  }

  // Page blocks
  const togglePageBlock = (page: 'sobre' | 'anunciar' | 'contato', blockId: string) => {
    setSettings(prev => {
      const current = prev.pageBlocks[page] || []
      const next = current.includes(blockId) ? current.filter(b => b !== blockId) : [...current, blockId]
      return { ...prev, pageBlocks: { ...prev.pageBlocks, [page]: next } }
    })
  }

  // Active preview pages
  const activePreviewPages = [
    { id: 'home', label: '🏠 Home', always: true },
    ...SUBPAGES.filter(p => settings.enabledPages[p.id as keyof typeof settings.enabledPages]).map(p => ({ id: p.id, label: `${p.emoji} ${p.label}`, always: false })),
  ]

  // CSS vars for preview
  const previewStyles = {
    '--theme-cream': colors.cream, '--theme-cream-dark': colors.creamDark,
    '--theme-cream-border': colors.creamBorder, '--theme-charcoal': colors.charcoal,
    '--theme-charcoal-light': colors.charcoalLight, '--theme-warm-gray': colors.warmGray,
    '--theme-gold': colors.gold, '--theme-gold-light': colors.goldLight,
    '--theme-font-sans': fonts.sans, '--theme-font-display': fonts.display,
    '--color-cream': colors.cream, '--color-cream-dark': colors.creamDark,
    '--color-cream-border': colors.creamBorder, '--color-charcoal': colors.charcoal,
    '--color-charcoal-light': colors.charcoalLight, '--color-warm-gray': colors.warmGray,
    '--color-gold': colors.gold, '--color-gold-light': colors.goldLight,
    '--font-sans': `'${fonts.sans}', sans-serif`, '--font-display': `'${fonts.display}', serif`,
  } as React.CSSProperties

  // ─── CARD RENDERERS ─────────────────────────────────────────────────────────
  const renderVerticalCard = (property: any, styleName: string, tag?: typeof CARD_TAGS[0]) => {
    const isDark = styleName === 'dark-elegance'
    let cardClass = 'rounded-xl overflow-hidden shadow-sm transition-all border '
    if (styleName === 'classic') cardClass += 'bg-white border-slate-200 hover:shadow-md'
    else if (styleName === 'minimalist') cardClass += 'bg-white border-slate-200 shadow-none hover:border-slate-400'
    else if (styleName === 'glassmorphism') cardClass += 'bg-white/40 backdrop-blur-md border-white/20 shadow-lg'
    else if (styleName === 'editorial') cardClass += 'bg-white border-slate-100 hover:border-slate-300'
    else if (styleName === 'bold-border') cardClass += 'bg-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_#EDBF71]'
    else if (styleName === 'dark-elegance') cardClass += 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-xl'

    const tagInfo = tag && tag.id !== 'none' ? tag : null

    return (
      <div className={`${cardClass} flex flex-col h-full text-left`}>
        <div className="relative h-28 bg-slate-100 overflow-hidden shrink-0">
          <img src={property.image} className="w-full h-full object-cover" />
          {tagInfo && (
            <span className={`absolute top-2 left-2 ${tagInfo.color} text-[7px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider`}>
              {tagInfo.emoji} {tagInfo.label}
            </span>
          )}
          {styleName === 'editorial' && (
            <span className="absolute top-2 right-2 bg-slate-900 text-white font-bold text-[7px] px-1.5 py-0.5 rounded font-display uppercase tracking-widest">Collection</span>
          )}
        </div>
        <div className="p-3 flex flex-col justify-between flex-grow">
          <div className="space-y-1">
            <div className={`text-[7px] uppercase tracking-widest font-semibold ${isDark ? 'text-amber-400/90' : 'text-slate-500'}`}>{property.neighborhood}</div>
            <div className={`text-[10px] font-bold line-clamp-2 leading-tight ${isDark ? 'text-white' : 'text-slate-900'} ${styleName === 'classic' || styleName === 'editorial' ? 'font-display' : ''}`} style={{ fontFamily: styleName === 'classic' || styleName === 'editorial' ? fonts.display : fonts.sans }}>{property.title}</div>
          </div>
          <div className="mt-3">
            <div className={`flex flex-wrap gap-2 text-[8px] border-b pb-1.5 mb-1.5 ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
              {settings.showCardBedrooms && <span><BedDouble size={8} className="inline mr-0.5" />{property.bedrooms} Qts</span>}
              {settings.showCardBathrooms && <span><Bath size={8} className="inline mr-0.5" />{property.bathrooms} Banh</span>}
              {settings.showCardArea && <span><Maximize2 size={8} className="inline mr-0.5" />{property.area}m²</span>}
              {settings.showCardCondo && <span>Cond: {formatPrice(property.condoPrice)}</span>}
              {settings.showCardPetFriendly && <span className="text-emerald-500 font-bold">Pet</span>}
            </div>
            <div className={`text-xs font-bold ${isDark ? 'text-amber-400' : 'text-slate-900'}`} style={{ fontFamily: fonts.display }}>{formatPrice(property.price)}</div>
          </div>
        </div>
      </div>
    )
  }

  const renderHorizontalCard = (property: any, styleName: string, tag?: typeof CARD_TAGS[0]) => {
    let cardClass = 'rounded-xl overflow-hidden shadow-sm transition-all border flex h-24 '
    const isDark = styleName === 'dark-elegance' || styleName === 'dashboard'

    if (styleName === 'classic' || styleName === 'cozy') cardClass += 'bg-white border-slate-200 hover:shadow-md'
    else if (styleName === 'minimalist' || styleName === 'strip') cardClass += 'bg-white border-slate-200 shadow-none border-b-2 hover:border-b-slate-400 rounded-none border-t-0 border-l-0 border-r-0'
    else if (styleName === 'glassmorphism' || styleName === 'overlay') cardClass += 'bg-white/40 backdrop-blur-md border-white/20 shadow-lg'
    else if (styleName === 'bold-border' || styleName === 'offset') cardClass += 'bg-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_#EDBF71]'
    else if (styleName === 'editorial' || styleName === 'asymmetric') cardClass += 'bg-white border-slate-200 hover:shadow-md rounded-tr-2xl rounded-bl-2xl'
    else if (styleName === 'dark-elegance' || styleName === 'dashboard') cardClass += 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-xl text-slate-100'

    const tagInfo = tag && tag.id !== 'none' ? tag : null

    return (
      <div className={`${cardClass} text-left w-full`}>
        <div className={`shrink-0 overflow-hidden bg-slate-100 relative ${styleName === 'editorial' || styleName === 'asymmetric' ? 'w-24 rounded-tr-2xl rounded-bl-2xl' : 'w-24'}`}>
          <img src={property.image} className="w-full h-full object-cover" />
          {tagInfo && (
            <span className={`absolute top-1.5 left-1.5 ${tagInfo.color} text-[6px] font-bold px-1 py-0.5 rounded-full uppercase`}>
              {tagInfo.emoji}
            </span>
          )}
        </div>
        <div className="p-2.5 flex flex-col justify-between flex-1 min-w-0">
          <div className="min-w-0 space-y-0.5">
            <div className={`text-[7px] uppercase tracking-widest font-semibold ${isDark ? 'text-amber-400/90' : 'text-slate-500'}`}>{property.neighborhood}</div>
            <div className={`text-[9px] font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: styleName === 'editorial' || styleName === 'asymmetric' ? fonts.display : fonts.sans }}>{property.title}</div>
          </div>
          <div>
            <div className={`flex flex-wrap gap-1.5 text-[8px] mb-1 border-t pt-1 ${isDark ? 'text-slate-400 border-slate-800' : 'text-slate-500 border-slate-100'}`}>
              {settings.showCardBedrooms && <span>{property.bedrooms}Q</span>}
              {settings.showCardBathrooms && <span>{property.bathrooms}B</span>}
              {settings.showCardArea && <span>{property.area}m²</span>}
              {settings.showCardCondo && <span className="text-[7px]">Cond: {formatPrice(property.condoPrice)}</span>}
              {settings.showCardPetFriendly && <span className="text-emerald-500 font-bold">Pet</span>}
            </div>
            <div className={`text-[10px] font-bold ${isDark ? 'text-amber-400' : 'text-slate-900'}`} style={{ fontFamily: fonts.display }}>{formatPrice(property.price)}</div>
          </div>
        </div>
      </div>
    )
  }

  // ─── HIGH-FIDELITY PREVIEW NAVBAR ──────────────────────────────────────────
  const renderNavbar = () => {
    const isTransparentHome = settings.headerStyle === 'transparent' && activePreviewTab === 'home' && settings.heroStyle !== 'minimalist'
    
    const logoSrc = isTransparentHome && settings.logoLight ? settings.logoLight : settings.logo
    const shouldInvertLogo = isTransparentHome && !settings.logoLight && settings.logo

    const logoEl = logoSrc ? (
      <img src={logoSrc} className={`h-5 w-auto object-contain transition-all ${shouldInvertLogo ? 'brightness-0 invert' : ''}`} alt="Logo" />
    ) : (
      <div className="flex items-center gap-1">
        <div className="w-5 h-5 rounded-full flex items-center justify-center overflow-hidden text-[9px] font-bold" style={{ backgroundColor: colors.gold, color: colors.cream }}>
          {settings.marcaDagua ? <img src={settings.marcaDagua} className="w-full h-full object-cover" /> : (defaultTenant?.name?.charAt(0) || 'L')}
        </div>
        <span className="text-[10px] font-bold tracking-tight" style={{ fontFamily: fonts.display, color: isTransparentHome ? '#fff' : colors.charcoal }}>{defaultTenant?.name || 'Lumina'}</span>
      </div>
    )

    const navItems = [
      { id: 'home', label: 'Home' },
      ...SUBPAGES.filter(p => settings.enabledPages[p.id as keyof typeof settings.enabledPages]).map(p => ({ id: p.id, label: p.label })),
    ]

    const isMobileMode = previewDevice === 'mobile' || previewDevice === 'tablet'

    return (
      <header className={`z-30 transition-all ${isTransparentHome ? 'absolute top-0 left-0 right-0 bg-transparent' : ''}`}
        style={isTransparentHome ? {} : { backgroundColor: settings.headerStyle === 'transparent' ? colors.creamDark : settings.headerStyle === 'classic' ? colors.cream : '#fff', borderBottom: settings.headerStyle === 'classic' ? `4px double ${colors.gold}60` : `1px solid ${settings.headerStyle === 'transparent' ? colors.creamBorder : '#e2e8f0'}` }}>
        <div className="px-3.5 py-2.5 flex items-center justify-between">
          {/* Left: Logo */}
          <button type="button" onClick={() => { setActivePreviewTab('home'); setPreviewNavOpen(false); }} className="hover:opacity-85 flex items-center gap-1.5 text-left cursor-pointer bg-transparent border-0 p-0">
            {logoEl}
          </button>

          {/* Center/Right for Desktop */}
          {!isMobileMode ? (
            <>
              {/* Menu Links */}
              <nav className="flex items-center gap-3.5">
                {navItems.map(n => (
                  <button key={n.id} type="button" onClick={() => setActivePreviewTab(n.id)} className={`text-[8px] font-semibold transition-all relative py-0.5 cursor-pointer bg-transparent border-0 p-0 hover:opacity-100 ${activePreviewTab === n.id ? 'opacity-100 font-bold border-b border-current' : 'opacity-70'}`}
                    style={{ color: isTransparentHome ? '#fff' : colors.charcoal }}>
                    {n.label}
                  </button>
                ))}
              </nav>

              {/* Contact Button */}
              <div className="flex items-center gap-2">
                <span className="text-[7px] font-medium opacity-70" style={{ color: isTransparentHome ? '#fff' : colors.charcoal }}>{contacts.phone || '(41) 3000-0000'}</span>
                <button type="button" onClick={() => setActivePreviewTab('contato')} className="px-3 py-1 rounded-full text-[7px] font-bold transition-all hover:scale-[1.02] cursor-pointer border-0"
                  style={{ backgroundColor: colors.gold, color: '#fff' }}>
                  Fale Conosco
                </button>
              </div>
            </>
          ) : (
            /* Menu hamburger button for Mobile */
            <button type="button" onClick={() => setPreviewNavOpen(!previewNavOpen)} className="p-1 cursor-pointer hover:opacity-80 bg-transparent border-0" style={{ color: isTransparentHome ? '#fff' : colors.charcoal }}>
              {previewNavOpen ? <X size={13} /> : <Menu size={13} />}
            </button>
          )}
        </div>

        {/* Mobile Dropdown Drawer */}
        {isMobileMode && previewNavOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg px-4 py-3 flex flex-col gap-2 z-40 max-h-[70vh] overflow-y-auto">
            {navItems.map(n => (
              <button
                key={n.id}
                type="button"
                onClick={() => {
                  setActivePreviewTab(n.id);
                  setPreviewNavOpen(false);
                }}
                className={`text-[8px] font-semibold text-left py-1 border-b border-slate-100 cursor-pointer bg-transparent border-0 w-full ${
                  activePreviewTab === n.id ? 'text-amber-500 font-bold' : 'text-slate-600'
                }`}
              >
                {n.label}
              </button>
            ))}
            <div className="flex flex-col gap-1.5 pt-1.5">
              <span className="text-[7px] text-slate-500 font-bold">Contato: {contacts.whatsapp || contacts.phone}</span>
              <button
                type="button"
                onClick={() => {
                  setActivePreviewTab('contato');
                  setPreviewNavOpen(false);
                }}
                className="w-full py-1.5 rounded-lg text-[7.5px] font-bold text-center border-0 cursor-pointer"
                style={{ backgroundColor: colors.gold, color: '#fff' }}
              >
                Fale Conosco
              </button>
            </div>
          </div>
        )}
      </header>
    )
  }

  // ─── HIGH CONTRAST GOLD HELPER ─────────────────────────────────────────────
  const getContrastGold = (darkBg = false) => {
    if (darkBg) {
      const g = colors.gold.toLowerCase().trim()
      if (g === '#18181b' || g === '#09090b' || g === '#111111' || g === '#000000' || g === '#000' || g === '#27272a' || g === '#1c1916') {
        return '#EDBF71' // Return beautiful luxury gold on dark backgrounds
      }
      return colors.gold
    }
    return colors.gold
  }

  // ─── PREVIEW FOOTER RENDERER ───────────────────────────────────────────────
  const renderFooter = () => {
    const fStyle = (settings.footerStyle as string) || 'simple'
    
    // Choose logo depending on background
    const isDarkFooter = fStyle !== 'column-grid';
    const logoSrc = isDarkFooter && settings.logoLight ? settings.logoLight : settings.logo;
    const shouldInvertLogo = isDarkFooter && !settings.logoLight && settings.logo;

    const logoEl = logoSrc ? (
      <img src={logoSrc} className={`h-5 w-auto max-w-[120px] object-contain transition-all ${shouldInvertLogo ? 'brightness-0 invert' : ''}`} />
    ) : (
      <span className="text-[10px] font-bold tracking-tight" style={{ fontFamily: fonts.display, color: isDarkFooter ? '#fff' : colors.charcoal }}>{settings.name}</span>
    )

    if (fStyle === 'minimal') {
      return (
        <footer className="px-4 py-3 flex items-center justify-between border-t text-[6px] shrink-0" style={{ backgroundColor: colors.charcoal, borderColor: colors.creamBorder, color: `${colors.cream}60` }}>
          <div>© 2026 {settings.name} • CRECI: {contacts.creci}</div>
          <div className="flex gap-2 text-[7px]">
            <span>📸 Instagram</span>
            <span>📱 WhatsApp</span>
          </div>
        </footer>
      )
    }

    if (fStyle === 'detailed') {
      return (
        <footer className="px-4 py-6 border-t space-y-4 text-left shrink-0" style={{ backgroundColor: colors.charcoal, borderColor: colors.creamBorder, color: `${colors.cream}80` }}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1">
                {logoEl}
              </div>
              <p className="text-[6px] opacity-75">{defaultTenant?.tagline || 'Curadoria exclusiva de imóveis assinados.'}</p>
              <div className="text-[6px] font-mono opacity-80">CRECI: {contacts.creci}</div>
            </div>
            <div className="space-y-1">
              <div className="text-[7px] font-bold uppercase tracking-wider" style={{ color: '#fff' }}>Contato</div>
              <div className="text-[6px]">{contacts.phone}</div>
              <div className="text-[6px]">{contacts.email}</div>
              <div className="text-[6px] opacity-75 leading-tight">{contacts.address.fullAddress}</div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-3 text-center text-[5px] opacity-50">
            © 2026 {settings.name}. Todos os direitos reservados. | Powered by ESI — Evolves Sistema Imobiliário
          </div>
        </footer>
      )
    }

    if (fStyle === 'modern-newsletter') {
      return (
        <footer className="px-4 py-6 border-t space-y-4 text-left shrink-0 bg-zinc-950 border-zinc-800 text-zinc-400">
          <div className="p-3 rounded-xl border border-zinc-800 space-y-2 bg-zinc-900/50">
            <div className="text-[8px] font-bold text-white uppercase tracking-wider">Newsletter de Lançamentos</div>
            <p className="text-[6px] text-zinc-400">Receba em primeira mão residências suspensas com design assinado.</p>
            <div className="flex gap-1.5">
              <input disabled placeholder="Seu e-mail..." className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 text-[6px] text-white focus:outline-none" />
              <button className="px-2 py-0.5 rounded text-[6px] font-bold border-0 cursor-pointer" style={{ backgroundColor: colors.gold, color: '#fff' }}>Inscrever</button>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="space-y-0.5">
              <div className="text-[7px] font-bold text-white">{settings.name}</div>
              <div className="text-[5.5px] text-zinc-500">CRECI: {contacts.creci}</div>
            </div>
            <div className="flex gap-2 text-[6px]">
              <span className="hover:text-white cursor-pointer">Instagram</span>
              <span className="hover:text-white cursor-pointer">WhatsApp</span>
            </div>
          </div>
          <div className="text-[5px] text-zinc-650 text-center border-t border-zinc-900/60 pt-3">
            © 2026 {settings.name} • Powered by ESI — Evolves Sistema Imobiliário
          </div>
        </footer>
      )
    }

    if (fStyle === 'column-grid') {
      return (
        <footer className="px-4 py-6 border-t space-y-4 text-left shrink-0" style={{ backgroundColor: colors.creamDark, borderColor: colors.creamBorder, color: colors.charcoalLight }}>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <div className="text-[7px] font-bold uppercase tracking-wider text-slate-900">Sobre Nós</div>
              <p className="text-[6px] leading-tight opacity-75">{settings.sobreText?.slice(0, 100) || 'Curadoria imobiliária premium.'}...</p>
            </div>
            <div className="space-y-1.5">
              <div className="text-[7px] font-bold uppercase tracking-wider text-slate-900">Serviços</div>
              <div className="text-[6px] flex flex-col gap-1">
                <span className="cursor-pointer hover:underline">Venda de Luxo</span>
                <span className="cursor-pointer hover:underline">Locação Premium</span>
                <span className="cursor-pointer hover:underline">Lançamentos de Grife</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="text-[7px] font-bold uppercase tracking-wider text-slate-900">Atendimento</div>
              <div className="text-[6px] opacity-75 leading-tight">{settings.openingHours || 'Segunda a Sexta das 9h às 18h · Sábados das 9h às 13h'}</div>
              <div className="text-[5.5px] font-bold mt-1 text-slate-500">CRECI: {contacts.creci}</div>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-3 text-center text-[5.5px] opacity-50 flex items-center justify-between">
            <span>© 2026 {settings.name}</span>
            <span>Microsistec e Evolves Tecnologia</span>
          </div>
        </footer>
      )
    }

    if (fStyle === 'brand-glow') {
      return (
        <footer className="px-4 py-8 border-t space-y-4 text-center shrink-0 bg-zinc-950 border-zinc-900 text-zinc-400 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-12 bg-amber-500/5 rounded-full filter blur-xl pointer-events-none" />
          <div className="flex flex-col items-center gap-2 relative z-10">
            {logoEl}
            <div className="text-[6px] uppercase tracking-widest text-amber-500/80 font-bold">{settings.heroTitle}</div>
          </div>
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto my-2" />
              <div className="flex justify-center gap-4 text-[7px] font-semibold text-zinc-300">
            <span>Home</span>
            <span>Comprar</span>
            <span>Lançamentos</span>
            <span>Sobre</span>
            <span>Contato</span>
          </div>
          <div className="border-t border-zinc-900/60 pt-3 flex items-center justify-between text-[5px] text-zinc-500">
            <span>© 2026 {settings.name}</span>
            <span>CRECI: {contacts.creci}</span>
            <span>Powered by ESI — Evolves Sistema Imobiliário</span>
          </div>
        </footer>
      )
    }

    // Default: 'simple' (Robles standard)
    return (
      <footer className="px-4 py-8 border-t space-y-6 text-left shrink-0" style={{ backgroundColor: colors.charcoal, borderColor: colors.creamBorder, color: `${colors.cream}80` }}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-1.5 col-span-2 sm:col-span-1">
            <div className="flex items-center gap-1">
              {logoEl}
            </div>
            <p className="text-[6px] opacity-75">{settings.sobreText?.slice(0, 100) || 'Curadoria exclusiva de imóveis assinados.'}</p>
            <div className="flex gap-2 pt-1 text-[7px]">
              <span>📸 Insta</span>
              <span>📱 Face</span>
            </div>
          </div>
          <div>
            <div className="text-[7px] font-bold uppercase tracking-wider mb-2" style={{ color: '#fff' }}>Imóveis</div>
            <div className="text-[6px] flex flex-col gap-1">
              <span>Comprar</span>
              <span>Alugar</span>
              <span>Lançamentos</span>
            </div>
          </div>
          <div>
            <div className="text-[7px] font-bold uppercase tracking-wider mb-2" style={{ color: '#fff' }}>Empresa</div>
            <div className="text-[6px] flex flex-col gap-1">
              <span>Sobre nós</span>
              <span>Contato</span>
              <span>Anuncie</span>
            </div>
          </div>
          <div>
            <div className="text-[7px] font-bold uppercase tracking-wider mb-2" style={{ color: '#fff' }}>Contato</div>
            <div className="text-[6px]">{contacts.phone}</div>
            <div className="text-[6px]">{contacts.email}</div>
            <div className="text-[6px] opacity-75 leading-tight">{contacts.address.fullAddress}</div>
            <div className="text-[5.5px] font-bold mt-1 text-slate-400">CRECI: {contacts.creci}</div>
          </div>
        </div>
        <div className="border-t border-white/5 pt-3 text-center text-[5px] opacity-50">
          © 2026 {settings.name}. Todos os direitos reservados. | Powered by ESI — Evolves Sistema Imobiliário
        </div>
      </footer>
    )
  }

  // ─── PREVIEW HERO RENDERER ─────────────────────────────────────────────────
  const renderPreviewHero = () => {
    const heroImg = settings.heroImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=85&fit=crop'
    const goldAccent = getContrastGold(true)

    // Helper to render the custom home search filters dynamically in the preview (Requirement 5)
    const renderPreviewHeroSearch = () => {
      const activeFilters = settings.homeFilters || ['finalidade', 'tipo', 'neighborhood']
      const showFinalidade = activeFilters.includes('finalidade')
      const showTipo = activeFilters.includes('tipo')
      const showCidade = activeFilters.includes('neighborhood')
      const showBedrooms = activeFilters.includes('bedrooms')
      const showPreco = activeFilters.includes('preco')

      return (
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-2.5 max-w-[280px] w-full mx-auto text-left border border-slate-200/50 mt-2 shadow-md">
          {showFinalidade && (
            <div className="flex mb-1.5 bg-slate-100 rounded-lg p-0.5">
              {['venda', 'aluguel', 'lancamento'].map((f) => (
                <span
                  key={f}
                  className="flex-1 py-1 text-[5.5px] font-bold rounded text-center cursor-default bg-white shadow-sm text-slate-800"
                >
                  {f === 'venda' ? 'Comprar' : f === 'aluguel' ? 'Alugar' : 'Lançamento'}
                </span>
              ))}
            </div>
          )}

          <div className="grid grid-cols-12 gap-1 items-end">
            {showTipo && (
              <div className="col-span-4">
                <label className="block text-[4.5px] font-bold text-slate-700 uppercase tracking-wider pl-0.5">Tipo</label>
                <div className="w-full bg-slate-50 border border-slate-200 rounded px-1 py-0.5 text-[5px] text-slate-450 truncate">Tipo de imóvel</div>
              </div>
            )}
            {showCidade && (
              <div className="col-span-4">
                <label className="block text-[4.5px] font-bold text-slate-700 uppercase tracking-wider pl-0.5">Cidade</label>
                <div className="w-full bg-slate-50 border border-slate-200 rounded px-1 py-0.5 text-[5px] text-slate-450 truncate">Localização</div>
              </div>
            )}
            {showBedrooms && (
              <div className="col-span-4">
                <label className="block text-[4.5px] font-bold text-slate-700 uppercase tracking-wider pl-0.5">Quartos</label>
                <div className="w-full bg-slate-50 border border-slate-200 rounded px-1 py-0.5 text-[5px] text-slate-450 truncate">Dormitórios</div>
              </div>
            )}
            {showPreco && (
              <div className="col-span-4">
                <label className="block text-[4.5px] font-bold text-slate-700 uppercase tracking-wider pl-0.5">Valor</label>
                <div className="w-full bg-slate-50 border border-slate-200 rounded px-1 py-0.5 text-[5px] text-slate-450 truncate">Preço</div>
              </div>
            )}
            <div className="col-span-4 ml-auto w-full">
              <button className="w-full text-[5.5px] font-bold py-1 rounded flex items-center justify-center shadow border-0 cursor-default" style={{ backgroundColor: goldAccent, color: '#fff' }}>Buscar</button>
            </div>
          </div>
        </div>
      )
    }

    if (settings.heroStyle === 'split-screen') {
      return (
        <div className="flex min-h-[260px]">
          <div className="flex-1 flex flex-col justify-center p-6 pr-4 relative z-10" style={{ backgroundColor: colors.charcoal }}>
            <div className="text-[8px] uppercase tracking-widest mb-2 font-medium" style={{ color: goldAccent }}>Alto Padrão · Curitiba</div>
            <h2 className="text-sm font-bold leading-tight mb-2" style={{ color: colors.cream, fontFamily: fonts.display }}>{settings.heroTitle}</h2>
            <p className="text-[8px] leading-relaxed opacity-75 mb-3" style={{ color: colors.cream }}>{settings.heroSubtitle}</p>
            {renderPreviewHeroSearch()}
          </div>
          <div className="flex-1 relative overflow-hidden">
            <img src={heroImg} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.2), transparent)' }} />
          </div>
        </div>
      )
    }

    if (settings.heroStyle === 'video-ambient') {
      return (
        <div className="relative min-h-[260px] flex items-center justify-center overflow-hidden flex-col gap-2">
          <img src={heroImg} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${colors.charcoal}e6 0%, ${colors.charcoal}99 50%, ${colors.charcoal}66 100%)` }} />
          {/* Animated glow orbs */}
          <div className="absolute top-4 right-8 w-32 h-32 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: goldAccent }} />
          <div className="absolute bottom-4 left-8 w-24 h-24 rounded-full opacity-15 blur-2xl" style={{ backgroundColor: goldAccent }} />
          
          <div className="relative z-10 text-center px-6 pt-12 pb-4">
            <div className="inline-flex items-center gap-1.5 mb-2 px-3 py-1 rounded-full text-[7px] font-bold uppercase tracking-widest" style={{ backgroundColor: `${goldAccent}30`, color: goldAccent, border: `1px solid ${goldAccent}40` }}>
              <Sparkles size={8} /> Curadoria Premium · Exclusivo
            </div>
            <h2 className="font-bold text-xl leading-tight mb-2" style={{ color: '#fff', fontFamily: fonts.display }}>{settings.heroTitle}</h2>
            <p className="text-[9px] leading-relaxed max-w-xs mx-auto mb-1" style={{ color: 'rgba(255,255,255,0.70)' }}>{settings.heroSubtitle}</p>
          </div>
          <div className="relative z-10 w-full max-w-[280px] pb-4">
            {renderPreviewHeroSearch()}
          </div>
        </div>
      )
    }

    if (settings.heroStyle === 'search-right') {
      return (
        <div className="relative min-h-[260px] overflow-hidden">
          <img src={heroImg} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(105deg, ${colors.charcoal}dd 0%, ${colors.charcoal}99 55%, ${colors.charcoal}22 100%)` }} />
          <div className="relative z-10 px-5 pt-16 pb-6 grid grid-cols-2 gap-4 items-center">
            <div>
              <div className="text-[7px] uppercase tracking-widest mb-2 font-medium" style={{ color: goldAccent }}>Curadoria Premium</div>
              <h2 className="font-bold text-base leading-tight mb-2" style={{ color: '#fff', fontFamily: fonts.display }}>{settings.heroTitle}</h2>
              <p className="text-[8px] leading-relaxed opacity-75" style={{ color: '#fff' }}>{settings.heroSubtitle}</p>
            </div>
            <div className="w-full shrink-0">
              {renderPreviewHeroSearch()}
            </div>
          </div>
        </div>
      )
    }

    if (settings.heroStyle === 'search-left') {
      return (
        <div className="relative min-h-[260px] overflow-hidden">
          <img src={heroImg} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(255deg, ${colors.charcoal}dd 0%, ${colors.charcoal}99 55%, ${colors.charcoal}22 100%)` }} />
          <div className="relative z-10 px-5 pt-16 pb-6 grid grid-cols-2 gap-4 items-center animate-fade-in">
            <div className="w-full shrink-0">
              {renderPreviewHeroSearch()}
            </div>
            <div className="text-right">
              <div className="text-[7px] uppercase tracking-widest mb-2 font-medium" style={{ color: goldAccent }}>Curadoria Premium</div>
              <h2 className="font-bold text-base leading-tight mb-2" style={{ color: '#fff', fontFamily: fonts.display }}>{settings.heroTitle}</h2>
              <p className="text-[8px] leading-relaxed opacity-75" style={{ color: '#fff' }}>{settings.heroSubtitle}</p>
            </div>
          </div>
        </div>
      )
    }
    // Default: 'minimalist' / 'search-centered'
    return (
      <div className="relative min-h-[260px] flex items-center justify-center text-center px-4 overflow-hidden animate-fade-in">
        <img src={heroImg} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 max-w-xs space-y-3">
          <div className="text-[7px] uppercase tracking-widest text-[#EDBF71] font-bold">Residências Exclusivas</div>
          <h2 className="text-base font-bold text-white leading-tight" style={{ fontFamily: fonts.display }}>{settings.heroTitle}</h2>
          <p className="text-[7.5px] text-white/80 leading-relaxed">{settings.heroSubtitle}</p>
          {settings.heroStyle === 'search-centered' && (
            <div className="flex gap-1.5 bg-white/10 p-1 rounded-lg border border-white/15 backdrop-blur-md max-w-[200px] mx-auto">
              <input disabled placeholder="Buscar bairro, tipo..." className="w-full text-[7.5px] bg-transparent p-0.5 px-1 border-0 outline-none text-white placeholder-white/50" />
              <button className="text-[7.5px] font-bold px-2 py-0.5 rounded cursor-pointer border-0" style={{ backgroundColor: goldAccent, color: '#fff' }}>Buscar</button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ─── DYNAMIC SUBPAGE BLOCKS RENDERER ──────────────────────────────────────
  const renderPageBlocks = (pageKey: 'sobre' | 'anunciar' | 'contato') => {
    const blocks = settings.pageBlocks[pageKey] || []
    return (
      <div className="space-y-4 pt-4">
        {blocks.map(blockId => {
          if (blockId === 'stats') {
            return (
              <div key="stats" className="py-4 px-3 rounded-xl" style={{ backgroundColor: colors.charcoal }}>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {(settings.sobreStats || '10 Anos · 500+ Clientes · 100% Foco').split(' · ').map(s => {
                    const parts = s.split(' ')
                    const value = parts.slice(0, -1).join(' ') || s
                    const label = parts.slice(-1)[0] || ''
                    return (
                      <div key={s}>
                        <div className="text-[10px] font-bold" style={{ color: getContrastGold(true), fontFamily: fonts.display }}>{value}</div>
                        <div className="text-[6px] uppercase tracking-wider mt-0.5 text-white/70">{label}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          }

          if (blockId === 'gallery') {
            return (
              <div key="gallery" className="space-y-2 text-left">
                <div className="text-[7px] uppercase tracking-widest font-bold animate-fade-in" style={{ color: colors.gold }}>Galeria de Inspiração</div>
                <div className="grid grid-cols-3 gap-1.5">
                  {['photo-1600585154340-be6161a56a0c', 'photo-1600596542815-ffad4c1539a9', 'photo-1545324418-cc1a3fa10c00'].map((p, idx) => (
                    <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-slate-100 shadow-sm bg-white animate-fade-in">
                      <img src={`https://images.unsplash.com/${p}?w=200&q=80`} className="w-full h-full object-cover hover:scale-105 transition-all duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )
          }

          if (blockId === 'team') {
            const members = settings.team.length > 0 ? settings.team : [
              { name: 'Rafaela Monteiro', role: 'Diretora Comercial', phone: '(11) 99847-3821', email: 'rafaela@robles.com.br', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80', instagram: '#' }
            ]
            const tStyle = settings.teamStyle || 'grid'

            if (tStyle === 'minimal') {
              return (
                <div key="team" className="space-y-2.5 text-left">
                  <div className="text-[7px] uppercase tracking-widest font-bold" style={{ color: colors.gold }}>Fale com Nossos Curadores</div>
                  <div className="flex gap-3 justify-center flex-wrap pt-1">
                    {members.map((m, idx) => (
                      <div key={idx} className="flex flex-col items-center space-y-1 animate-fade-in">
                        <div className="w-9 h-9 rounded-full overflow-hidden border border-amber-300 ring-2 ring-amber-100">
                          <img src={m.photo} className="w-full h-full object-cover" />
                        </div>
                        <div className="text-center">
                          <div className="text-[7px] font-bold" style={{ color: colors.charcoal }}>{m.name}</div>
                          <div className="text-[5.5px]" style={{ color: colors.warmGray }}>{m.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            }

            if (tStyle === 'cards') {
              return (
                <div key="team" className="space-y-2.5 text-left">
                  <div className="text-[7px] uppercase tracking-widest font-bold" style={{ color: colors.gold }}>Equipe Consultiva</div>
                  <div className="grid grid-cols-2 gap-2">
                    {members.map((m, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl border bg-white/45 backdrop-blur-sm border-white/20 shadow-sm flex items-center gap-2 animate-fade-in">
                        <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
                          <img src={m.photo} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[7.5px] font-bold truncate text-slate-800">{m.name}</div>
                          <div className="text-[6px] truncate text-slate-500">{m.role}</div>
                          <div className="text-[5px] font-bold text-amber-600 mt-0.5">{m.phone}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            }

            if (tStyle === 'list') {
              return (
                <div key="team" className="space-y-2 pt-1 text-left">
                  <div className="text-[7px] uppercase tracking-widest font-bold" style={{ color: colors.gold }}>Diretoria de Atendimento</div>
                  <div className="space-y-1.5">
                    {members.map((m, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-100 shadow-sm animate-fade-in">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full overflow-hidden">
                            <img src={m.photo} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="text-[7.5px] font-bold text-slate-800">{m.name}</div>
                            <div className="text-[6px] text-slate-500">{m.role}</div>
                          </div>
                        </div>
                        <span className="text-[5.5px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.gold, color: '#fff' }}>{m.phone}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            }

            // Default: 'grid'
            return (
              <div key="team" className="space-y-2.5 text-left">
                <div className="text-[7px] uppercase tracking-widest font-bold" style={{ color: colors.gold }}>Curadores Disponíveis</div>
                <div className="grid grid-cols-2 gap-2">
                  {members.map((m, idx) => (
                    <div key={idx} className="bg-white rounded-xl border p-2 text-center space-y-1.5 shadow-sm animate-fade-in" style={{ borderColor: colors.creamBorder }}>
                      <div className="w-10 h-10 rounded-full overflow-hidden mx-auto">
                        <img src={m.photo} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="text-[7.5px] font-bold" style={{ color: colors.charcoal }}>{m.name}</div>
                        <div className="text-[5.5px]" style={{ color: colors.warmGray }}>{m.role}</div>
                      </div>
                      <div className="text-[5.5px] text-slate-400 font-mono leading-none">{m.phone}</div>
                    </div>
                  ))}
                </div>
              </div>
            )
          }

          if (blockId === 'form') {
            return (
              <div key="form" className="p-3.5 rounded-xl border space-y-2 text-left bg-slate-50 animate-fade-in" style={{ borderColor: colors.creamBorder }}>
                <div className="text-[8px] font-bold uppercase tracking-wider text-slate-800">Solicitar Informações</div>
                <div className="space-y-1.5">
                  {Object.entries(settings.formFields).filter(([_, f]: any) => f.enabled).map(([id, f]: any) => (
                    <div key={id} className="space-y-0.5">
                      <label className="text-[5.5px] font-bold uppercase tracking-wider text-slate-500 block">
                        {f.label} {f.required && <span className="text-red-500">*</span>}
                      </label>
                      {id === 'message' ? (
                        <textarea disabled placeholder="Sua mensagem..." className="w-full bg-white border rounded px-1.5 py-1 text-[7px]" rows={2} style={{ borderColor: colors.creamBorder }} />
                      ) : (
                        <input disabled placeholder={f.label} className="w-full bg-white border rounded px-1.5 py-1 text-[7px]" style={{ borderColor: colors.creamBorder }} />
                      )}
                    </div>
                  ))}
                  <button className="w-full text-[7.5px] font-bold py-1.5 rounded-lg border-0 cursor-pointer text-center" style={{ backgroundColor: colors.gold, color: '#fff' }}>
                    Enviar Solicitação
                  </button>
                </div>
              </div>
            )
          }

          if (blockId === 'testimonials') {
            return (
              <div key="testimonials" className="p-3 bg-amber-50/40 rounded-xl border border-amber-200 text-center space-y-1 animate-fade-in">
                <p className="text-[7.5px] italic text-slate-700 leading-normal">"Encontramos nossa residência suspensa com facilidade. Excelente curadoria!"</p>
                <div className="text-[6px] font-bold text-amber-700">Beatriz Almeida · Batel</div>
              </div>
            )
          }

          if (blockId === 'cta') {
            return (
              <div key="cta" className="p-4 rounded-xl text-center animate-fade-in" style={{ backgroundColor: colors.gold, color: '#fff' }}>
                <div className="text-[9px] font-bold uppercase tracking-wider">Pronto para dar o próximo passo?</div>
                <p className="text-[6px] opacity-80 mt-1 max-w-[200px] mx-auto leading-normal">Agende uma reunião confidencial em nosso escritório no Batel.</p>
                <button className="mt-2 px-2.5 py-1 bg-white rounded-full text-[5.5px] font-bold text-slate-900 border-0 cursor-pointer">Fale Conosco</button>
              </div>
            )
          }

          return null
        })}
      </div>
    )
  }

  // ─── PREVIEW PAGE CONTENT ──────────────────────────────────────────────────
  const renderPreviewPage = () => {
    const cardTag = CARD_TAGS.find(t => t.id === settings.cardTag)

    if (activePreviewTab === 'home') {
      return (
        <div className="relative flex flex-col min-h-full">
          {renderNavbar()}
          {renderPreviewHero()}
          <div className="flex-1 p-4 space-y-5" style={{ backgroundColor: colors.cream }}>
            {settings.homeBlocks.map((blockId: string) => {
              if (blockId === 'stats') return (
                <div key="stats" className="py-4 px-3 rounded-xl animate-fade-in" style={{ backgroundColor: colors.charcoal }}>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {[{ v: 'R$ 2,4 bi', l: 'Negociados' }, { v: '1.200+', l: 'Imóveis' }, { v: '5', l: 'Cidades' }, { v: '23 anos', l: 'Experiência' }].map(s => (
                      <div key={s.l}>
                        <div className="text-xs font-bold" style={{ color: getContrastGold(true), fontFamily: fonts.display }}>{s.v}</div>
                        <div className="text-[6px] uppercase tracking-wider mt-0.5" style={{ color: `${colors.cream}80` }}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )

              if (blockId === 'featured') return (
                <div key="featured" className="space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold" style={{ fontFamily: fonts.display, color: colors.charcoal }}>Imóveis em Destaque</h3>
                    <span className="text-[7px] font-medium" style={{ color: colors.gold }}>Ver todos →</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[1, 2].map(i => renderVerticalCard({ ...mockProperty, image: `https://images.unsplash.com/photo-${i === 1 ? '1600585154340-be6161a56a0c' : '1600596542815-ffad4c1539a9'}?w=400&q=80` }, settings.cardVerticalStyle, cardTag))}
                  </div>
                </div>
              )

              if (blockId === 'categories') return (
                <div key="categories" className="space-y-2 animate-fade-in">
                  <h3 className="text-xs font-bold" style={{ fontFamily: fonts.display, color: colors.charcoal }}>O que você procura?</h3>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[{ label: 'Comprar', emoji: '🏠' }, { label: 'Alugar', emoji: '🔑' }, { label: 'Lançamentos', emoji: '🚀' }].map(c => (
                      <div key={c.label} className="text-center p-2 rounded-xl text-[8px] font-bold border" style={{ backgroundColor: colors.creamDark, borderColor: colors.creamBorder, color: colors.charcoal }}>
                        <div>{c.emoji}</div><div>{c.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )

              if (blockId === 'launches') return (
                <div key="launches" className="space-y-2 animate-fade-in">
                  <h3 className="text-xs font-bold" style={{ fontFamily: fonts.display, color: colors.charcoal }}>Novos Lançamentos</h3>
                  <div className="space-y-2">
                    {[1, 2].map(i => renderHorizontalCard({ ...mockProperty, image: `https://images.unsplash.com/photo-${i === 1 ? '1545324418-cc1a3fa10c00' : '1560448204-e02f11c3d0e2'}?w=400&q=80` }, settings.cardHorizontalStyle, cardTag))}
                  </div>
                </div>
              )

              if (blockId === 'cities') {
                const defaultPreviewCities = [
                  { name: 'Porto Feliz', state: 'SP', count: 84, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80' },
                  { name: 'Santana de Parnaíba', state: 'SP', count: 142, image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80' },
                  { name: 'São Paulo', state: 'SP', count: 542, image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80' },
                  { name: 'São Sebastião', state: 'SP', count: 78, image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80' },
                  { name: 'Ubatuba', state: 'SP', count: 63, image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&q=80' },
                ]
                const pCities = settings.citiesList && settings.citiesList.length > 0 ? settings.citiesList : defaultPreviewCities

                return (
                  <div key="cities" className="space-y-2 animate-fade-in text-left">
                    <h3 className="text-xs font-bold" style={{ fontFamily: fonts.display, color: colors.charcoal }}>Onde Atuamos</h3>
                    <div className="grid grid-cols-5 gap-1.5">
                      {pCities.map((c: any, idx: number) => (
                        <div key={idx} className="relative rounded-lg overflow-hidden aspect-[3/4] border" style={{ borderColor: colors.creamBorder }}>
                          <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                          <div className="absolute bottom-1 left-1 right-1 text-left">
                            <div className="text-white font-bold text-[6px] truncate leading-none">{c.name}</div>
                            <div className="text-white/60 text-[4.5px] mt-0.5 leading-none">{c.count} imóveis</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              }

              if (blockId === 'testimonials') return (
                <div key="testimonials" className="p-3 rounded-xl border animate-fade-in" style={{ backgroundColor: colors.creamDark, borderColor: colors.creamBorder }}>
                  <p className="text-[8px] italic mb-1.5" style={{ color: colors.charcoal }}>"Excelente atendimento, encontrei minha cobertura dos sonhos!"</p>
                  <span className="text-[7px] font-bold uppercase tracking-wider" style={{ color: getContrastGold() }}>Beatriz Almeida · Batel</span>
                </div>
              )

              if (blockId === 'cta') return (
                <div key="cta" className="p-3 rounded-xl animate-fade-in" style={{ backgroundColor: colors.creamDark, border: `1px solid ${colors.creamBorder}` }}>
                  <div className="text-[9px] font-bold mb-1" style={{ color: colors.charcoal, fontFamily: fonts.display }}>Quer vender seu imóvel?</div>
                  <p className="text-[7px] mb-2" style={{ color: colors.warmGray }}>Nossa equipe avalia gratuitamente.</p>
                  <button className="text-[7px] font-bold px-3 py-1 rounded-full border-0 cursor-pointer animate-pulse" style={{ backgroundColor: colors.gold, color: '#fff' }}>Anunciar meu imóvel</button>
                </div>
              )

              if (blockId === 'tags') return (
                <div key="tags" className="space-y-1.5 animate-fade-in">
                  <div className="text-[7px] font-bold uppercase tracking-wider" style={{ color: colors.warmGray }}>Explore</div>
                  <div className="flex flex-wrap gap-1">
                    {['Apt Luxo Batel', 'Cobertura Cabral', 'Casa Ecoville', 'Lançamentos', 'Studios'].map(t => (
                      <span key={t} className="text-[6px] px-2 py-0.5 rounded-full border font-medium" style={{ backgroundColor: '#fff', borderColor: colors.creamBorder, color: colors.charcoal }}>{t}</span>
                    ))}
                  </div>
                </div>
              )

              return null
            })}
          </div>
          {renderFooter()}
        </div>
      )
    }

    if (activePreviewTab === 'comprar' || activePreviewTab === 'alugar') {
      const label = activePreviewTab === 'comprar' ? 'Comprar' : 'Alugar'
      const showSidebar = !settings.searchFiltersLayout || settings.searchFiltersLayout === 'sidebar'
      const showTopbar = settings.searchFiltersLayout === 'topbar'

      return (
        <div className="flex flex-col min-h-full">
          {renderNavbar()}
          <div className="flex-1 px-4 py-3 animate-fade-in" style={{ backgroundColor: colors.cream }}>
            {showTopbar && (
              <div className="flex items-center gap-1.5 mb-3 p-1.5 rounded-xl border text-[6px]" style={{ backgroundColor: colors.creamDark, borderColor: colors.creamBorder, color: colors.warmGray }}>
                <span>🔍 Tipo: Todos · Cidade: Todas · Bairro: Todos</span>
                <span className="ml-auto text-[6px] font-bold px-2 py-0.5 rounded cursor-default" style={{ backgroundColor: colors.gold, color: '#fff' }}>Filtrado</span>
              </div>
            )}
            <div className="text-[7px] mb-2 font-medium" style={{ color: colors.warmGray }}>12 imóveis para <strong style={{ color: colors.charcoal }}>{label.toLowerCase()}</strong></div>
            
            <div className="flex gap-3">
              {/* Main content column */}
              <div className="flex-1">
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map(i => renderVerticalCard({ ...mockProperty, image: `https://images.unsplash.com/photo-${['1600585154340-be6161a56a0c', '1600596542815-ffad4c1539a9', '1545324418-cc1a3fa10c00', '1560448204-e02f11c3d0e2'][i - 1]}?w=400&q=80` }, settings.cardVerticalStyle, cardTag))}
                </div>
              </div>

              {/* Sidebar filters on the right */}
              {showSidebar && (
                <div className="w-24 shrink-0 bg-white rounded-xl border p-2 text-left self-start" style={{ borderColor: colors.creamBorder }}>
                  <div className="text-[6px] font-bold uppercase tracking-wider mb-2" style={{ color: colors.charcoal }}>Filtros Ativos</div>
                  <div className="space-y-1 text-[5px] text-slate-500">
                    <div className="bg-slate-50 p-1 rounded border">Finalidade: {label}</div>
                    <div className="bg-slate-50 p-1 rounded border">Tipo: Apartamento</div>
                    <div className="bg-slate-50 p-1 rounded border">Quartos: 3+</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {renderFooter()}
        </div>
      )
    }

    if (activePreviewTab === 'lancamentos') {
      return (
        <div className="flex flex-col min-h-full">
          {renderNavbar()}
          <div className="flex-1 px-4 py-3" style={{ backgroundColor: colors.cream }}>
            <div className="text-[7px] uppercase tracking-widest mb-0.5 font-bold" style={{ color: colors.gold }}>Exclusivos</div>
            <h3 className="text-sm font-bold mb-3" style={{ fontFamily: fonts.display, color: colors.charcoal }}>Novos Lançamentos</h3>
            <div className="space-y-2.5">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-2.5 rounded-xl border p-2 items-center animate-fade-in" style={{ borderColor: colors.creamBorder, backgroundColor: colors.creamDark }}>
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                    <img src={`https://images.unsplash.com/photo-${['1545324418-cc1a3fa10c00', '1560448204-e02f11c3d0e2', '1486406146926-c627a92ad1ab'][i - 1]}?w=200&q=80`} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[7px] uppercase tracking-widest font-bold" style={{ color: colors.gold }}>Lançamento • Batel</div>
                    <div className="text-[9px] font-bold truncate" style={{ fontFamily: fonts.display, color: colors.charcoal }}>Ícaro Jardins {i}</div>
                    <div className="text-[8px] font-bold mt-1" style={{ color: colors.gold }}>{formatPrice(5500000 + i * 800000)}</div>
                  </div>
                  <span className="text-[6px] px-1.5 py-0.5 rounded-full font-bold" style={{ backgroundColor: colors.gold, color: '#fff' }}>🚀 Lançamento</span>
                </div>
              ))}
            </div>
          </div>
          {renderFooter()}
        </div>
      )
    }

    if (activePreviewTab === 'anunciar') {
      const struct = settings.pageStructures.anunciar
      return (
        <div className="flex flex-col min-h-full">
          {renderNavbar()}
          <div className="flex-1" style={{ backgroundColor: colors.cream }}>
            {struct === 'magazine' ? (
              <div>
                <div className="relative h-24 overflow-hidden">
                  <img src={settings.heroImage} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: `${colors.charcoal}cc` }}>
                    <h3 className="text-sm font-bold text-white" style={{ fontFamily: fonts.display }}>{settings.anunciarTitle}</h3>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <p className="text-[8px]" style={{ color: colors.warmGray }}>{settings.anunciarSubtitle}</p>
                  <div className="p-3 rounded-xl border space-y-2 animate-fade-in" style={{ borderColor: colors.creamBorder, backgroundColor: colors.creamDark }}>
                    {['Nome', 'Telefone', 'Endereço do imóvel'].map(f => <div key={f} className="bg-white rounded-lg px-2 py-1.5 text-[7px] border animate-fade-in" style={{ borderColor: colors.creamBorder, color: colors.warmGray }}>{f}</div>)}
                    <button className="w-full text-[7px] font-bold py-1.5 rounded-lg border-0 cursor-pointer animate-pulse" style={{ backgroundColor: colors.gold, color: '#fff' }}>Anunciar agora</button>
                  </div>
                </div>
              </div>
            ) : struct === 'centered' ? (
              <div className="p-4 text-center space-y-3">
                <h3 className="text-sm font-bold" style={{ fontFamily: fonts.display, color: colors.charcoal }}>{settings.anunciarTitle}</h3>
                <p className="text-[8px]" style={{ color: colors.warmGray }}>{settings.anunciarSubtitle}</p>
                <div className="max-w-xs mx-auto p-3 rounded-xl border space-y-1.5 animate-fade-in" style={{ borderColor: colors.creamBorder, backgroundColor: colors.creamDark }}>
                  {['Nome', 'Telefone', 'Endereço'].map(f => <div key={f} className="bg-white rounded-lg px-2 py-1.5 text-[7px] border animate-fade-in" style={{ borderColor: colors.creamBorder, color: colors.warmGray }}>{f}</div>)}
                  <button className="w-full text-[7px] font-bold py-1.5 rounded-lg border-0 cursor-pointer" style={{ backgroundColor: colors.gold, color: '#fff' }}>Anunciar</button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-0">
                <div className="p-4 space-y-2">
                  <div className="text-[7px] uppercase tracking-widest font-bold" style={{ color: colors.gold }}>Anuncie</div>
                  <h3 className="text-xs font-bold" style={{ fontFamily: fonts.display, color: colors.charcoal }}>{settings.anunciarTitle}</h3>
                  <p className="text-[7px] leading-relaxed" style={{ color: colors.warmGray }}>{settings.anunciarSubtitle}</p>
                  <div className="text-[7px] font-bold flex items-center gap-1" style={{ color: colors.gold }}>Saiba mais <ArrowRight size={8} /></div>
                </div>
                <div className="p-3 border-l space-y-1.5 animate-fade-in" style={{ borderColor: colors.creamBorder, backgroundColor: colors.creamDark }}>
                  {['Nome', 'Telefone', 'Endereço'].map(f => <div key={f} className="bg-white rounded-lg px-2 py-1.5 text-[7px] border animate-fade-in" style={{ borderColor: colors.creamBorder, color: colors.warmGray }}>{f}</div>)}
                  <button className="w-full text-[7px] font-bold py-1.5 rounded-lg border-0 cursor-pointer" style={{ backgroundColor: colors.gold, color: '#fff' }}>Enviar</button>
                </div>
              </div>
            )}
            
            {/* Dynamic visual blocks extra rendering */}
            <div className="px-4 pb-4">
              {renderPageBlocks('anunciar')}
            </div>
          </div>
          {renderFooter()}
        </div>
      )
    }

    if (activePreviewTab === 'blog') {
      return (
        <div className="flex flex-col min-h-full">
          {renderNavbar()}
          <div className="flex-1 p-4 space-y-2" style={{ backgroundColor: colors.cream }}>
            <h3 className="text-xs font-bold mb-3" style={{ fontFamily: fonts.display, color: colors.charcoal }}>Blog & Conteúdo</h3>
            {['Como avaliar o preço justo de um imóvel', 'Melhores bairros para morar em Curitiba 2026', 'Lançamentos: o que analisar antes de comprar'].map((title, i) => (
              <div key={i} className="flex gap-2 p-2 rounded-xl border animate-fade-in" style={{ borderColor: colors.creamBorder, backgroundColor: colors.creamDark }}>
                <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
                  <img src={`https://images.unsplash.com/photo-${['1486406146926-c627a92ad1ab', '1600596542815-ffad4c1539a9', '1545324418-cc1a3fa10c00'][i]}?w=200&q=80`} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-[6px] uppercase tracking-widest font-bold mb-0.5" style={{ color: colors.gold }}>Mercado Imobiliário</div>
                  <div className="text-[8px] font-bold leading-tight" style={{ color: colors.charcoal, fontFamily: fonts.display }}>{title}</div>
                  <div className="text-[6px] mt-1" style={{ color: colors.warmGray }}>5 min de leitura</div>
                </div>
              </div>
            ))}
          </div>
          {renderFooter()}
        </div>
      )
    }

    if (activePreviewTab === 'sobre') {
      return (
        <div className="flex flex-col min-h-full animate-fade-in">
          {renderNavbar()}
          <div className="flex-1 p-4 space-y-4 font-sans" style={{ backgroundColor: colors.cream }}>
            {settings.pageStructures.sobre === 'centered' ? (
              <div className="text-center space-y-3 animate-fade-in">
                <div className="h-20 rounded-xl overflow-hidden"><img src={settings.sobreImage} className="w-full h-full object-cover" /></div>
                <h3 className="text-sm font-bold" style={{ fontFamily: fonts.display, color: colors.charcoal }}>{settings.sobreTitle}</h3>
                <p className="text-[8px] leading-relaxed text-slate-650" style={{ color: colors.warmGray }}>{settings.sobreText}</p>
              </div>
            ) : settings.pageStructures.sobre === 'magazine' ? (
              <div className="animate-fade-in">
                <div className="relative h-28 rounded-xl overflow-hidden mb-3">
                  <img src={settings.sobreImage} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-end p-3" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }}>
                    <h3 className="text-sm font-bold text-white" style={{ fontFamily: fonts.display }}>{settings.sobreTitle}</h3>
                  </div>
                </div>
                <p className="text-[8px] leading-relaxed text-slate-650" style={{ color: colors.warmGray }}>{settings.sobreText}</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 text-left animate-fade-in">
                <div className="space-y-2">
                  <h3 className="text-xs font-bold" style={{ fontFamily: fonts.display, color: colors.charcoal }}>{settings.sobreTitle}</h3>
                  <p className="text-[7px] leading-relaxed text-slate-650">{settings.sobreText}</p>
                  <div className="flex flex-wrap gap-1">
                    {(settings.sobreStats || '').split(' · ').map((s: string, i: number) => (
                      <span key={i} className="text-[6px] px-1.5 py-0.5 rounded border font-medium" style={{ borderColor: colors.creamBorder, color: colors.warmGray, backgroundColor: colors.creamDark }}>{s}</span>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl overflow-hidden h-32"><img src={settings.sobreImage} className="w-full h-full object-cover" /></div>
              </div>
            )}
            
            {/* Dynamic visual blocks extra rendering */}
            {renderPageBlocks('sobre')}
          </div>
          {renderFooter()}
        </div>
      )
    }

    if (activePreviewTab === 'contato') {
      const activeFields = Object.entries(settings.formFields).filter(([_, f]: any) => f.enabled)
      const pageStructure = settings.pageStructures?.contato || 'editorial'
      const blocks = settings.pageBlocks?.contato || ['hero', 'form', 'text']
      const blocksLayout = settings.pageBlocksLayout?.contato || 'stack'
      const title = settings.contatoTitle || 'Fale Conosco'
      const subtitle = settings.contatoSubtitle || 'Nossa equipe especializada está pronta para ajudar você.'
      const address = settings.contatoAddress || 'Av. Batel, 1550 - Batel, Curitiba/PR'

      const renderHeroSection = () => {
        if (pageStructure === 'magazine') {
          return (
            <div className="relative h-20 flex items-center justify-center overflow-hidden rounded-xl border border-slate-200/50 mb-2">
              <img src={settings.heroImage || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80"} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
              <div className="relative z-10 text-center px-4">
                <h3 className="text-[10px] font-bold text-white font-display">{title}</h3>
                <p className="text-[6px] text-white/80 max-w-[180px] mx-auto truncate">{subtitle}</p>
              </div>
            </div>
          )
        }

        return (
          <div className="text-center py-2">
            <div className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full text-[5.5px] font-bold uppercase tracking-wider mb-1">
              <span>🕒 Fale Conosco</span>
            </div>
            <h3 className="text-sm font-bold text-slate-800" style={{ fontFamily: fonts.display, color: colors.charcoal }}>{title}</h3>
            <p className="text-[7px] max-w-[200px] mx-auto mt-0.5" style={{ color: colors.warmGray }}>{subtitle}</p>
          </div>
        )
      }

      const renderQuickContacts = () => (
        <div className="grid grid-cols-3 gap-1.5 text-center">
          {[
            { label: 'Telefone', val: contacts.phone },
            { label: 'WhatsApp', val: contacts.whatsapp },
            { label: 'E-mail', val: contacts.email },
          ].map(c => (
            <div key={c.label} className="bg-white rounded-lg border p-1.5 shadow-sm" style={{ borderColor: colors.creamBorder }}>
              <div className="text-[5.5px] font-bold uppercase tracking-wider" style={{ color: colors.gold }}>{c.label}</div>
              <div className="text-[6px] font-semibold text-slate-700 truncate mt-0.5">{c.val}</div>
            </div>
          ))}
        </div>
      )

      const renderMainContactPart = () => {
        if (pageStructure === 'centered') {
          return (
            <div className="space-y-2.5">
              <div className="bg-white rounded-xl border p-3 shadow-sm text-left" style={{ borderColor: colors.creamBorder }}>
                <div className="text-[7.5px] font-bold mb-1.5 text-center">Envie sua Mensagem</div>
                <div className="space-y-1.5">
                  {activeFields.map(([id, f]: any) => (
                    <div key={id} className="space-y-0.5">
                      <label className="text-[5.5px] font-bold uppercase tracking-wider text-slate-500 block">{f.label}</label>
                      <input disabled placeholder={f.label} className="w-full bg-slate-50 border rounded px-1.5 py-0.5 text-[6px]" style={{ borderColor: colors.creamBorder }} />
                    </div>
                  ))}
                  <button className="w-full text-[6px] font-bold py-1.5 rounded-lg border-0 cursor-pointer text-center" style={{ backgroundColor: colors.gold, color: '#fff' }}>Enviar Mensagem</button>
                </div>
              </div>
              <div className="bg-white rounded-xl border p-2.5 shadow-sm text-left text-[6.5px]" style={{ borderColor: colors.creamBorder }}>
                <div className="font-bold text-slate-700 uppercase">Endereço Principal</div>
                <p className="text-slate-500 leading-relaxed mt-0.5">{address}</p>
              </div>
            </div>
          )
        }

        // Editorial layout (two columns)
        return (
          <div className="grid grid-cols-5 gap-2.5 text-left">
            <div className="col-span-3 bg-white rounded-xl border p-3 shadow-sm" style={{ borderColor: colors.creamBorder }}>
              <div className="text-[7px] font-bold mb-1.5">Envie sua Mensagem</div>
              <div className="space-y-1">
                {activeFields.map(([id, f]: any) => (
                  <div key={id} className="space-y-0.5">
                    <label className="text-[5px] font-bold uppercase tracking-wider text-slate-500 block">{f.label}</label>
                    <input disabled placeholder={f.label} className="w-full bg-slate-50 border rounded px-1.5 py-0.5 text-[5.5px]" style={{ borderColor: colors.creamBorder }} />
                  </div>
                ))}
                <button className="w-full text-[6px] font-bold py-1.5 rounded-lg border-0 cursor-pointer text-center" style={{ backgroundColor: colors.gold, color: '#fff' }}>Enviar Mensagem</button>
              </div>
            </div>
            <div className="col-span-2 space-y-2">
              <div className="bg-white rounded-xl border p-2.5 shadow-sm text-[6px]" style={{ borderColor: colors.creamBorder }}>
                <div className="font-bold text-slate-700 uppercase">Endereço</div>
                <p className="text-slate-500 leading-normal mt-0.5">{address}</p>
                <div className="mt-1.5 space-y-0.5 text-slate-450">
                  <div>📞 {contacts.phone}</div>
                  <div className="truncate">✉️ {contacts.email}</div>
                </div>
              </div>
            </div>
          </div>
        )
      }

      const renderStats = () => {
        const statsList = settings.sobreStats
          ? settings.sobreStats.split(/\s*\.\s*/).map((s: string) => {
              const commaIndex = s.indexOf(',')
              if (commaIndex === -1) return { value: s.trim(), label: '' }
              return {
                value: s.substring(0, commaIndex).trim(),
                label: s.substring(commaIndex + 1).trim()
              }
            })
          : [
              { value: '50k', label: 'de vendas' },
              { value: '+500', label: 'clientes atendidos' },
              { value: '+600', label: 'imóveis visitados' },
            ]

        return (
          <div key="stats" className="py-3 px-2 rounded-xl" style={{ backgroundColor: colors.charcoal }}>
            <div className="grid grid-cols-3 gap-1 text-center">
              {statsList.map((s: any, idx: number) => (
                <div key={idx}>
                  <div className="text-[10px] font-bold" style={{ color: getContrastGold(true), fontFamily: fonts.display }}>{s.value}</div>
                  <div className="text-[5.5px] uppercase tracking-wider text-white/50">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )
      }

      const renderPreviewBlock = (blockId: string) => {
        switch (blockId) {
          case 'hero':
            return <div key="hero">{renderHeroSection()}</div>
          case 'form':
            return (
              <div key="form" className="space-y-2.5">
                {renderQuickContacts()}
                {renderMainContactPart()}
              </div>
            )
          case 'stats':
            return renderStats()
          case 'team':
            return renderPageBlocks('contato') // Renders team block dynamically based on active settings
          case 'text':
            return (
              <div key="text" className="grid grid-cols-2 gap-2 text-left text-[6.5px]">
                <div className="space-y-1.5">
                  <div className="font-bold text-slate-800 uppercase">Escritórios</div>
                  <div className="bg-white border rounded-lg p-1.5 leading-tight" style={{ borderColor: colors.creamBorder }}>
                    <div className="font-bold">{settings.name} — Sede</div>
                    <div className="text-slate-500">{address}</div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="font-bold text-slate-800 uppercase">FAQs</div>
                  <div className="bg-white border rounded-lg p-1.5 leading-tight" style={{ borderColor: colors.creamBorder }}>
                    <div className="font-semibold text-slate-700">Como funciona a curadoria?</div>
                    <div className="text-slate-500 mt-0.5">Nossa equipe acompanha cada etapa do processo...</div>
                  </div>
                </div>
              </div>
            )
          default:
            return null
        }
      }

      const renderAllContatoBlocks = () => {
        if (blocksLayout === 'grid') {
          return (
            <div className="grid grid-cols-2 gap-3 items-start animate-fade-in">
              {blocks.map((blockId: string) => renderPreviewBlock(blockId))}
            </div>
          )
        }
        return (
          <div className="space-y-3 animate-fade-in">
            {blocks.map((blockId: string) => renderPreviewBlock(blockId))}
          </div>
        )
      }

      return (
        <div className="flex flex-col min-h-full animate-fade-in">
          {renderNavbar()}
          <div className="flex-1 p-4 space-y-3" style={{ backgroundColor: colors.cream }}>
            {renderAllContatoBlocks()}
          </div>
          {renderFooter()}
        </div>
      )
    }

    return null
  }

  // ─── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-200 selection:text-blue-900">
      <title>ESI Sites — Construtor Dinâmico V8</title>

      {/* Font imports */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&family=Inter:wght@300;400;500;600&family=Lora:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@300;400;500;600&family=Outfit:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Syne:wght@400;600;700&display=swap" rel="stylesheet" />

      {/* Decorative */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full filter blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full filter blur-[150px] pointer-events-none" />

      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[hsl(221_68%_40%)] to-[hsl(221_68%_30%)] flex items-center justify-center font-bold text-white text-lg">ESI</div>
          <div>
            <h1 className="font-semibold text-sm tracking-tight text-slate-900 flex items-center gap-2">
              ESI Sites
              <span className="bg-blue-500/10 text-blue-700 text-[9px] px-2 py-0.5 rounded font-mono border border-blue-500/20 uppercase tracking-widest">Active</span>
            </h1>
            <p className="text-[9px] text-slate-500 font-mono">EDITOR VISUAL DE SITES IMOBILIÁRIOS</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={() => navigate('/')} className="px-3.5 py-1.5 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer mr-2 shadow-sm">
            <ArrowLeft size={12} /> Voltar ao CRM
          </button>
          <button onClick={handleReset} className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer">
            <RotateCcw size={12} /> Resetar
          </button>
          <button onClick={() => handleSave(false)} className="px-3.5 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer">
            <Save size={12} /> Salvar
          </button>
          <button onClick={() => handleSave(true)} className="px-4 py-2 bg-[hsl(221_68%_40%)] hover:bg-[hsl(221_68%_35%)] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-900/20 transition-colors cursor-pointer">
            <Eye size={12} /> Ver no Site
          </button>
        </div>
      </header>

      {/* ── SPLIT LAYOUT ────────────────────────────────────────────────────── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 w-full">

        {/* ── LEFT COLUMN: Controls ─────────────────────────────────────────── */}
        <section className="lg:col-span-6 p-5 space-y-4 border-r border-slate-200 bg-slate-50/50 overflow-y-auto">

          {/* 📂 CADASTRO & STATUS GERAL */}
          <SectionAccordion
            icon={<Layers size={16} />}
            title="🏢 Cadastro & Status Geral"
            isOpen={openSectionId === 'cadastro'}
            onToggle={() => toggleSection('cadastro')}
            isDisabled={isFirstTime && SECTIONS_ORDER.indexOf('cadastro') > maxUnlockedStepIndex}
          >
            <p className="text-[10px] text-slate-500 leading-normal -mt-1">Gerencie as informações fundamentais e o status de publicação do seu site.</p>
            <div className="space-y-4 pt-2">
              <InputField 
                label="Nome da Imobiliária" 
                value={settings.name} 
                onChange={v => {
                  setSettings(prev => {
                    const next = { ...prev, name: v }
                    if (activeTenantId.startsWith('custom_')) {
                      next.slug = slugify(v)
                      next.heroTitle = v
                    }
                    return next
                  })
                }} 
                placeholder="Ex: Robles Imobiliária" 
              />

              <InputField 
                label="Slug de Link (Link de Acesso)" 
                value={settings.slug} 
                onChange={v => setSettings(prev => ({ ...prev, slug: slugify(v) }))} 
                placeholder="ex: robles" 
              />

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Status de Publicação</label>
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 gap-1">
                  {[
                    { id: 'online', label: '🟢 No Ar (Online)', color: 'text-emerald-700 bg-emerald-50 border-emerald-250 ring-1 ring-emerald-250' },
                    { id: 'offline', label: '🔴 Fora do Ar (Offline)', color: 'text-rose-700 bg-rose-50 border-rose-250 ring-1 ring-rose-250' }
                  ].map(opt => {
                    const isActive = settings.status === opt.id
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSettings(prev => ({ ...prev, status: opt.id as any }))}
                        className={`flex-grow py-2 px-3 rounded-lg text-[9px] font-bold text-center transition-all cursor-pointer border-0 ${
                          isActive ? opt.color + ' shadow-sm' : 'text-slate-500 hover:text-slate-800 bg-transparent'
                        }`}
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
            {renderWizardNextButton('cadastro')}
          </SectionAccordion>

          {/* 0 · BASE PRESETS */}
          <SectionAccordion
            icon={<Grid size={16} />}
            title="Bases Prontas (Estilos Completos)"
            isOpen={openSectionId === 'presets'}
            onToggle={() => toggleSection('presets')}
            isDisabled={isFirstTime && SECTIONS_ORDER.indexOf('presets') > maxUnlockedStepIndex}
          >
            <p className="text-[10px] text-slate-500 leading-normal -mt-1">Selecione um estilo visual completo. Cores, fontes, cabeçalhos e layouts são reconfigurados automaticamente.</p>
            <div className="grid grid-cols-3 gap-2.5">
              {STYLE_PRESETS.map(preset => {
                const isSelected = colors.cream === preset.colors.cream && colors.gold === preset.colors.gold && fonts.sans === preset.fonts.sans && fonts.display === preset.fonts.display;
                return (
                  <button key={preset.id} onClick={() => { setColors(preset.colors); setFonts(preset.fonts); setSettings(prev => ({ ...prev, ...preset.settings } as any)) }}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 group cursor-pointer ${
                      isSelected 
                        ? 'border-amber-400 bg-amber-50/50 ring-2 ring-amber-400 shadow-md scale-[1.02]' 
                        : 'bg-slate-50 border-slate-200 hover:border-amber-400 hover:bg-amber-50/40'
                    }`}>
                    <div className="flex gap-1">
                      <span className="w-4 h-4 rounded-full border border-slate-200" style={{ backgroundColor: preset.colors.cream }} />
                      <span className="w-4 h-4 rounded-full border border-slate-200" style={{ backgroundColor: preset.colors.charcoal }} />
                      <span className="w-4 h-4 rounded-full border border-slate-200" style={{ backgroundColor: preset.colors.gold }} />
                    </div>
                    <span className={`text-[9px] font-bold ${isSelected ? 'text-amber-700' : 'text-slate-700'} group-hover:text-amber-600 transition-colors uppercase tracking-wider`}>{preset.name}</span>
                    <span className="text-[7px] text-slate-400 leading-tight text-center">{preset.desc.substring(0, 40)}</span>
                    <span className={`text-[8px] px-2 py-0.5 rounded font-bold tracking-widest uppercase ${isSelected ? 'bg-amber-500 text-slate-950' : 'bg-amber-500/10 text-amber-600 hover:bg-amber-500 hover:text-slate-950'}`}>
                      {isSelected ? '✓ Ativo' : 'Aplicar'}
                    </span>
                  </button>
                )
              })}
            </div>
            {renderWizardNextButton('presets')}
          </SectionAccordion>

          {/* 1 · CORES */}
          <SectionAccordion
            icon={<Palette size={16} />}
            title="Identidade Visual & Cores"
            isOpen={openSectionId === 'colors'}
            onToggle={() => toggleSection('colors')}
            isDisabled={isFirstTime && SECTIONS_ORDER.indexOf('colors') > maxUnlockedStepIndex}
          >
            <div className="space-y-3">
              <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">Paletas Temáticas</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {COLOR_PRESETS.map(p => (
                  <button key={p.name} onClick={() => setColors(p.colors)} className="p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-amber-400 text-left transition-all hover:bg-amber-50/30 flex gap-3 items-center group cursor-pointer">
                    <div className="flex gap-0.5 shrink-0">
                      <span className="w-5 h-10 rounded-l-lg border border-slate-200" style={{ backgroundColor: p.colors.cream }} />
                      <span className="w-5 h-10 border-y border-slate-200" style={{ backgroundColor: p.colors.charcoal }} />
                      <span className="w-5 h-10 rounded-r-lg border border-slate-200" style={{ backgroundColor: p.colors.gold }} />
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold text-slate-700 group-hover:text-amber-600 transition-colors leading-tight">{p.name}</div>
                      <div className="text-[8px] text-slate-400 mt-0.5 leading-tight">{p.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-3">Ajuste Fino de Cores (Explicação Detalhada)</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Fundo Base (Cream)', desc: 'Fundo principal claro do portal', key: 'cream' as const },
                  { label: 'Fundo Escuro (Charcoal)', desc: 'Seções escuras e textos principais', key: 'charcoal' as const },
                  { label: 'Destaque Luxo (Gold)', desc: 'Botões principais (CTA) e destaques', key: 'gold' as const },
                  { label: 'Fundo Auxiliar (Cream Dark)', desc: 'Cards de imóveis e blocos alternativos', key: 'creamDark' as const },
                  { label: 'Borda Suave (Cream Border)', desc: 'Divisões e contornos de inputs', key: 'creamBorder' as const },
                  { label: 'Texto Secundário (Warm Gray)', desc: 'Legendas, descrições e subtextos', key: 'warmGray' as const },
                  { label: 'Texto em Fundo Escuro (Charcoal Light)', desc: 'Textos secundários em áreas escuras', key: 'charcoalLight' as const },
                  { label: 'Destaque Hover (Gold Light)', desc: 'Efeito de passar o mouse em CTAs', key: 'goldLight' as const },
                ].map(({ label, desc, key }) => (
                  <div key={key} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1">
                    <div className="text-[8px] font-bold text-slate-700 uppercase tracking-wider">{label}</div>
                    <p className="text-[6.5px] text-slate-400 leading-tight mb-1.5">{desc}</p>
                    <div className="flex gap-1.5 items-center">
                      <input type="color" value={colors[key]} onChange={e => setColors({ ...colors, [key]: e.target.value })} className="w-6 h-6 border-0 rounded cursor-pointer bg-transparent" />
                      <span className="text-[8px] font-mono text-slate-500 uppercase font-semibold">{colors[key]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {renderWizardNextButton('colors')}
          </SectionAccordion>

          {/* 1.5 · UPLOADS */}
          <SectionAccordion
            icon={<Upload size={16} />}
            title="Uploads de Marca & Hero"
            isOpen={openSectionId === 'uploads'}
            onToggle={() => toggleSection('uploads')}
            isDisabled={isFirstTime && SECTIONS_ORDER.indexOf('uploads') > maxUnlockedStepIndex}
          >
            <p className="text-[10px] text-slate-500 -mt-1 leading-normal">Arquivos processados localmente. As imagens aparecem imediatamente no preview ao lado.</p>
            <div className="grid grid-cols-2 gap-3">
              {([
                { key: 'logo', label: 'Logo Principal (Fundo Claro)', desc: 'Substitui o logotipo textual no header' },
                { key: 'logoLight', label: 'Logo para Fundo Escuro', desc: 'Substitui o logotipo quando sobreposto ao banner' },
                { key: 'marcaDagua', label: "Marca d'Água", desc: 'Ícone circular e elemento de selo' },
                { key: 'favicon', label: 'Favicon da Aba', desc: 'Ícone da aba do navegador' },
                { key: 'heroImage', label: 'Fundo do Hero', desc: 'Imagem de plano de fundo do hero' },
              ] as const).map(item => (
                <div key={item.key} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-2">
                  <div>
                    <div className="text-[9px] font-bold uppercase tracking-wider text-slate-700">{item.label}</div>
                    <p className="text-[7px] text-slate-400 mt-0.5 leading-tight">{item.desc}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-sm ${item.key === 'marcaDagua' ? 'rounded-full' : ''}`}>
                      {settings[item.key] ? <img src={settings[item.key]} className="w-full h-full object-cover" alt={item.label} /> : <ImageIcon size={14} className="text-slate-300" />}
                    </div>
                    <label className="flex-1 px-2 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-[9px] text-center text-slate-600 font-semibold rounded-lg cursor-pointer transition-colors">
                      Escolher
                      <input type="file" accept="image/*" onChange={e => handleFileUpload(e, item.key as any)} className="hidden" />
                    </label>
                  </div>
                </div>
              ))}
            </div>
            {renderWizardNextButton('uploads')}
          </SectionAccordion>

          {/* 2 · TIPOGRAFIA */}
          <SectionAccordion
            icon={<Type size={16} />}
            title="Tipografia & Fontes"
            isOpen={openSectionId === 'fonts'}
            onToggle={() => toggleSection('fonts')}
            isDisabled={isFirstTime && SECTIONS_ORDER.indexOf('fonts') > maxUnlockedStepIndex}
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Fonte Primária (Texto)</label>
                <select value={fonts.sans} onChange={e => setFonts({ ...fonts, sans: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-700 shadow-sm">
                  {FONTS_LIST.map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Fonte Secundária (Títulos)</label>
                <select value={fonts.display} onChange={e => setFonts({ ...fonts, display: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-700 shadow-sm">
                  {FONTS_LIST.map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
                </select>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-3">
              <div className="flex bg-slate-50 border border-slate-200 p-1 rounded-full w-full justify-between">
                {(['sans', 'display'] as const).map(tab => (
                  <button key={tab} type="button" onClick={() => setActiveFontTab(tab)} className={`flex-1 py-1.5 px-3 rounded-full text-[9px] font-bold text-center transition-all cursor-pointer ${activeFontTab === tab ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
                    {tab === 'sans' ? `✍️ Primária (${fonts.sans})` : `👑 Secundária (${fonts.display})`}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                {FONTS_LIST.map(f => {
                  const isSelected = activeFontTab === 'sans' ? fonts.sans === f.name : fonts.display === f.name
                  return (
                    <div key={f.name} onClick={() => setFonts(prev => ({ ...prev, [activeFontTab]: f.name }))}
                      className={`p-3 bg-slate-50 border rounded-xl cursor-pointer transition-all flex flex-col justify-between h-24 ${isSelected ? 'border-amber-400 bg-amber-50/30 ring-1 ring-amber-400' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-100/50'}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[9px] text-slate-700 font-bold">{f.name}</span>
                          <span className="text-[7px] text-slate-400 font-semibold uppercase tracking-wider block">{f.category}</span>
                        </div>
                        {isSelected && <span className="text-[7px] bg-amber-500/10 text-amber-700 font-bold px-1.5 py-0.5 rounded">Ativo</span>}
                      </div>
                      <span style={{ fontFamily: f.name }} className="text-sm font-bold text-slate-800 tracking-tight truncate block">{defaultTenant?.name || 'Lumina'}</span>
                    </div>
                  )
                })}
              </div>
            </div>
            {renderWizardNextButton('fonts')}
          </SectionAccordion>

          {/* 3 · CARDS */}
          <SectionAccordion
            icon={<Grid size={16} />}
            title="Design dos Cards & Tags"
            isOpen={openSectionId === 'cards'}
            onToggle={() => toggleSection('cards')}
            isDisabled={isFirstTime && SECTIONS_ORDER.indexOf('cards') > maxUnlockedStepIndex}
          >
            {/* Tag selector */}
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-2">Tag do Card (uma por vez)</label>
              <div className="flex flex-wrap gap-1.5">
                {CARD_TAGS.map(tag => (
                  <button key={tag.id} type="button" onClick={() => setSettings(prev => ({ ...prev, cardTag: tag.id }))}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold transition-all cursor-pointer border ${settings.cardTag === tag.id ? 'ring-2 ring-amber-500 ring-offset-1' : 'hover:scale-105'} ${tag.color}`}>
                    {tag.emoji} {tag.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Card previews side by side */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-3">
              <div className="text-[8px] font-bold uppercase tracking-widest text-slate-500 text-center mb-3">Preview dos Cards com Tag Selecionada</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="text-[7px] text-slate-400 font-bold uppercase tracking-wider text-center">Vertical — {settings.cardVerticalStyle}</div>
                  <div className="p-1.5 bg-white rounded-xl border border-slate-100 h-56 flex flex-col justify-center">
                    {renderVerticalCard(mockProperty, settings.cardVerticalStyle, CARD_TAGS.find(t => t.id === settings.cardTag))}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-[7px] text-slate-400 font-bold uppercase tracking-wider text-center">Horizontal — {settings.cardHorizontalStyle}</div>
                  <div className="p-1.5 bg-white rounded-xl border border-slate-100 h-56 flex flex-col justify-center">
                    {renderHorizontalCard(mockProperty, settings.cardHorizontalStyle, CARD_TAGS.find(t => t.id === settings.cardTag))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sync toggle */}
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200 my-2">
              <span className="text-[10px] font-semibold text-slate-700">Sincronizar estilo para ambos</span>
              <Toggle
                label=""
                checked={syncCardStyles}
                onChange={checked => {
                  setSyncCardStyles(checked)
                  if (checked) {
                    setSettings(prev => ({
                      ...prev,
                      cardHorizontalStyle: prev.cardVerticalStyle,
                    }))
                  }
                }}
              />
            </div>

            {/* Style selectors */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Estilo Vertical (6 versões)</label>
                <div className="space-y-1">
                  {['classic', 'minimalist', 'glassmorphism', 'editorial', 'bold-border', 'dark-elegance'].map(style => (
                    <button key={style} type="button" onClick={() => {
                      setSettings(prev => {
                        const next = { ...prev, cardVerticalStyle: style }
                        if (syncCardStyles) {
                          next.cardHorizontalStyle = style
                        }
                        return next
                      })
                    }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[9px] font-medium transition-all cursor-pointer border ${settings.cardVerticalStyle === style ? 'border-amber-400 bg-amber-50 text-amber-700' : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'}`}>
                      {settings.cardVerticalStyle === style && '✓ '}{style.charAt(0).toUpperCase() + style.slice(1).replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Estilo Horizontal (6 versões)</label>
                <div className="space-y-1">
                  {['classic', 'minimalist', 'glassmorphism', 'editorial', 'bold-border', 'dark-elegance'].map(style => (
                    <button key={style} type="button" onClick={() => {
                      setSettings(prev => {
                        const next = { ...prev, cardHorizontalStyle: style }
                        if (syncCardStyles) {
                          next.cardVerticalStyle = style
                        }
                        return next
                      })
                    }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[9px] font-medium transition-all cursor-pointer border ${settings.cardHorizontalStyle === style ? 'border-amber-400 bg-amber-50 text-amber-700' : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'}`}>
                      {settings.cardHorizontalStyle === style && '✓ '}{style.charAt(0).toUpperCase() + style.slice(1).replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Specs toggles */}
            <div className="border-t border-slate-100 pt-3">
              <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-2">Informações visíveis no card</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'showCardBedrooms', label: 'Quartos' },
                  { key: 'showCardBathrooms', label: 'Banheiros' },
                  { key: 'showCardArea', label: 'Área (m²)' },
                  { key: 'showCardCondo', label: 'Condomínio' },
                  { key: 'showCardPetFriendly', label: 'Aceita Pets' },
                ].map(({ key, label }) => (
                  <Toggle key={key} label={label} checked={(settings as any)[key]} onChange={v => setSettings(prev => ({ ...prev, [key]: v }))} />
                ))}
              </div>
            </div>
            {renderWizardNextButton('cards')}
          </SectionAccordion>

          {/* 4 · HERO STYLES */}
          <SectionAccordion
            icon={<Layout size={16} />}
            title="Tipos de Hero (6 opções)"
            isOpen={openSectionId === 'hero'}
            onToggle={() => toggleSection('hero')}
            isDisabled={isFirstTime && SECTIONS_ORDER.indexOf('hero') > maxUnlockedStepIndex}
          >
            <p className="text-[10px] text-slate-500 -mt-1">Clique para selecionar o layout do banner principal. A mudança é imediatamente visível no preview.</p>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'search-centered', label: 'Busca Centralizada', desc: 'Hero fullscreen com busca no centro', emoji: '🎯' },
                { id: 'search-right', label: 'Busca à Direita', desc: 'Busca no lado direito e texto no esquerdo', emoji: '▶️' },
                { id: 'search-left', label: 'Busca à Esquerda', desc: 'Busca no lado esquerdo e texto no direito', emoji: '◀️' },
                { id: 'minimalist', label: 'Minimalista', desc: 'Sem busca, imagem sutil, foco no título', emoji: '✦' },
                { id: 'split-screen', label: 'Tela Dividida', desc: 'Metade escura com texto, metade imagem', emoji: '▌▐' },
                { id: 'video-ambient', label: 'Ambiente Premium', desc: 'Overlay imersivo com efeito de brilho', emoji: '✨' },
              ].map(h => (
                <button key={h.id} type="button" onClick={() => setSettings(prev => ({ ...prev, heroStyle: h.id as any }))}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${settings.heroStyle === h.id ? 'border-amber-400 bg-amber-50/40 ring-1 ring-amber-400' : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'}`}>
                  <div className="text-lg mb-1">{h.emoji}</div>
                  <div className={`text-[9px] font-bold ${settings.heroStyle === h.id ? 'text-amber-700' : 'text-slate-700'}`}>{h.label}</div>
                  <div className="text-[7px] text-slate-400 mt-0.5 leading-tight">{h.desc}</div>
                  {settings.heroStyle === h.id && <div className="mt-1.5 text-[7px] font-bold text-amber-600 uppercase tracking-wider">✓ Selecionado</div>}
                </button>
              ))}
            </div>

             <div className="space-y-3 border-t border-slate-100 pt-4">
              <InputField label="Título Principal do Hero" value={settings.heroTitle} onChange={v => setSettings(prev => ({ ...prev, heroTitle: v }))} placeholder="Ex: Residências de Prestígio" />
              <TextareaField label="Subtítulo / Chamada" value={settings.heroSubtitle} onChange={v => setSettings(prev => ({ ...prev, heroSubtitle: v }))} placeholder="Descrição do hero..." />
            </div>

            {/* homeFilters config with descriptive labels */}
            <div className="border-t border-slate-100 pt-3">
              <label className="block text-[8px] font-bold uppercase tracking-wider text-slate-500 mb-2">Filtros de Busca Ativos no Hero (Legenda dos Campos)</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'finalidade', label: 'Finalidade', desc: 'Abas "Comprar" / "Alugar"' },
                  { id: 'tipo', label: 'Tipo de Imóvel', desc: 'Dropdown de tipos catalogados' },
                  { id: 'neighborhood', label: 'Cidade ou Bairro', desc: 'Dropdown de locais de atuação' },
                  { id: 'bedrooms', label: 'Quartos', desc: 'Seletor de quantidade de quartos' },
                  { id: 'preco', label: 'Faixa de Preço', desc: 'Dropdown de faixas de valores' },
                ].map(filter => {
                  const isChecked = settings.homeFilters?.includes(filter.id) ?? true;
                  return (
                    <label key={filter.id} className="flex items-start gap-2 p-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 select-none">
                      <input 
                        type="checkbox" 
                        checked={isChecked} 
                        onChange={e => {
                          const checked = e.target.checked;
                          setSettings(prev => {
                            const current = prev.homeFilters || [];
                            const next = checked 
                              ? [...current, filter.id] 
                              : current.filter(id => id !== filter.id);
                            return { ...prev, homeFilters: next };
                          });
                        }}
                        className="rounded text-amber-500 focus:ring-amber-400 mt-0.5"
                      />
                      <div className="flex-1">
                        <div className="text-[9px] text-slate-700 font-bold">{filter.label}</div>
                        <p className="text-[7.5px] text-slate-400 leading-tight mt-0.5">{filter.desc}</p>
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-3">
              {[
                { label: 'Preset Header', key: 'headerStyle', options: [{ v: 'minimal', l: 'Minimal' }, { v: 'transparent', l: 'Transparente' }, { v: 'classic', l: 'Clássico' }] },
                { label: 'Preset Footer', key: 'footerStyle', options: [{ v: 'simple', l: 'Simples' }, { v: 'detailed', l: 'Detalhado' }, { v: 'minimal', l: 'Mínimo' }, { v: 'modern-newsletter', l: 'Modern Newsletter' }, { v: 'column-grid', l: 'Grade de Colunas' }, { v: 'brand-glow', l: 'Brand Glow' }] },
                { label: 'Galeria de Imóvel', key: 'detailGalleryStyle', options: [{ v: 'slider', l: 'Slider' }, { v: 'mosaic', l: 'Mosaico' }, { v: 'grid', l: 'Grid' }] },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-[8px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">{field.label}</label>
                  <select value={(settings as any)[field.key]} onChange={e => setSettings(prev => ({ ...prev, [field.key]: e.target.value }))} className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-700">
                    {field.options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                  </select>
                </div>
              ))}
            </div>
            {renderWizardNextButton('hero')}
          </SectionAccordion>

          {/* 5 · SUBPÁGINAS */}
          <SectionAccordion
            icon={<Globe size={16} />}
            title="Sub-Páginas do Site"
            isOpen={openSectionId === 'subpages'}
            onToggle={() => toggleSection('subpages')}
            isDisabled={isFirstTime && SECTIONS_ORDER.indexOf('subpages') > maxUnlockedStepIndex}
          >
            <p className="text-[10px] text-slate-500 -mt-1 leading-normal">Ative ou desative cada página. As páginas ativas aparecem no menu de navegação e nas abas do preview.</p>
            <div className="space-y-2">
              {SUBPAGES.map(page => (
                <div key={page.id} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${settings.enabledPages[page.id as keyof typeof settings.enabledPages] ? 'border-amber-200 bg-amber-50/30' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{page.emoji}</span>
                    <div>
                      <div className="text-xs font-semibold text-slate-700">{page.label}</div>
                      {page.editable && <div className="text-[7px] text-slate-400">Conteúdo editável abaixo</div>}
                    </div>
                  </div>
                  <Toggle
                    label=""
                    checked={settings.enabledPages[page.id as keyof typeof settings.enabledPages]}
                    onChange={v => setSettings(prev => ({ ...prev, enabledPages: { ...prev.enabledPages, [page.id]: v } }))}
                  />
                </div>
              ))}
            </div>
            {renderWizardNextButton('subpages')}
          </SectionAccordion>

          {/* 6 · ESTRUTURAS DE PÁGINAS EXTRAS */}
          <SectionAccordion
            icon={<FileText size={16} />}
            title="Estrutura & Blocos das Páginas"
            isOpen={openSectionId === 'structures'}
            onToggle={() => toggleSection('structures')}
            isDisabled={isFirstTime && SECTIONS_ORDER.indexOf('structures') > maxUnlockedStepIndex}
          >
            {(['sobre', 'anunciar', 'contato'] as const).map(pageKey => {
              const pageInfo = SUBPAGES.find(p => p.id === pageKey)!
              const isEnabled = settings.enabledPages[pageKey]
              return (
                <div key={pageKey} className={`rounded-xl border p-3 space-y-3 ${isEnabled ? 'border-slate-200 bg-white' : 'border-dashed border-slate-200 opacity-50 bg-slate-50'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{pageInfo.emoji}</span>
                      <span className="text-xs font-bold text-slate-700">Página {pageInfo.label}</span>
                      {!isEnabled && <span className="text-[7px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-mono">Inativa</span>}
                    </div>
                  </div>

                  {/* Estrutura */}
                  <div>
                    <label className="block text-[8px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Estrutura de Layout</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {PAGE_STRUCTURES.map(struct => (
                        <button key={struct.id} type="button"
                          onClick={() => setSettings(prev => ({ ...prev, pageStructures: { ...prev.pageStructures, [pageKey]: struct.id } }))}
                          className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${settings.pageStructures[pageKey] === struct.id ? 'border-amber-400 bg-amber-50/40 ring-1 ring-amber-400' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                          <div className="text-sm mb-0.5">{struct.icon}</div>
                          <div className={`text-[8px] font-bold ${settings.pageStructures[pageKey] === struct.id ? 'text-amber-700' : 'text-slate-600'}`}>{struct.name}</div>
                          <div className="text-[6px] text-slate-400 mt-0.5 leading-tight">{struct.desc.split('·')[0].trim()}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Blocos Visíveis Selector */}
                  {['sobre', 'anunciar', 'contato'].includes(pageKey) && (
                    <div className="space-y-3 pt-1 border-t border-slate-100">
                      <div>
                        <label className="block text-[8px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Blocos Visíveis</label>
                        <div className="flex flex-wrap gap-1.5">
                          {PAGE_BLOCKS_OPTIONS.map(block => {
                            const isOn = (settings.pageBlocks[pageKey] || []).includes(block.id)
                            return (
                              <button key={block.id} type="button" onClick={() => togglePageBlock(pageKey, block.id)}
                                className={`px-2 py-1 rounded-full text-[8px] font-medium border cursor-pointer transition-all ${isOn ? 'border-amber-400 bg-amber-50 text-amber-700 font-semibold' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}>
                                {isOn ? '✓ ' : ''}{block.label}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Reordenador & Grade/Stack Selector (Requirement 12) */}
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <div className="flex justify-between items-center">
                          <label className="text-[8px] font-bold uppercase tracking-wider text-slate-500">Sequenciamento & Visualização</label>
                          <div className="flex border rounded-lg bg-slate-100 p-0.5 border-slate-200">
                            {[
                              { id: 'stack', label: 'Empilhado' },
                              { id: 'grid', label: 'Grade' }
                            ].map(l => {
                              const isSel = (settings.pageBlocksLayout?.[pageKey] || 'stack') === l.id
                              return (
                                <button
                                  key={l.id}
                                  type="button"
                                  onClick={() => setSettings(prev => ({
                                    ...prev,
                                    pageBlocksLayout: { ...prev.pageBlocksLayout, [pageKey]: l.id as any }
                                  }))}
                                  className={`px-2 py-0.5 rounded text-[8px] font-bold cursor-pointer transition-all border-0 ${isSel ? 'bg-white text-amber-800 shadow-sm' : 'text-slate-500 hover:text-slate-800 bg-transparent'}`}
                                >
                                  {l.label}
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        {/* List Reorderer */}
                        <div className="space-y-1 bg-slate-50 p-2 rounded-xl border border-slate-155">
                          {(settings.pageBlocks[pageKey] || []).map((blockId, bIdx) => {
                            const blockOpt = PAGE_BLOCKS_OPTIONS.find(bo => bo.id === blockId)
                            if (!blockOpt) return null
                            return (
                              <div key={blockId} className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-[10px] group hover:border-amber-250 transition-colors">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[8px] font-bold text-slate-400 font-mono">#{bIdx + 1}</span>
                                  <span className="font-semibold text-slate-700">{blockOpt.label}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    disabled={bIdx === 0}
                                    onClick={() => {
                                      setSettings(prev => {
                                        const nextBlocks = [...(prev.pageBlocks[pageKey] || [])]
                                        const temp = nextBlocks[bIdx]
                                        nextBlocks[bIdx] = nextBlocks[bIdx - 1]
                                        nextBlocks[bIdx - 1] = temp
                                        return {
                                          ...prev,
                                          pageBlocks: { ...prev.pageBlocks, [pageKey]: nextBlocks }
                                        }
                                      })
                                    }}
                                    className="text-slate-400 hover:text-amber-500 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed border-0 bg-transparent p-0.5"
                                  >
                                    <ChevronUp size={10} />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={bIdx === (settings.pageBlocks[pageKey] || []).length - 1}
                                    onClick={() => {
                                      setSettings(prev => {
                                        const nextBlocks = [...(prev.pageBlocks[pageKey] || [])]
                                        const temp = nextBlocks[bIdx]
                                        nextBlocks[bIdx] = nextBlocks[bIdx + 1]
                                        nextBlocks[bIdx + 1] = temp
                                        return {
                                          ...prev,
                                          pageBlocks: { ...prev.pageBlocks, [pageKey]: nextBlocks }
                                        }
                                      })
                                    }}
                                    className="text-slate-400 hover:text-amber-500 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed border-0 bg-transparent p-0.5"
                                  >
                                    <ChevronDown size={10} />
                                  </button>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
            {renderWizardNextButton('structures')}
          </SectionAccordion>

          {/* 7 · BLOCOS DA HOME */}
          <SectionAccordion
            icon={<Layers size={16} />}
            title="Blocos da Home (Adicionar / Remover)"
            isOpen={openSectionId === 'homeblocks'}
            onToggle={() => toggleSection('homeblocks')}
            isDisabled={isFirstTime && SECTIONS_ORDER.indexOf('homeblocks') > maxUnlockedStepIndex}
          >
            <p className="text-[10px] text-slate-500 -mt-1">Arraste com as setas para reordenar. Clique × para remover. Use "+ Adicionar" para incluir blocos.</p>

            {/* Active blocks list */}
            <div className="space-y-1.5">
              {settings.homeBlocks.map((blockId: string, idx: number) => {
                const block = ALL_HOME_BLOCKS.find(b => b.id === blockId)
                if (!block) return null
                return (
                  <div key={blockId} className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200 group hover:border-amber-200 transition-colors">
                    <div className="flex flex-col gap-0.5">
                      <button type="button" disabled={idx === 0} onClick={() => moveHomeBlock(idx, 'up')} className="text-slate-400 hover:text-amber-500 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"><ChevronUp size={11} /></button>
                      <button type="button" disabled={idx === settings.homeBlocks.length - 1} onClick={() => moveHomeBlock(idx, 'down')} className="text-slate-400 hover:text-amber-500 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"><ChevronDown size={11} /></button>
                    </div>
                    <Move size={10} className="text-slate-300 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-700">{block.label}</div>
                      <div className="text-[7px] text-slate-400">{block.desc}</div>
                    </div>
                    <button type="button" onClick={() => removeHomeBlock(blockId)} className="text-slate-300 hover:text-red-500 p-1 rounded cursor-pointer transition-colors opacity-0 group-hover:opacity-100"><X size={12} /></button>
                  </div>
                )
              })}
            </div>

            {/* Add blocks */}
            <div className="pt-2 border-t border-slate-100 mt-2">
              <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-2">+ Adicionar Blocos Disponíveis</label>
              <div className="grid grid-cols-2 gap-1.5">
                {ALL_HOME_BLOCKS.filter(b => !settings.homeBlocks.includes(b.id)).map(block => (
                  <button key={block.id} type="button" onClick={() => addHomeBlock(block.id)}
                    className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 hover:border-amber-400 hover:bg-amber-50/30 text-left transition-all cursor-pointer group">
                    <Plus size={10} className="text-slate-400 group-hover:text-amber-500 shrink-0" />
                    <div>
                      <div className="text-[9px] font-semibold text-slate-600 group-hover:text-amber-700">{block.label}</div>
                    </div>
                  </button>
                ))}
                {ALL_HOME_BLOCKS.every(b => settings.homeBlocks.includes(b.id)) && (
                  <div className="col-span-2 text-center text-[9px] text-slate-400 py-2">✓ Todos os blocos estão ativos</div>
                )}
              </div>
            </div>
            {renderWizardNextButton('homeblocks')}
          </SectionAccordion>

          {/* 7.5 · CIDADES (ONDE ATUAMOS) */}
          <SectionAccordion
            icon={<Globe size={16} />}
            title="🏙️ Onde Atuamos (Cidades & Bairros)"
            isOpen={openSectionId === 'cities'}
            onToggle={() => toggleSection('cities')}
            isDisabled={isFirstTime && SECTIONS_ORDER.indexOf('cities') > maxUnlockedStepIndex}
          >
            <p className="text-[10px] text-slate-500 -mt-1 leading-normal">
              Gerencie os locais de atuação exibidos no carrossel de cidades/bairros na Home. Adicione imagens de alta qualidade (presets Unsplash sugeridos).
            </p>
            
            <div className="space-y-3 pt-2">
              {/* Adicionar nova cidade */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="text-[9px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                  <Plus size={11} className="text-amber-500" /> Adicionar Novo Local
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    id="new-city-name"
                    placeholder="Cidade/Bairro"
                    className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-[10px] text-slate-750 focus:outline-none focus:border-[hsl(221_68%_50%)]"
                  />
                  <input
                    type="text"
                    id="new-city-state"
                    placeholder="UF (Ex: SP)"
                    maxLength={2}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-[10px] text-slate-750 focus:outline-none focus:border-[hsl(221_68%_50%)] uppercase"
                  />
                  <input
                    type="number"
                    id="new-city-count"
                    placeholder="Nº Imóveis"
                    className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-[10px] text-slate-750 focus:outline-none focus:border-[hsl(221_68%_50%)]"
                  />
                </div>
                <input
                  type="text"
                  id="new-city-image"
                  placeholder="URL da Imagem (Unsplash)"
                  className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-[10px] text-slate-750 focus:outline-none focus:border-[hsl(221_68%_50%)]"
                />
                <button
                  type="button"
                  onClick={() => {
                    const nameInput = document.getElementById('new-city-name') as HTMLInputElement;
                    const stateInput = document.getElementById('new-city-state') as HTMLInputElement;
                    const countInput = document.getElementById('new-city-count') as HTMLInputElement;
                    const imageInput = document.getElementById('new-city-image') as HTMLInputElement;
                    
                    if (!nameInput.value.trim()) {
                      showToast('Digite o nome da cidade ou bairro.', 'error');
                      return;
                    }
                    const newCity = {
                      name: nameInput.value.trim(),
                      state: (stateInput.value || 'PR').trim().toUpperCase(),
                      count: parseInt(countInput.value) || 0,
                      image: imageInput.value.trim() || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80',
                    };
                    
                    setSettings(prev => ({
                      ...prev,
                      citiesList: [...(prev.citiesList || []), newCity]
                    }));
                    
                    nameInput.value = '';
                    stateInput.value = '';
                    countInput.value = '';
                    imageInput.value = '';
                    showToast('Local de atuação adicionado!', 'success');
                  }}
                  className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[9px] font-bold transition-all cursor-pointer border-0 shadow-sm"
                >
                  Confirmar Adicionar
                </button>
              </div>

              {/* Lista das cidades cadastradas */}
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {(settings.citiesList || []).map((city, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col gap-2 relative hover:border-amber-250 transition-colors">
                    <button
                      type="button"
                      onClick={() => {
                        setSettings(prev => ({
                          ...prev,
                          citiesList: (prev.citiesList || []).filter((_, i) => i !== idx)
                        }))
                        showToast('Local de atuação removido!', 'success')
                      }}
                      className="absolute top-2 right-2 text-slate-400 hover:text-rose-500 cursor-pointer border-0 bg-transparent"
                    >
                      <Trash2 size={12} />
                    </button>
                    
                    <div className="flex gap-2 items-center text-left">
                      <img src={city.image} alt={city.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <div className="text-[11px] font-bold text-slate-800">{city.name} - {city.state}</div>
                        <div className="text-[9px] text-slate-500">{city.count} imóveis</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {renderWizardNextButton('cities')}
          </SectionAccordion>

          {/* 8 · EQUIPE */}
          <SectionAccordion
            icon={<Users size={16} />}
            title="Equipe & Corretores"
            isOpen={openSectionId === 'team'}
            onToggle={() => toggleSection('team')}
            isDisabled={isFirstTime && SECTIONS_ORDER.indexOf('team') > maxUnlockedStepIndex}
          >
            <div className="border-b border-slate-100 pb-4 mb-4">
              <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Estilo Visual do Bloco de Equipe</label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'grid', label: 'Grid', icon: '🗂️' },
                  { id: 'cards', label: 'Cards', icon: '💎' },
                  { id: 'list', label: 'Lista', icon: '📝' },
                  { id: 'minimal', label: 'Mínimo', icon: '⚪' },
                ].map(style => (
                  <button key={style.id} type="button" onClick={() => setSettings(prev => ({ ...prev, teamStyle: style.id as any }))}
                    className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${settings.teamStyle === style.id ? 'border-amber-400 bg-amber-50/40 ring-1 ring-amber-400' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                    <div className="text-xs mb-0.5">{style.icon}</div>
                    <div className={`text-[8px] font-bold ${settings.teamStyle === style.id ? 'text-amber-700' : 'text-slate-600'}`}>{style.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-b border-slate-100 pb-4 mb-4">
              <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Selecionar Corretores Cadastrados do Sistema</label>
              <div className="grid grid-cols-2 gap-2">
                {ALL_SYSTEM_USERS.map(sysUser => {
                  const isSelected = settings.team.some((t: any) => t.id === sysUser.id || t.name === sysUser.name);
                  return (
                    <button
                      key={sysUser.id}
                      type="button"
                      onClick={() => toggleSystemUser(sysUser)}
                      className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-amber-400 bg-amber-50/40 ring-1 ring-amber-400' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-100 shrink-0">
                        <img src={sysUser.photo} className="w-full h-full object-cover" alt={sysUser.name} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-bold text-slate-800 truncate">{sysUser.name}</div>
                        <div className="text-[8px] text-slate-500 truncate">{sysUser.role}</div>
                      </div>
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected 
                          ? 'border-amber-500 bg-amber-500 text-white text-[8px] font-bold border-amber-500' 
                          : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && '✓'}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex justify-end mb-3">
              <button onClick={addTeamMember} className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-md shadow-amber-500/10 border-0">
                <Plus size={12} /> Adicionar Membro
              </button>
            </div>
            <div className="space-y-3">
              {settings.team.map((member: any, idx: number) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative space-y-3 hover:border-amber-200 transition-colors">
                  <button onClick={() => removeTeamMember(idx)} className="absolute top-3 right-3 text-slate-400 hover:text-red-500 p-1 cursor-pointer transition-colors border-0 bg-transparent"><Trash2 size={13} /></button>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-slate-200 overflow-hidden bg-white flex items-center justify-center shrink-0">
                      {member.photo ? <img src={member.photo} className="w-full h-full object-cover" onError={e => { (e.target as HTMLElement).style.display = 'none' }} /> : <Users size={16} className="text-slate-400" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">{member.name || 'Sem nome'}</div>
                      <div className="text-[10px] text-amber-600 font-mono uppercase tracking-wider">{member.role || 'Sem cargo'}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                    {[{ label: 'Nome', key: 'name', ph: 'Nome completo' }, { label: 'Cargo', key: 'role', ph: 'Especialidade' }, { label: 'WhatsApp', key: 'phone', ph: '(41) 99999-9999' }, { label: 'E-mail', key: 'email', ph: 'nome@lumina.com.br' }].map(f => (
                      <div key={f.key}>
                        <label className="block text-[7px] font-bold uppercase tracking-wider text-slate-500 mb-1">{f.label}</label>
                        <input type="text" value={member[f.key] || ''} onChange={e => updateTeamMember(idx, f.key, e.target.value)} placeholder={f.ph} className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-[10px] text-slate-705 focus:outline-none focus:border-[hsl(221_68%_50%)]" />
                      </div>
                    ))}
                    <div className="col-span-2">
                      <label className="block text-[7px] font-bold uppercase tracking-wider text-slate-500 mb-1">Foto (URL)</label>
                      <input type="text" value={member.photo || ''} onChange={e => updateTeamMember(idx, 'photo', e.target.value)} placeholder="https://..." className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-[10px] text-slate-705 focus:outline-none focus:border-[hsl(221_68%_50%)]" />
                    </div>
                  </div>
                </div>
              ))}
              {settings.team.length === 0 && (
                <div className="text-center py-6 text-[10px] text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                  Nenhum membro adicionado. Clique em "Adicionar Membro" acima.
                </div>
              )}
            </div>
            {renderWizardNextButton('team')}
          </SectionAccordion>

          {/* 9 · CONTEÚDO DAS PÁGINAS */}
          <SectionAccordion
            icon={<FileText size={16} />}
            title="Conteúdo: Sobre, Anunciar & Contato"
            isOpen={openSectionId === 'content'}
            onToggle={() => toggleSection('content')}
            isDisabled={isFirstTime && SECTIONS_ORDER.indexOf('content') > maxUnlockedStepIndex}
          >
            {/* Sobre */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-1">
                <span className="text-base">📖</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Página Sobre Nós</span>
              </div>
              <InputField label="Título Principal" value={settings.sobreTitle} onChange={v => setSettings(prev => ({ ...prev, sobreTitle: v }))} placeholder="Ex: Nossa História" />
              <TextareaField label="Texto Institucional" value={settings.sobreText} onChange={v => setSettings(prev => ({ ...prev, sobreText: v }))} placeholder="História da empresa..." rows={4} />
              <InputField label="Imagem (URL)" value={settings.sobreImage} onChange={v => setSettings(prev => ({ ...prev, sobreImage: v }))} placeholder="https://..." />
              <InputField label='Estatísticas (separadas por " . " e " , ")' value={settings.sobreStats} onChange={v => setSettings(prev => ({ ...prev, sobreStats: v }))} placeholder="50k, de vendas . +500, clientes atendidos" />
            </div>

            {/* Anunciar */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 pb-1">
                <span className="text-base">📣</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Página Anunciar</span>
              </div>
              <InputField label="Título da Página" value={settings.anunciarTitle} onChange={v => setSettings(prev => ({ ...prev, anunciarTitle: v }))} placeholder="Ex: Anuncie seu Imóvel" />
              <InputField label="Subtítulo / Chamada" value={settings.anunciarSubtitle} onChange={v => setSettings(prev => ({ ...prev, anunciarSubtitle: v }))} placeholder="Descrição..." />
            </div>

            {/* Contato */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 pb-1">
                <span className="text-base">📞</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Página Contato</span>
              </div>
              <InputField label="Título de Contato" value={settings.contatoTitle} onChange={v => setSettings(prev => ({ ...prev, contatoTitle: v }))} placeholder="Ex: Entre em Contato" />
              <InputField label="Subtítulo / Chamada" value={settings.contatoSubtitle} onChange={v => setSettings(prev => ({ ...prev, contatoSubtitle: v }))} placeholder="Agende uma visita..." />
              <InputField label="Endereço Físico" value={settings.contatoAddress} onChange={v => setSettings(prev => ({ ...prev, contatoAddress: v }))} placeholder="Rua, número, bairro..." />
            </div>

            {/* Contato info */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Dados de Contato</div>
              <div className="grid grid-cols-2 gap-3">
                <InputField label="Telefone" value={contacts.phone} onChange={v => setContacts(prev => ({ ...prev, phone: v }))} placeholder="(41) 3000-0000" />
                <InputField label="E-mail" value={contacts.email} onChange={v => setContacts(prev => ({ ...prev, email: v }))} placeholder="email@..." />
                <InputField label="WhatsApp" value={contacts.whatsapp} onChange={v => setContacts(prev => ({ ...prev, whatsapp: v }))} placeholder="(41) 99999-9999" />
                <InputField label="CRECI" value={contacts.creci} onChange={v => setContacts(prev => ({ ...prev, creci: v }))} placeholder="CRECI-PR 00.000-F" />
              </div>
            </div>
            {renderWizardNextButton('content')}
          </SectionAccordion>

          {/* 10 · CAMPOS DO FORMULÁRIO */}
          <SectionAccordion
            icon={<FileText size={16} />}
            title="📋 Campos do Formulário"
            isOpen={openSectionId === 'fields'}
            onToggle={() => toggleSection('fields')}
            isDisabled={isFirstTime && SECTIONS_ORDER.indexOf('fields') > maxUnlockedStepIndex}
          >
            <p className="text-[10px] text-slate-500 -mt-1 leading-normal">Selecione quais campos exibir no formulário de contato/anunciar e se são obrigatórios.</p>
            <div className="space-y-3 pt-2">
              {Object.entries(settings.formFields).map(([key, field]: [string, any]) => (
                <div key={key} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-700">{field.label}</span>
                    <span className="text-[8px] text-slate-400 font-mono">{key}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={field.enabled}
                        onChange={e => {
                          const enabled = e.target.checked
                          setSettings(prev => ({
                            ...prev,
                            formFields: {
                              ...prev.formFields,
                              [key]: { ...prev.formFields[key as keyof typeof prev.formFields], enabled }
                            }
                          }))
                        }}
                        className="rounded border-slate-350 text-amber-500 focus:ring-amber-500 w-3.5 h-3.5"
                      />
                      <span className="text-[10px] font-medium text-slate-600">Exibir</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={field.required}
                        disabled={!field.enabled}
                        onChange={e => {
                          const required = e.target.checked
                          setSettings(prev => ({
                            ...prev,
                            formFields: {
                              ...prev.formFields,
                              [key]: { ...prev.formFields[key as keyof typeof prev.formFields], required }
                            }
                          }))
                        }}
                        className="rounded border-slate-350 text-amber-500 focus:ring-amber-500 w-3.5 h-3.5 disabled:opacity-40"
                      />
                      <span className="text-[10px] font-medium text-slate-600">Obrigatório</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
            {renderWizardNextButton('fields')}
          </SectionAccordion>

          {/* 11 · APONTAMENTO DNS E DOMÍNIO */}
          <SectionAccordion
            icon={<Globe size={16} />}
            title="🌐 Domínio & DNS"
            isOpen={openSectionId === 'domain'}
            onToggle={() => toggleSection('domain')}
            isDisabled={isFirstTime && SECTIONS_ORDER.indexOf('domain') > maxUnlockedStepIndex}
          >
            <p className="text-[10px] text-slate-500 -mt-1 leading-normal">Configure seus domínios personalizados e faça o apontamento DNS para colocar seu portal no ar.</p>
            
            <div className="space-y-4 pt-2">
              {/* Provisório */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <div className="text-[8px] font-bold uppercase tracking-wider text-slate-400 mb-1">Domínio Provisório</div>
                <a href={`http://localhost:3000/${settings.slug}`} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-amber-600 hover:underline flex items-center gap-1">
                  http://localhost:3000/{settings.slug} <ArrowRight size={10} />
                </a>
              </div>

              {/* Lista de Domínios Conectados */}
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-2">Domínios Conectados</label>
                {customDomains.length > 0 ? (
                  <div className="space-y-2">
                    {customDomains.map((dom, idx) => (
                      <div key={dom} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white group hover:border-amber-300 transition-colors">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-700">{dom}</span>
                          {idx === 0 && (
                            <span className="bg-amber-100 text-amber-800 text-[7px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">Principal</span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setCustomDomains(prev => {
                              const next = prev.filter(d => d !== dom)
                              if (customDomain === dom) {
                                setCustomDomain(next[0] || '')
                              }
                              return next
                            })
                            showToast(`Domínio ${dom} desconectado!`, 'info')
                          }}
                          className="text-[9px] font-bold text-red-500 hover:text-red-700 border-0 bg-transparent cursor-pointer py-1 px-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Desconectar
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-[10px] text-slate-400 border border-dashed border-slate-200 rounded-xl">
                    Nenhum domínio personalizado conectado. Adicione um abaixo.
                  </div>
                )}
              </div>

              {/* Adicionar Novo Domínio */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">Adicionar Domínio Personalizado</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newDomainInput}
                    onChange={e => setNewDomainInput(e.target.value)}
                    placeholder="ex: www.suaimobiliaria.com.br"
                    className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[hsl(221_68%_50%)]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newDomainInput || !newDomainInput.trim()) return
                      const dom = newDomainInput.trim().toLowerCase()
                      if (customDomains.includes(dom)) {
                        showToast('Este domínio já está cadastrado!', 'error')
                        return
                      }
                      setCustomDomains(prev => [...prev, dom])
                      if (!customDomain) {
                        setCustomDomain(dom)
                      }
                      setNewDomainInput('')
                      showToast(`Domínio ${dom} adicionado!`, 'success')
                    }}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg cursor-pointer transition-colors border-0 shrink-0"
                  >
                    Adicionar
                  </button>
                </div>
              </div>

              {/* Status & Pointing for Main Custom Domain */}
              {customDomains.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className={`w-2 h-2 rounded-full ${domainStatus === 'connected' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                    <span className="text-[10px] font-medium text-slate-600">
                      Status ({customDomains[0]}): {domainStatus === 'connected' ? 'Conectado' : 'Aguardando Apontamento DNS'}
                    </span>
                    {domainStatus === 'pending' && (
                      <button 
                        type="button" 
                        onClick={() => {
                          showToast('Verificando registros DNS... Por favor, aguarde.', 'info')
                          setTimeout(() => {
                            setDomainStatus('connected')
                            showToast('Parabéns! Domínio configurado e apontado com sucesso!', 'success')
                          }, 1200)
                        }} 
                        className="ml-auto px-2 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-[9px] font-bold rounded cursor-pointer transition-colors border-0"
                      >
                        Verificar DNS
                      </button>
                    )}
                  </div>

                  {/* Tabela DNS */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm animate-fade-in">
                    <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex justify-between items-center">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Apontamento DNS ({customDomains[0]})</span>
                      <span className="bg-slate-200 text-slate-655 text-[7px] font-mono px-1.5 py-0.5 rounded uppercase">Vercel</span>
                    </div>
                    <div className="divide-y divide-slate-100 text-[10px]">
                      {/* Registro A */}
                      <div className="p-3 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-slate-700">Registro Raiz</span>
                          <span className="bg-amber-100 text-amber-800 text-[8px] font-bold px-1.5 py-0.5 rounded">Tipo A</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100 font-mono text-[9px]">
                          <div>
                            <div className="text-[7px] text-slate-400 uppercase font-sans">Nome/Host</div>
                            <div className="text-slate-800">@</div>
                          </div>
                          <div className="col-span-2">
                            <div className="text-[7px] text-slate-400 uppercase font-sans">Valor/Destino</div>
                            <div className="flex justify-between items-center text-slate-800">
                              <span>76.76.21.21</span>
                              <button type="button" onClick={() => { navigator.clipboard.writeText('76.76.21.21'); showToast('IP copiado!', 'success') }} className="text-amber-600 hover:text-amber-700 font-sans font-bold cursor-pointer text-[8px] border-0 bg-transparent p-0">Copiar</button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Registro CNAME */}
                      <div className="p-3 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-slate-700">Registro Subdomínio</span>
                          <span className="bg-blue-100 text-blue-800 text-[8px] font-bold px-1.5 py-0.5 rounded">CNAME</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100 font-mono text-[9px]">
                          <div>
                            <div className="text-[7px] text-slate-400 uppercase font-sans">Nome/Host</div>
                            <div className="text-slate-800">www</div>
                          </div>
                          <div className="col-span-2">
                            <div className="text-[7px] text-slate-400 uppercase font-sans">Valor/Destino</div>
                            <div className="flex justify-between items-center text-slate-800">
                              <span>cname.vercel-dns.com</span>
                              <button type="button" onClick={() => { navigator.clipboard.writeText('cname.vercel-dns.com'); showToast('CNAME copiado!', 'success') }} className="text-amber-600 hover:text-amber-700 font-sans font-bold cursor-pointer text-[8px] border-0 bg-transparent p-0">Copiar</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </SectionAccordion>

          {/* 12 · SEO & RASTREAMENTO */}
          <SectionAccordion
            icon={<Search size={16} />}
            title="⚙️ SEO & Rastreamento"
            isOpen={openSectionId === 'seo'}
            onToggle={() => toggleSection('seo')}
            isDisabled={isFirstTime && SECTIONS_ORDER.indexOf('seo') > maxUnlockedStepIndex}
          >
            <p className="text-[10px] text-slate-500 -mt-1 leading-normal font-sans">Configure tags de SEO, códigos de rastreamento do Google, Facebook, RD Station e outras plataformas.</p>
            
            <div className="space-y-4 pt-2">
              <div className="border-b border-slate-100 pb-3 space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600">SEO Básico</div>
                <InputField 
                  label="Palavras-chave (Keywords - Separadas por vírgula)" 
                  value={settings.seoKeywords || ''} 
                  onChange={v => setSettings(prev => ({ ...prev, seoKeywords: v }))} 
                  placeholder="Ex: imoveis luxo, cobertura batel, curitiba imobiliaria" 
                />
                <InputField 
                  label="Google Site Verification (Código)" 
                  value={settings.googleSiteVerificationId || ''} 
                  onChange={v => setSettings(prev => ({ ...prev, googleSiteVerificationId: v }))} 
                  placeholder="Ex: google-site-verification-code" 
                />
              </div>

              <div className="border-b border-slate-100 pb-3 space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Google Analytics & Tag Manager</div>
                <InputField 
                  label="ID do Google Analytics (GA4)" 
                  value={settings.googleAnalyticsId || ''} 
                  onChange={v => setSettings(prev => ({ ...prev, googleAnalyticsId: v }))} 
                  placeholder="Ex: G-XXXXXXXXXX" 
                />
                <InputField 
                  label="ID do Google Tag Manager (GTM)" 
                  value={settings.googleTagManagerId || ''} 
                  onChange={v => setSettings(prev => ({ ...prev, googleTagManagerId: v }))} 
                  placeholder="Ex: GTM-XXXXXXX" 
                />
              </div>

              <div className="border-b border-slate-100 pb-3 space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Google Ads (AdWords)</div>
                <div className="grid grid-cols-2 gap-3">
                  <InputField 
                    label="ID de Conversão Ads" 
                    value={settings.googleAdsConversionId || ''} 
                    onChange={v => setSettings(prev => ({ ...prev, googleAdsConversionId: v }))} 
                    placeholder="Ex: AW-123456789" 
                  />
                  <InputField 
                    label="Rótulo de Conversão Ads" 
                    value={settings.googleAdsConversionLabel || ''} 
                    onChange={v => setSettings(prev => ({ ...prev, googleAdsConversionLabel: v }))} 
                    placeholder="Ex: abcdEFGH-12345" 
                  />
                </div>
                <InputField 
                  label="ID de Remarketing Ads" 
                  value={settings.googleAdsRemarketingId || ''} 
                  onChange={v => setSettings(prev => ({ ...prev, googleAdsRemarketingId: v }))} 
                  placeholder="Ex: AW-123456789" 
                />
              </div>

              <div className="border-b border-slate-100 pb-3 space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Facebook Meta Pixel & API</div>
                <InputField 
                  label="ID do Facebook Pixel" 
                  value={settings.facebookPixelId || ''} 
                  onChange={v => setSettings(prev => ({ ...prev, facebookPixelId: v }))} 
                  placeholder="Ex: 123456789012345" 
                />
                <InputField 
                  label="Token de API de Conversões" 
                  value={settings.facebookConversionToken || ''} 
                  onChange={v => setSettings(prev => ({ ...prev, facebookConversionToken: v }))} 
                  placeholder="Ex: EAAG..." 
                />
              </div>

              <div className="border-b border-slate-100 pb-3 space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600">RD Station & Pinterest</div>
                <div className="grid grid-cols-2 gap-3">
                  <InputField 
                    label="Token RD Station" 
                    value={settings.rdStationToken || ''} 
                    onChange={v => setSettings(prev => ({ ...prev, rdStationToken: v }))} 
                    placeholder="Ex: token_rd_station" 
                  />
                  <InputField 
                    label="Tag ID do Pinterest" 
                    value={settings.pinterestTagId || ''} 
                    onChange={v => setSettings(prev => ({ ...prev, pinterestTagId: v }))} 
                    placeholder="Ex: 987654321" 
                  />
                </div>
                <TextareaField 
                  label="Script de Monitoramento RD Station" 
                  value={settings.rdStationScript || ''} 
                  onChange={v => setSettings(prev => ({ ...prev, rdStationScript: v }))} 
                  placeholder="Cole aqui o script fornecido pelo RD Station..." 
                  rows={3}
                />
              </div>

              <div className="border-b border-slate-100 pb-3 space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600">LinkedIn & TikTok Ads</div>
                <div className="grid grid-cols-2 gap-3">
                  <InputField 
                    label="Partner ID LinkedIn" 
                    value={settings.linkedinInsightId || ''} 
                    onChange={v => setSettings(prev => ({ ...prev, linkedinInsightId: v }))} 
                    placeholder="Ex: 123456" 
                  />
                  <InputField 
                    label="TikTok Pixel ID" 
                    value={settings.tiktokPixelId || ''} 
                    onChange={v => setSettings(prev => ({ ...prev, tiktokPixelId: v }))} 
                    placeholder="Ex: CXXXXXXXXXXXXXXXX" 
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Scripts Customizados (Avançado)</div>
                <TextareaField 
                  label="Scripts Customizados no Head (<head>)" 
                  value={settings.customScriptsHead || ''} 
                  onChange={v => setSettings(prev => ({ ...prev, customScriptsHead: v }))} 
                  placeholder="Cole aqui tags <script>, <meta> ou <link> adicionais para o cabeçalho..." 
                  rows={4}
                />
                <TextareaField 
                  label="Scripts Customizados no Rodapé (Final do <body>)" 
                  value={settings.customScriptsBody || ''} 
                  onChange={v => setSettings(prev => ({ ...prev, customScriptsBody: v }))} 
                  placeholder="Cole aqui scripts adicionais a serem injetados no final do body..." 
                  rows={4}
                />
              </div>
            </div>
            {renderWizardNextButton('seo')}
          </SectionAccordion>

          {/* 13 · CSS PERSONALIZADO */}
          <SectionAccordion
            icon={<Code size={16} />}
            title="🎨 CSS Personalizado"
            isOpen={openSectionId === 'css'}
            onToggle={() => toggleSection('css')}
            isDisabled={isFirstTime && SECTIONS_ORDER.indexOf('css') > maxUnlockedStepIndex}
          >
            <p className="text-[10px] text-slate-500 -mt-1 leading-normal font-sans">Adicione estilos CSS customizados para personalizar fontes, cores, botões ou outros componentes visuais de forma avançada.</p>
            
            <div className="space-y-4 pt-2">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[10px] text-amber-800 leading-normal font-sans">
                💡 <strong>Dica de Customização:</strong> Os estilos adicionados aqui serão aplicados em tempo real na janela de preview ao lado e estarão no ar quando salvar.
                <br />
                <code className="block mt-1.5 bg-amber-100 p-1.5 rounded font-mono text-[9px] text-slate-800 leading-normal">
                  .btn-gold &#123; background-color: #f59e0b !important; &#125;<br />
                  .bg-cream &#123; background-color: #fafaf9 !important; &#125;
                </code>
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-mono">Regras CSS</label>
                <textarea
                  value={settings.customCss || ''}
                  onChange={e => setSettings(prev => ({ ...prev, customCss: e.target.value }))}
                  placeholder="/* Digite seu CSS personalizado aqui... */"
                  rows={12}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs font-mono text-emerald-400 focus:outline-none focus:border-[hsl(221_68%_50%)] transition-colors resize-y shadow-inner leading-relaxed"
                />
              </div>
            </div>
            {renderWizardNextButton('css')}
          </SectionAccordion>

          {/* 14 · IMPORTAR / EXPORTAR CONFIGURAÇÃO V8 (AWS S3 JSON) */}
          <SectionAccordion
            icon={<Download size={16} />}
            title="📥 Importar / Exportar V8 (S3 JSON)"
            isOpen={openSectionId === 's3config'}
            onToggle={() => toggleSection('s3config')}
            isDisabled={isFirstTime && SECTIONS_ORDER.indexOf('s3config') > maxUnlockedStepIndex}
          >
            <p className="text-[10px] text-slate-500 -mt-1 leading-normal font-sans">
              Importe ou exporte toda a estrutura do portal no formato JSON compatível com o esquema AWS S3 V2 da Microsistec.
            </p>

            <div className="space-y-4 pt-2 font-sans">
              {/* Seção Exportar */}
              <div className="border-b border-slate-100 pb-4 space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Exportar Configuração</div>
                <p className="text-[9px] text-slate-500 leading-normal">
                  Copie o código JSON abaixo ou faça o download para salvar em seu computador e fazer o upload no S3.
                </p>
                <div className="relative group">
                  <textarea
                    readOnly
                    value={JSON.stringify(mapBuilderToThemeS3(settings, colors, fonts, contacts), null, 2)}
                    rows={8}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[9px] font-mono text-slate-600 focus:outline-none select-all"
                  />
                  <div className="absolute right-2.5 bottom-2.5 flex gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => {
                        const json = JSON.stringify(mapBuilderToThemeS3(settings, colors, fonts, contacts), null, 2);
                        navigator.clipboard.writeText(json);
                        showToast('JSON copiado com sucesso!', 'success');
                      }}
                      className="px-2 py-1 bg-slate-800 text-white rounded text-[8px] font-bold cursor-pointer hover:bg-slate-700 border-0"
                    >
                      Copiar JSON
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const json = JSON.stringify(mapBuilderToThemeS3(settings, colors, fonts, contacts), null, 2);
                        const blob = new Blob([json], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `theme-${settings.slug || 'lumina'}-v2.json`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        showToast('Download iniciado!', 'success');
                      }}
                      className="px-2 py-1 bg-amber-500 text-slate-950 rounded text-[8px] font-bold cursor-pointer hover:bg-amber-400 border-0"
                    >
                      Baixar Arquivo
                    </button>
                  </div>
                </div>
              </div>

              {/* Seção Importar */}
              <div className="space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Importar Configuração</div>
                <p className="text-[9px] text-slate-500 leading-normal">
                  Selecione um arquivo `.json` ou cole o código de configuração no formato AWS S3 V2 para carregar instantaneamente.
                </p>

                {/* Upload de arquivo */}
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-amber-400 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-3 pb-3">
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Carregar arquivo .json</p>
                      <p className="text-[8px] text-slate-400 mt-0.5">Arraste ou clique para selecionar</p>
                    </div>
                    <input 
                      type="file" 
                      accept=".json" 
                      className="hidden" 
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (evt) => {
                          const text = evt.target?.result as string;
                          try {
                            const parsed = JSON.parse(text);
                            if (parsed.schemaVersion !== 2) {
                              showToast('Esquema de arquivo inválido. Deve ser AWS S3 V2.', 'error');
                              return;
                            }
                            const mapped = mapThemeS3ToBuilder(parsed, defaultTenant);
                            setSettings(prev => ({ ...prev, ...mapped.settings }));
                            setColors(mapped.colors);
                            setFonts(mapped.fonts);
                            setContacts(mapped.contacts);
                            setS3JsonInput(text);
                            showToast('Configuração importada com sucesso!', 'success');
                          } catch (err) {
                            showToast('Erro ao ler arquivo JSON.', 'error');
                          }
                        };
                        reader.readAsText(file);
                      }}
                    />
                  </label>
                </div>

                {/* Paste Textarea */}
                <div>
                  <label className="block text-[8px] font-bold uppercase tracking-wider text-slate-400 mb-1">Ou cole o JSON aqui</label>
                  <textarea
                    value={s3JsonInput}
                    onChange={e => setS3JsonInput(e.target.value)}
                    placeholder='{ "schemaVersion": 2, "design": { ... } }'
                    rows={6}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-[9px] font-mono text-slate-700 focus:outline-none focus:border-[hsl(221_68%_50%)]"
                  />
                  <button
                    type="button"
                    disabled={!s3JsonInput.trim()}
                    onClick={() => {
                      try {
                        const parsed = JSON.parse(s3JsonInput);
                        if (parsed.schemaVersion !== 2) {
                          showToast('Esquema inválido. Verifique se possui "schemaVersion": 2', 'error');
                          return;
                        }
                        const mapped = mapThemeS3ToBuilder(parsed, defaultTenant);
                        setSettings(prev => ({ ...prev, ...mapped.settings }));
                        setColors(mapped.colors);
                        setFonts(mapped.fonts);
                        setContacts(mapped.contacts);
                        showToast('Configuração importada com sucesso!', 'success');
                      } catch (err) {
                        showToast('JSON inválido ou corrompido.', 'error');
                      }
                    }}
                    className="w-full mt-2 py-2 bg-slate-800 text-white rounded-lg text-[9px] font-bold cursor-pointer hover:bg-slate-700 border-0 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    Importar Texto Copiado
                  </button>
                </div>
              </div>
            </div>
            {renderWizardNextButton('s3config')}
          </SectionAccordion>

        </section>

        {/* ── RIGHT COLUMN: Preview ─────────────────────────────────────────── */}
        <section className="lg:col-span-6 bg-slate-100 flex flex-col lg:sticky lg:top-[6.5rem] lg:h-[calc(100vh-6.5rem)] z-20 overflow-hidden">

          {/* Preview bar */}
          <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between shrink-0 shadow-sm gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-800">Preview em Tempo Real</span>
            </div>

            {/* Device Switcher */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 shrink-0">
              {(['desktop', 'tablet', 'mobile'] as const).map(device => {
                const Icon = device === 'desktop' ? Monitor : device === 'tablet' ? Tablet : Smartphone
                const isActive = previewDevice === device
                return (
                  <button
                    key={device}
                    type="button"
                    onClick={() => {
                      setPreviewDevice(device)
                      setPreviewNavOpen(false)
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-bold uppercase transition-all cursor-pointer border-0 ${
                      isActive
                        ? 'bg-white text-slate-800 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800 bg-transparent'
                    }`}
                  >
                    <Icon size={10} />
                    <span className="hidden sm:inline">{device === 'desktop' ? 'Desktop' : device === 'tablet' ? 'Tablet' : 'Mobile'}</span>
                  </button>
                )
              })}
            </div>

            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full text-[8px] text-slate-500 font-mono">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.gold }} />
                {fonts.display}
              </div>
            </div>
          </div>

          {/* Sub-page tabs (scrollable) */}
          <div className="bg-white border-b border-slate-200 px-3 py-2 shrink-0 overflow-x-auto" ref={previewTabsRef}>
            <div className="flex gap-1.5 min-w-max">
              {activePreviewPages.map(page => (
                <button key={page.id} type="button" onClick={() => setActivePreviewTab(page.id)}
                  className={`px-3 py-1.5 rounded-full text-[9px] font-bold whitespace-nowrap transition-all cursor-pointer ${activePreviewTab === page.id ? 'shadow-sm' : 'text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100'}`}
                  style={activePreviewTab === page.id ? { backgroundColor: colors.gold, color: '#fff' } : {}}>
                  {page.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preview content */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-100 flex justify-center items-start">
            {previewDevice === 'mobile' ? (
              <div className="w-[325px] h-[640px] rounded-[36px] bg-slate-950 border-[10px] border-slate-950 shadow-2xl relative flex flex-col transition-all duration-300 ring-4 ring-slate-800/40 select-none overflow-hidden my-2 shrink-0">
                {/* Speaker & Camera Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-[16px] bg-slate-950 rounded-b-xl z-50 flex items-center justify-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-800/80" />
                  <div className="w-7 h-[3px] bg-slate-800/60 rounded-full" />
                </div>

                {/* Status Bar */}
                <div className="h-6 bg-white text-slate-800 text-[8px] font-semibold flex items-center justify-between px-5 pt-1.5 select-none shrink-0 border-b border-slate-100">
                  <span>09:41</span>
                  <div className="flex items-center gap-1">
                    <span>📶</span>
                    <span>5G</span>
                    <span>🔋</span>
                  </div>
                </div>

                {/* Phone screen content */}
                <div className="flex-1 overflow-y-auto bg-white relative animate-fade-in preview-container" style={previewStyles}>
                  <div style={{ fontFamily: fonts.sans }} className="pb-10 min-h-full">
                    {renderPreviewPage()}
                  </div>
                </div>

                {/* Home Indicator */}
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 bg-slate-800/40 rounded-full z-50 pointer-events-none" />
              </div>
            ) : previewDevice === 'tablet' ? (
              <div className="w-[540px] h-[740px] rounded-[28px] bg-slate-950 border-[12px] border-slate-950 shadow-2xl relative flex flex-col transition-all duration-300 ring-4 ring-slate-800/40 select-none overflow-hidden my-2 shrink-0">
                {/* Camera notch */}
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rounded-full z-50" />

                {/* Status Bar */}
                <div className="h-6 bg-white text-slate-800 text-[8px] font-semibold flex items-center justify-between px-6 pt-1 select-none shrink-0 border-b border-slate-100">
                  <span>Quarta-feira, 28 Mai</span>
                  <span>09:41</span>
                  <div className="flex items-center gap-1.5">
                    <span>📶</span>
                    <span>100%</span>
                    <span>🔋</span>
                  </div>
                </div>

                {/* Tablet screen content */}
                <div className="flex-1 overflow-y-auto bg-white relative animate-fade-in preview-container" style={previewStyles}>
                  <div style={{ fontFamily: fonts.sans }} className="pb-10 min-h-full">
                    {renderPreviewPage()}
                  </div>
                </div>

                {/* Home Indicator */}
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-slate-800/40 rounded-full z-50 pointer-events-none" />
              </div>
            ) : (
              /* Desktop (Default full layout) */
              <div
                style={previewStyles}
                className="w-full bg-white rounded-xl overflow-hidden shadow-xl border border-slate-200 transition-all duration-300 preview-container"
              >
                <div style={{ fontFamily: fonts.sans }}>
                  {renderPreviewPage()}
                </div>
              </div>
            )}
            {/* Scoped CSS Injector for Editor Preview */}
            {settings.customCss && (
              <style dangerouslySetInnerHTML={{ __html: `@scope (.preview-container) { ${settings.customCss} }` }} />
            )}
          </div>
        </section>

      </div>

      {/* Premium Toast Container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`pointer-events-auto px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-2.5 text-xs font-semibold animate-fade-in-up transition-all ${
              t.type === 'success'
                ? 'bg-slate-900 border-emerald-500/30 text-emerald-400'
                : t.type === 'error'
                  ? 'bg-slate-900 border-rose-500/30 text-rose-400'
                  : 'bg-slate-900 border-amber-500/30 text-amber-400'
            }`}
          >
            <span className="text-sm">
              {t.type === 'success' ? '✨' : t.type === 'error' ? '💥' : 'ℹ️'}
            </span>
            <span>{t.message}</span>
            <button
              type="button"
              onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
              className="ml-auto text-slate-500 hover:text-white bg-transparent border-0 cursor-pointer text-[10px]"
            >
              ×
            </button>
          </div>
        ))}
      </div>

    </div>
  )
}

// Alias for App.tsx compatibility
export const EsiSites = EditorSitePage
export default EditorSitePage
