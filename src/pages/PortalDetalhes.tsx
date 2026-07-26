import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  ArrowLeft, Building2, Search, CheckCircle2, XCircle, Copy, MapPin, Eye,
  AlertCircle, ChevronDown, List, LayoutGrid, SlidersHorizontal, User, UserPlus,
  Image as ImageIcon, Download, FileText, Code, Trash2, Check, LayoutTemplate,
  Info
, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { PropertyQuickView } from '@/components/properties/PropertyQuickView';

// Mock Portals
const portais = [
  { id: 'zap', name: 'ZAP Imóveis', active: true, color: 'bg-[#F26522]', icon: Building2 },
  { id: 'imovelweb', name: 'Imovelweb', active: true, color: 'bg-[#E3000F]', icon: Building2 },
  { id: 'vivareal', name: 'Viva Real', active: false, color: 'bg-[#003B70]', icon: Building2 },
  { id: 'orulo', name: 'Órulo', active: true, color: 'bg-[#7E3AF2]', icon: Building2 },
  { id: 'chavesnamao', name: 'Chaves na Mão', active: true, color: 'bg-[#FF9100]', icon: Building2 },
  { id: 'olx', name: 'OLX', active: false, color: 'bg-[#6E0AD6]', icon: Building2 },
  { id: 'ml', name: 'Mercado Livre', active: true, color: 'bg-[#FFE600] text-blue-900', icon: Building2 },
  { id: 'xmlevolves', name: 'XML Evolves', active: false, color: 'bg-primary', icon: Code, emBreve: true },
];

// Mock Properties
const mockImoveis = [
  {
    id: "1",
    cod: "AP002",
    codAlt: "A2-ZAP",
    titulo: "Casa em Centro",
    tipo: "Terreno",
    endereco: "Rua Exemplo, 20",
    bairro: "Centro",
    cidade: "Rio de Janeiro",
    valor: "R$ 1212081",
    dorms: 4,
    suites: 0,
    vagas: 2,
    area: "201m²",
    corretor: "João Silva",
    status: "busca",
    adType: "destaque",
    imagem: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop",
    validation: {
      fotos: false,
      video: true,
      tour: false,
      desc: true,
      completo: true
    }
  },
  {
    id: "2",
    cod: "AP003",
    codAlt: "A3-ZAP",
    titulo: "Terreno em Centro",
    tipo: "Cobertura",
    endereco: "Rua Exemplo, 30",
    bairro: "Vila Nova Conceição",
    cidade: "Florianópolis",
    valor: "R$ 1365788",
    dorms: 1,
    suites: 1,
    vagas: 0,
    area: "137m²",
    corretor: "Ana Costa",
    status: "busca",
    adType: "destaque",
    imagem: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: true,
      tour: false,
      desc: true,
      completo: true
    }
  },
  {
    id: "3",
    cod: "AP004",
    codAlt: "A4-ZAP",
    titulo: "Terreno em Centro",
    tipo: "Casa",
    endereco: "Rua Exemplo, 40",
    bairro: "Jardins",
    cidade: "Rio de Janeiro",
    valor: "R$ 661441",
    dorms: 3,
    suites: 1,
    vagas: 1,
    area: "230m²",
    corretor: "Carlos Andrade",
    status: "busca",
    adType: "normal",
    imagem: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: false,
      tour: true,
      desc: true,
      completo: false
    }
  },
  {
    id: "4",
    cod: "AP005",
    codAlt: "A5-ZAP",
    titulo: "Sobrado em Moema",
    tipo: "Terreno",
    endereco: "Rua Exemplo, 50",
    bairro: "Moema",
    cidade: "Belo Horizonte",
    valor: "R$ 598864",
    dorms: 3,
    suites: 1,
    vagas: 2,
    area: "159m²",
    corretor: "Carlos Andrade",
    status: "busca",
    adType: "super_destaque",
    imagem: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: false,
      tour: true,
      desc: true,
      completo: true
    }
  },
  {
    id: "5",
    cod: "AP006",
    codAlt: "A6-ZAP",
    titulo: "Terreno em Vila Nova Conceição",
    tipo: "Sobrado",
    endereco: "Rua Exemplo, 60",
    bairro: "Jardins",
    cidade: "Rio de Janeiro",
    valor: "R$ 990154",
    dorms: 3,
    suites: 0,
    vagas: 0,
    area: "192m²",
    corretor: "Carlos Andrade",
    status: "busca",
    adType: "super_destaque",
    imagem: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: true,
      tour: true,
      desc: false,
      completo: true
    }
  },
  {
    id: "6",
    cod: "AP007",
    codAlt: "A7-ZAP",
    titulo: "Apartamento em Barra da Tijuca",
    tipo: "Terreno",
    endereco: "Rua Exemplo, 70",
    bairro: "Jardins",
    cidade: "São Paulo",
    valor: "R$ 1944379",
    dorms: 1,
    suites: 0,
    vagas: 2,
    area: "107m²",
    corretor: "Carlos Andrade",
    status: "busca",
    adType: "destaque",
    imagem: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop",
    validation: {
      fotos: false,
      video: true,
      tour: true,
      desc: false,
      completo: true
    }
  },
  {
    id: "7",
    cod: "AP008",
    codAlt: "A8-ZAP",
    titulo: "Cobertura em Moema",
    tipo: "Sobrado",
    endereco: "Rua Exemplo, 80",
    bairro: "Moema",
    cidade: "Rio de Janeiro",
    valor: "R$ 781300",
    dorms: 3,
    suites: 1,
    vagas: 2,
    area: "219m²",
    corretor: "Roberto Almeida",
    status: "busca",
    adType: "normal",
    imagem: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: true,
      tour: true,
      desc: true,
      completo: true
    }
  },
  {
    id: "8",
    cod: "AP009",
    codAlt: "A9-ZAP",
    titulo: "Cobertura em Jardins",
    tipo: "Sobrado",
    endereco: "Rua Exemplo, 90",
    bairro: "Vila Nova Conceição",
    cidade: "Belo Horizonte",
    valor: "R$ 1555436",
    dorms: 3,
    suites: 1,
    vagas: 1,
    area: "120m²",
    corretor: "Carlos Andrade",
    status: "busca",
    adType: "super_destaque",
    imagem: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: true,
      tour: false,
      desc: true,
      completo: true
    }
  },
  {
    id: "9",
    cod: "AP0010",
    codAlt: "A10-ZAP",
    titulo: "Terreno em Barra da Tijuca",
    tipo: "Terreno",
    endereco: "Rua Exemplo, 100",
    bairro: "Barra da Tijuca",
    cidade: "Rio de Janeiro",
    valor: "R$ 1861362",
    dorms: 3,
    suites: 0,
    vagas: 2,
    area: "220m²",
    corretor: "Roberto Almeida",
    status: "busca",
    adType: "super_destaque",
    imagem: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: true,
      tour: true,
      desc: false,
      completo: false
    }
  },
  {
    id: "10",
    cod: "AP0011",
    codAlt: "A11-ZAP",
    titulo: "Terreno em Pinheiros",
    tipo: "Terreno",
    endereco: "Rua Exemplo, 110",
    bairro: "Barra da Tijuca",
    cidade: "Florianópolis",
    valor: "R$ 2292147",
    dorms: 3,
    suites: 0,
    vagas: 2,
    area: "206m²",
    corretor: "Maria Fernandes",
    status: "busca",
    adType: "normal",
    imagem: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
    validation: {
      fotos: false,
      video: true,
      tour: true,
      desc: false,
      completo: false
    }
  },
  {
    id: "11",
    cod: "AP0012",
    codAlt: "A12-ZAP",
    titulo: "Sobrado em Barra da Tijuca",
    tipo: "Cobertura",
    endereco: "Rua Exemplo, 120",
    bairro: "Pinheiros",
    cidade: "Florianópolis",
    valor: "R$ 367367",
    dorms: 4,
    suites: 1,
    vagas: 1,
    area: "112m²",
    corretor: "Roberto Almeida",
    status: "busca",
    adType: "destaque",
    imagem: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop",
    validation: {
      fotos: false,
      video: true,
      tour: false,
      desc: false,
      completo: false
    }
  },
  {
    id: "12",
    cod: "AP0013",
    codAlt: "A13-ZAP",
    titulo: "Terreno em Centro",
    tipo: "Sobrado",
    endereco: "Rua Exemplo, 130",
    bairro: "Pinheiros",
    cidade: "Florianópolis",
    valor: "R$ 711645",
    dorms: 1,
    suites: 1,
    vagas: 2,
    area: "151m²",
    corretor: "Maria Fernandes",
    status: "busca",
    adType: "destaque",
    imagem: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
    validation: {
      fotos: false,
      video: true,
      tour: true,
      desc: true,
      completo: true
    }
  },
  {
    id: "13",
    cod: "AP0014",
    codAlt: "A14-ZAP",
    titulo: "Cobertura em Vila Nova Conceição",
    tipo: "Cobertura",
    endereco: "Rua Exemplo, 140",
    bairro: "Vila Nova Conceição",
    cidade: "São Paulo",
    valor: "R$ 1128229",
    dorms: 3,
    suites: 0,
    vagas: 0,
    area: "150m²",
    corretor: "Roberto Almeida",
    status: "busca",
    adType: "super_destaque",
    imagem: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: true,
      tour: true,
      desc: false,
      completo: false
    }
  },
  {
    id: "14",
    cod: "AP0015",
    codAlt: "A15-ZAP",
    titulo: "Cobertura em Moema",
    tipo: "Apartamento",
    endereco: "Rua Exemplo, 150",
    bairro: "Jardins",
    cidade: "Rio de Janeiro",
    valor: "R$ 1701007",
    dorms: 1,
    suites: 1,
    vagas: 0,
    area: "98m²",
    corretor: "Roberto Almeida",
    status: "busca",
    adType: "normal",
    imagem: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: true,
      tour: true,
      desc: true,
      completo: true
    }
  },
  {
    id: "15",
    cod: "AP0016",
    codAlt: "A16-ZAP",
    titulo: "Sobrado em Vila Nova Conceição",
    tipo: "Apartamento",
    endereco: "Rua Exemplo, 160",
    bairro: "Barra da Tijuca",
    cidade: "Rio de Janeiro",
    valor: "R$ 896363",
    dorms: 1,
    suites: 1,
    vagas: 1,
    area: "132m²",
    corretor: "Roberto Almeida",
    status: "busca",
    adType: "normal",
    imagem: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop",
    validation: {
      fotos: false,
      video: true,
      tour: true,
      desc: false,
      completo: true
    }
  },
  {
    id: "16",
    cod: "AP0017",
    codAlt: "A17-ZAP",
    titulo: "Cobertura em Centro",
    tipo: "Casa",
    endereco: "Rua Exemplo, 170",
    bairro: "Barra da Tijuca",
    cidade: "Florianópolis",
    valor: "R$ 1308000",
    dorms: 4,
    suites: 1,
    vagas: 1,
    area: "197m²",
    corretor: "Carlos Andrade",
    status: "busca",
    adType: "destaque",
    imagem: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: false,
      tour: true,
      desc: true,
      completo: true
    }
  },
  {
    id: "17",
    cod: "AP0018",
    codAlt: "A18-ZAP",
    titulo: "Casa em Moema",
    tipo: "Casa",
    endereco: "Rua Exemplo, 180",
    bairro: "Moema",
    cidade: "São Paulo",
    valor: "R$ 1765609",
    dorms: 1,
    suites: 0,
    vagas: 2,
    area: "104m²",
    corretor: "Maria Fernandes",
    status: "busca",
    adType: "normal",
    imagem: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: true,
      tour: true,
      desc: true,
      completo: true
    }
  },
  {
    id: "18",
    cod: "AP0019",
    codAlt: "A19-ZAP",
    titulo: "Casa em Vila Nova Conceição",
    tipo: "Sobrado",
    endereco: "Rua Exemplo, 190",
    bairro: "Barra da Tijuca",
    cidade: "Curitiba",
    valor: "R$ 626146",
    dorms: 1,
    suites: 0,
    vagas: 1,
    area: "68m²",
    corretor: "Roberto Almeida",
    status: "busca",
    adType: "normal",
    imagem: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: false,
      tour: true,
      desc: true,
      completo: false
    }
  },
  {
    id: "19",
    cod: "AP0020",
    codAlt: "A20-ZAP",
    titulo: "Apartamento em Jardins",
    tipo: "Sobrado",
    endereco: "Rua Exemplo, 200",
    bairro: "Pinheiros",
    cidade: "Curitiba",
    valor: "R$ 1977099",
    dorms: 4,
    suites: 0,
    vagas: 2,
    area: "141m²",
    corretor: "Roberto Almeida",
    status: "busca",
    adType: "super_destaque",
    imagem: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: false,
      tour: true,
      desc: true,
      completo: true
    }
  },
  {
    id: "20",
    cod: "AP0021",
    codAlt: "A21-ZAP",
    titulo: "Terreno em Centro",
    tipo: "Sobrado",
    endereco: "Rua Exemplo, 210",
    bairro: "Vila Nova Conceição",
    cidade: "Curitiba",
    valor: "R$ 706403",
    dorms: 3,
    suites: 0,
    vagas: 1,
    area: "84m²",
    corretor: "Carlos Andrade",
    status: "busca",
    adType: "normal",
    imagem: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: true,
      tour: false,
      desc: true,
      completo: false
    }
  },
  {
    id: "21",
    cod: "AP0022",
    codAlt: "A22-ZAP",
    titulo: "Terreno em Pinheiros",
    tipo: "Apartamento",
    endereco: "Rua Exemplo, 220",
    bairro: "Barra da Tijuca",
    cidade: "Belo Horizonte",
    valor: "R$ 2051829",
    dorms: 1,
    suites: 1,
    vagas: 2,
    area: "145m²",
    corretor: "Roberto Almeida",
    status: "pre-selecionado",
    adType: "normal",
    imagem: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop",
    validation: {
      fotos: false,
      video: true,
      tour: true,
      desc: true,
      completo: true
    }
  },
  {
    id: "22",
    cod: "AP0023",
    codAlt: "A23-ZAP",
    titulo: "Sobrado em Vila Nova Conceição",
    tipo: "Sobrado",
    endereco: "Rua Exemplo, 230",
    bairro: "Pinheiros",
    cidade: "São Paulo",
    valor: "R$ 2102087",
    dorms: 4,
    suites: 0,
    vagas: 0,
    area: "57m²",
    corretor: "Maria Fernandes",
    status: "pre-selecionado",
    adType: "normal",
    imagem: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop",
    validation: {
      fotos: false,
      video: false,
      tour: false,
      desc: true,
      completo: true
    }
  },
  {
    id: "23",
    cod: "AP0024",
    codAlt: "A24-ZAP",
    titulo: "Apartamento em Jardins",
    tipo: "Sobrado",
    endereco: "Rua Exemplo, 240",
    bairro: "Centro",
    cidade: "Rio de Janeiro",
    valor: "R$ 2200128",
    dorms: 1,
    suites: 0,
    vagas: 2,
    area: "183m²",
    corretor: "Maria Fernandes",
    status: "pre-selecionado",
    adType: "normal",
    imagem: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: true,
      tour: true,
      desc: false,
      completo: true
    }
  },
  {
    id: "24",
    cod: "AP0025",
    codAlt: "A25-ZAP",
    titulo: "Apartamento em Pinheiros",
    tipo: "Cobertura",
    endereco: "Rua Exemplo, 250",
    bairro: "Moema",
    cidade: "São Paulo",
    valor: "R$ 1931565",
    dorms: 2,
    suites: 1,
    vagas: 0,
    area: "142m²",
    corretor: "João Silva",
    status: "pre-selecionado",
    adType: "normal",
    imagem: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: true,
      tour: true,
      desc: true,
      completo: false
    }
  },
  {
    id: "25",
    cod: "AP0026",
    codAlt: "A26-ZAP",
    titulo: "Terreno em Pinheiros",
    tipo: "Cobertura",
    endereco: "Rua Exemplo, 260",
    bairro: "Moema",
    cidade: "São Paulo",
    valor: "R$ 1775836",
    dorms: 2,
    suites: 0,
    vagas: 0,
    area: "66m²",
    corretor: "Maria Fernandes",
    status: "pre-selecionado",
    adType: "normal",
    imagem: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: true,
      tour: true,
      desc: true,
      completo: true
    }
  },
  {
    id: "26",
    cod: "AP0027",
    codAlt: "A27-ZAP",
    titulo: "Cobertura em Moema",
    tipo: "Apartamento",
    endereco: "Rua Exemplo, 270",
    bairro: "Centro",
    cidade: "Florianópolis",
    valor: "R$ 757451",
    dorms: 3,
    suites: 0,
    vagas: 1,
    area: "225m²",
    corretor: "Roberto Almeida",
    status: "pre-selecionado",
    adType: "destaque",
    imagem: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: false,
      tour: true,
      desc: true,
      completo: true
    }
  },
  {
    id: "27",
    cod: "AP0028",
    codAlt: "A28-ZAP",
    titulo: "Terreno em Moema",
    tipo: "Cobertura",
    endereco: "Rua Exemplo, 280",
    bairro: "Pinheiros",
    cidade: "Florianópolis",
    valor: "R$ 365348",
    dorms: 4,
    suites: 0,
    vagas: 2,
    area: "41m²",
    corretor: "Carlos Andrade",
    status: "pre-selecionado",
    adType: "super_destaque",
    imagem: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: false,
      tour: true,
      desc: true,
      completo: true
    }
  },
  {
    id: "28",
    cod: "AP0029",
    codAlt: "A29-ZAP",
    titulo: "Sobrado em Vila Nova Conceição",
    tipo: "Terreno",
    endereco: "Rua Exemplo, 290",
    bairro: "Jardins",
    cidade: "Rio de Janeiro",
    valor: "R$ 1264415",
    dorms: 1,
    suites: 0,
    vagas: 1,
    area: "58m²",
    corretor: "Carlos Andrade",
    status: "pre-selecionado",
    adType: "destaque",
    imagem: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: true,
      tour: true,
      desc: true,
      completo: false
    }
  },
  {
    id: "29",
    cod: "AP0030",
    codAlt: "A30-ZAP",
    titulo: "Casa em Pinheiros",
    tipo: "Casa",
    endereco: "Rua Exemplo, 300",
    bairro: "Centro",
    cidade: "São Paulo",
    valor: "R$ 1867101",
    dorms: 1,
    suites: 1,
    vagas: 1,
    area: "187m²",
    corretor: "João Silva",
    status: "pre-selecionado",
    adType: "super_destaque",
    imagem: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: true,
      tour: false,
      desc: true,
      completo: true
    }
  },
  {
    id: "30",
    cod: "AP0031",
    codAlt: "A31-ZAP",
    titulo: "Casa em Vila Nova Conceição",
    tipo: "Terreno",
    endereco: "Rua Exemplo, 310",
    bairro: "Jardins",
    cidade: "Curitiba",
    valor: "R$ 1109634",
    dorms: 3,
    suites: 1,
    vagas: 1,
    area: "225m²",
    corretor: "Maria Fernandes",
    status: "pre-selecionado",
    adType: "normal",
    imagem: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: false,
      tour: true,
      desc: false,
      completo: true
    }
  },
  {
    id: "31",
    cod: "AP0032",
    codAlt: "A32-ZAP",
    titulo: "Sobrado em Jardins",
    tipo: "Casa",
    endereco: "Rua Exemplo, 320",
    bairro: "Centro",
    cidade: "Belo Horizonte",
    valor: "R$ 1732193",
    dorms: 4,
    suites: 1,
    vagas: 2,
    area: "145m²",
    corretor: "Carlos Andrade",
    status: "carga",
    adType: "normal",
    imagem: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: true,
      tour: false,
      desc: true,
      completo: true
    }
  },
  {
    id: "32",
    cod: "AP0033",
    codAlt: "A33-ZAP",
    titulo: "Sobrado em Barra da Tijuca",
    tipo: "Cobertura",
    endereco: "Rua Exemplo, 330",
    bairro: "Barra da Tijuca",
    cidade: "São Paulo",
    valor: "R$ 781980",
    dorms: 2,
    suites: 1,
    vagas: 1,
    area: "178m²",
    corretor: "Carlos Andrade",
    status: "carga",
    adType: "destaque",
    imagem: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: true,
      tour: false,
      desc: true,
      completo: true
    }
  },
  {
    id: "33",
    cod: "AP0034",
    codAlt: "A34-ZAP",
    titulo: "Casa em Pinheiros",
    tipo: "Terreno",
    endereco: "Rua Exemplo, 340",
    bairro: "Moema",
    cidade: "Belo Horizonte",
    valor: "R$ 1501698",
    dorms: 2,
    suites: 1,
    vagas: 2,
    area: "83m²",
    corretor: "Carlos Andrade",
    status: "carga",
    adType: "super_destaque",
    imagem: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: true,
      tour: true,
      desc: true,
      completo: true
    }
  },
  {
    id: "34",
    cod: "AP0035",
    codAlt: "A35-ZAP",
    titulo: "Terreno em Pinheiros",
    tipo: "Terreno",
    endereco: "Rua Exemplo, 350",
    bairro: "Moema",
    cidade: "Belo Horizonte",
    valor: "R$ 492618",
    dorms: 1,
    suites: 0,
    vagas: 0,
    area: "201m²",
    corretor: "Carlos Andrade",
    status: "carga",
    adType: "destaque",
    imagem: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: true,
      tour: true,
      desc: true,
      completo: true
    }
  },
  {
    id: "35",
    cod: "AP0036",
    codAlt: "A36-ZAP",
    titulo: "Sobrado em Vila Nova Conceição",
    tipo: "Sobrado",
    endereco: "Rua Exemplo, 360",
    bairro: "Centro",
    cidade: "Florianópolis",
    valor: "R$ 2003008",
    dorms: 3,
    suites: 1,
    vagas: 0,
    area: "134m²",
    corretor: "Carlos Andrade",
    status: "carga",
    adType: "normal",
    imagem: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: true,
      tour: true,
      desc: true,
      completo: true
    }
  },
  {
    id: "36",
    cod: "AP0037",
    codAlt: "A37-ZAP",
    titulo: "Apartamento em Centro",
    tipo: "Sobrado",
    endereco: "Rua Exemplo, 370",
    bairro: "Barra da Tijuca",
    cidade: "Curitiba",
    valor: "R$ 1629317",
    dorms: 2,
    suites: 1,
    vagas: 0,
    area: "232m²",
    corretor: "Ana Costa",
    status: "carga",
    adType: "super_destaque",
    imagem: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: true,
      tour: true,
      desc: true,
      completo: true
    }
  },
  {
    id: "37",
    cod: "AP0038",
    codAlt: "A38-ZAP",
    titulo: "Apartamento em Moema",
    tipo: "Terreno",
    endereco: "Rua Exemplo, 380",
    bairro: "Barra da Tijuca",
    cidade: "Belo Horizonte",
    valor: "R$ 2198498",
    dorms: 3,
    suites: 0,
    vagas: 0,
    area: "141m²",
    corretor: "Ana Costa",
    status: "carga",
    adType: "normal",
    imagem: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: true,
      tour: false,
      desc: true,
      completo: true
    }
  },
  {
    id: "38",
    cod: "AP0039",
    codAlt: "A39-ZAP",
    titulo: "Sobrado em Vila Nova Conceição",
    tipo: "Sobrado",
    endereco: "Rua Exemplo, 390",
    bairro: "Centro",
    cidade: "Rio de Janeiro",
    valor: "R$ 1935836",
    dorms: 1,
    suites: 1,
    vagas: 0,
    area: "119m²",
    corretor: "Ana Costa",
    status: "carga",
    adType: "destaque",
    imagem: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: true,
      tour: false,
      desc: true,
      completo: true
    }
  },
  {
    id: "39",
    cod: "AP0040",
    codAlt: "A40-ZAP",
    titulo: "Casa em Moema",
    tipo: "Sobrado",
    endereco: "Rua Exemplo, 400",
    bairro: "Vila Nova Conceição",
    cidade: "Rio de Janeiro",
    valor: "R$ 769609",
    dorms: 2,
    suites: 0,
    vagas: 2,
    area: "75m²",
    corretor: "Maria Fernandes",
    status: "carga",
    adType: "normal",
    imagem: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: false,
      tour: true,
      desc: true,
      completo: true
    }
  },
  {
    id: "40",
    cod: "AP0041",
    codAlt: "A41-ZAP",
    titulo: "Cobertura em Vila Nova Conceição",
    tipo: "Cobertura",
    endereco: "Rua Exemplo, 410",
    bairro: "Pinheiros",
    cidade: "Florianópolis",
    valor: "R$ 1556482",
    dorms: 1,
    suites: 0,
    vagas: 1,
    area: "153m²",
    corretor: "Roberto Almeida",
    status: "carga",
    adType: "destaque",
    imagem: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: false,
      tour: true,
      desc: true,
      completo: true
    }
  },
  {
    id: "41",
    cod: "AP0042",
    codAlt: "A42-ZAP",
    titulo: "Sobrado em Moema",
    tipo: "Casa",
    endereco: "Rua Exemplo, 420",
    bairro: "Barra da Tijuca",
    cidade: "Belo Horizonte",
    valor: "R$ 434585",
    dorms: 1,
    suites: 1,
    vagas: 0,
    area: "145m²",
    corretor: "Roberto Almeida",
    status: "carga",
    adType: "destaque",
    imagem: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: false,
      tour: true,
      desc: true,
      completo: true
    }
  },
  {
    id: "42",
    cod: "AP0043",
    codAlt: "A43-ZAP",
    titulo: "Apartamento em Pinheiros",
    tipo: "Sobrado",
    endereco: "Rua Exemplo, 430",
    bairro: "Jardins",
    cidade: "Curitiba",
    valor: "R$ 1414471",
    dorms: 4,
    suites: 1,
    vagas: 0,
    area: "43m²",
    corretor: "Roberto Almeida",
    status: "carga",
    adType: "destaque",
    imagem: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: false,
      tour: true,
      desc: true,
      completo: true
    }
  },
  {
    id: "43",
    cod: "AP0044",
    codAlt: "A44-ZAP",
    titulo: "Apartamento em Jardins",
    tipo: "Sobrado",
    endereco: "Rua Exemplo, 440",
    bairro: "Moema",
    cidade: "Curitiba",
    valor: "R$ 1932706",
    dorms: 4,
    suites: 0,
    vagas: 2,
    area: "96m²",
    corretor: "Maria Fernandes",
    status: "carga",
    adType: "super_destaque",
    imagem: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: true,
      tour: true,
      desc: true,
      completo: true
    }
  },
  {
    id: "44",
    cod: "AP0045",
    codAlt: "A45-ZAP",
    titulo: "Terreno em Moema",
    tipo: "Terreno",
    endereco: "Rua Exemplo, 450",
    bairro: "Vila Nova Conceição",
    cidade: "Belo Horizonte",
    valor: "R$ 770631",
    dorms: 3,
    suites: 1,
    vagas: 2,
    area: "222m²",
    corretor: "Carlos Andrade",
    status: "carga",
    adType: "normal",
    imagem: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: true,
      tour: false,
      desc: true,
      completo: true
    }
  },
  {
    id: "45",
    cod: "AP0046",
    codAlt: "A46-ZAP",
    titulo: "Casa em Centro",
    tipo: "Sobrado",
    endereco: "Rua Exemplo, 460",
    bairro: "Moema",
    cidade: "Rio de Janeiro",
    valor: "R$ 324298",
    dorms: 2,
    suites: 1,
    vagas: 2,
    area: "218m²",
    corretor: "Maria Fernandes",
    status: "carga",
    adType: "destaque",
    imagem: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: false,
      tour: true,
      desc: true,
      completo: true
    }
  },
  {
    id: "46",
    cod: "AP0047",
    codAlt: "A47-ZAP",
    titulo: "Terreno em Centro",
    tipo: "Apartamento",
    endereco: "Rua Exemplo, 470",
    bairro: "Centro",
    cidade: "São Paulo",
    valor: "R$ 627617",
    dorms: 4,
    suites: 1,
    vagas: 0,
    area: "121m²",
    corretor: "Carlos Andrade",
    status: "carga",
    adType: "normal",
    imagem: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: true,
      tour: true,
      desc: true,
      completo: true
    }
  },
  {
    id: "47",
    cod: "AP0048",
    codAlt: "A48-ZAP",
    titulo: "Cobertura em Barra da Tijuca",
    tipo: "Terreno",
    endereco: "Rua Exemplo, 480",
    bairro: "Barra da Tijuca",
    cidade: "Florianópolis",
    valor: "R$ 1450304",
    dorms: 1,
    suites: 0,
    vagas: 2,
    area: "89m²",
    corretor: "Maria Fernandes",
    status: "carga",
    adType: "destaque",
    imagem: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: false,
      tour: true,
      desc: true,
      completo: true
    }
  },
  {
    id: "48",
    cod: "AP0049",
    codAlt: "A49-ZAP",
    titulo: "Casa em Barra da Tijuca",
    tipo: "Casa",
    endereco: "Rua Exemplo, 490",
    bairro: "Vila Nova Conceição",
    cidade: "Rio de Janeiro",
    valor: "R$ 1328292",
    dorms: 2,
    suites: 0,
    vagas: 2,
    area: "87m²",
    corretor: "Carlos Andrade",
    status: "carga",
    adType: "destaque",
    imagem: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: false,
      tour: false,
      desc: true,
      completo: true
    }
  },
  {
    id: "49",
    cod: "AP0050",
    codAlt: "A50-ZAP",
    titulo: "Sobrado em Jardins",
    tipo: "Sobrado",
    endereco: "Rua Exemplo, 500",
    bairro: "Vila Nova Conceição",
    cidade: "Florianópolis",
    valor: "R$ 1186752",
    dorms: 3,
    suites: 0,
    vagas: 1,
    area: "103m²",
    corretor: "Roberto Almeida",
    status: "carga",
    adType: "destaque",
    imagem: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: true,
      tour: true,
      desc: true,
      completo: true
    }
  },
  {
    id: "50",
    cod: "AP0051",
    codAlt: "A51-ZAP",
    titulo: "Apartamento em Moema",
    tipo: "Casa",
    endereco: "Rua Exemplo, 510",
    bairro: "Vila Nova Conceição",
    cidade: "São Paulo",
    valor: "R$ 650933",
    dorms: 3,
    suites: 0,
    vagas: 1,
    area: "169m²",
    corretor: "Carlos Andrade",
    status: "carga",
    adType: "destaque",
    imagem: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: true,
      tour: true,
      desc: true,
      completo: true
    }
  },
  {
    id: "51",
    cod: "AP0052",
    codAlt: "A52-ZAP",
    titulo: "Apartamento em Barra da Tijuca",
    tipo: "Casa",
    endereco: "Rua Exemplo, 520",
    bairro: "Jardins",
    cidade: "São Paulo",
    valor: "R$ 2263683",
    dorms: 2,
    suites: 0,
    vagas: 2,
    area: "58m²",
    corretor: "João Silva",
    status: "carga",
    adType: "super_destaque",
    imagem: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: true,
      tour: true,
      desc: true,
      completo: true
    }
  },
  {
    id: "52",
    cod: "AP0053",
    codAlt: "A53-ZAP",
    titulo: "Sobrado em Vila Nova Conceição",
    tipo: "Casa",
    endereco: "Rua Exemplo, 530",
    bairro: "Jardins",
    cidade: "Belo Horizonte",
    valor: "R$ 1065432",
    dorms: 3,
    suites: 1,
    vagas: 1,
    area: "115m²",
    corretor: "Roberto Almeida",
    status: "carga",
    adType: "super_destaque",
    imagem: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: true,
      tour: true,
      desc: true,
      completo: true
    }
  },
  {
    id: "53",
    cod: "AP0054",
    codAlt: "A54-ZAP",
    titulo: "Casa em Jardins",
    tipo: "Sobrado",
    endereco: "Rua Exemplo, 540",
    bairro: "Jardins",
    cidade: "Florianópolis",
    valor: "R$ 2128274",
    dorms: 2,
    suites: 0,
    vagas: 2,
    area: "218m²",
    corretor: "Ana Costa",
    status: "carga",
    adType: "normal",
    imagem: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: false,
      tour: true,
      desc: true,
      completo: true
    }
  },
  {
    id: "54",
    cod: "AP0055",
    codAlt: "A55-ZAP",
    titulo: "Terreno em Barra da Tijuca",
    tipo: "Casa",
    endereco: "Rua Exemplo, 550",
    bairro: "Barra da Tijuca",
    cidade: "São Paulo",
    valor: "R$ 1246612",
    dorms: 2,
    suites: 0,
    vagas: 1,
    area: "72m²",
    corretor: "João Silva",
    status: "carga",
    adType: "super_destaque",
    imagem: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: true,
      tour: true,
      desc: true,
      completo: true
    }
  },
  {
    id: "55",
    cod: "AP0056",
    codAlt: "A56-ZAP",
    titulo: "Casa em Pinheiros",
    tipo: "Apartamento",
    endereco: "Rua Exemplo, 560",
    bairro: "Moema",
    cidade: "São Paulo",
    valor: "R$ 1917129",
    dorms: 4,
    suites: 1,
    vagas: 2,
    area: "149m²",
    corretor: "Carlos Andrade",
    status: "carga",
    adType: "super_destaque",
    imagem: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: true,
      tour: true,
      desc: true,
      completo: true
    }
  },
  {
    id: "56",
    cod: "AP0057",
    codAlt: "A57-ZAP",
    titulo: "Sobrado em Moema",
    tipo: "Casa",
    endereco: "Rua Exemplo, 570",
    bairro: "Pinheiros",
    cidade: "Curitiba",
    valor: "R$ 2008013",
    dorms: 1,
    suites: 1,
    vagas: 0,
    area: "49m²",
    corretor: "Ana Costa",
    status: "carga",
    adType: "normal",
    imagem: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: true,
      tour: false,
      desc: true,
      completo: true
    }
  },
  {
    id: "57",
    cod: "AP0058",
    codAlt: "A58-ZAP",
    titulo: "Cobertura em Centro",
    tipo: "Cobertura",
    endereco: "Rua Exemplo, 580",
    bairro: "Jardins",
    cidade: "Rio de Janeiro",
    valor: "R$ 1965935",
    dorms: 3,
    suites: 0,
    vagas: 2,
    area: "168m²",
    corretor: "João Silva",
    status: "carga",
    adType: "destaque",
    imagem: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: true,
      tour: false,
      desc: true,
      completo: true
    }
  },
  {
    id: "58",
    cod: "AP0059",
    codAlt: "A59-ZAP",
    titulo: "Casa em Centro",
    tipo: "Apartamento",
    endereco: "Rua Exemplo, 590",
    bairro: "Centro",
    cidade: "Rio de Janeiro",
    valor: "R$ 474116",
    dorms: 3,
    suites: 1,
    vagas: 0,
    area: "201m²",
    corretor: "João Silva",
    status: "carga",
    adType: "destaque",
    imagem: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: false,
      tour: false,
      desc: true,
      completo: true
    }
  },
  {
    id: "59",
    cod: "AP0060",
    codAlt: "A60-ZAP",
    titulo: "Sobrado em Barra da Tijuca",
    tipo: "Cobertura",
    endereco: "Rua Exemplo, 600",
    bairro: "Moema",
    cidade: "Florianópolis",
    valor: "R$ 1151885",
    dorms: 2,
    suites: 1,
    vagas: 0,
    area: "205m²",
    corretor: "João Silva",
    status: "carga",
    adType: "normal",
    imagem: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: true,
      tour: true,
      desc: true,
      completo: true
    }
  },
  {
    id: "60",
    cod: "AP0061",
    codAlt: "A61-ZAP",
    titulo: "Terreno em Centro",
    tipo: "Apartamento",
    endereco: "Rua Exemplo, 610",
    bairro: "Pinheiros",
    cidade: "Florianópolis",
    valor: "R$ 1043902",
    dorms: 1,
    suites: 0,
    vagas: 1,
    area: "164m²",
    corretor: "Carlos Andrade",
    status: "carga",
    adType: "super_destaque",
    imagem: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop",
    validation: {
      fotos: true,
      video: true,
      tour: false,
      desc: true,
      completo: true
    }
  }
];

export default function PortalDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const portalAtual = portais.find(p => p.id === id) || portais[0];

  // States
  const [activeTab, setActiveTab] = useState('busca');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProps, setSelectedProps] = useState<string[]>([]);
  const [selectedPropDetails, setSelectedPropDetails] = useState<any>(null);
  
  // Config States
  const [mapOption, setMapOption] = useState('exata');
  const [cotaPorCorretor, setCotaPorCorretor] = useState(false);
  const [corretoresList, setCorretoresList] = useState([
    { id: 1, name: 'João Silva', simples: 25, destaque: 5, sdestaque: 2 },
    { id: 2, name: 'Maria Fernandes', simples: 30, destaque: 10, sdestaque: 3 },
    { id: 3, name: 'Carlos Andrade', simples: 20, destaque: 4, sdestaque: 1 }
  ]);
  const [addBrokerOpen, setAddBrokerOpen] = useState(false);
  const [newBrokerIds, setNewBrokerIds] = useState<string[]>([]);
  const [brokerToRemove, setBrokerToRemove] = useState<number | null>(null);
  const [brokerToReceive, setBrokerToReceive] = useState<string>('');
  const [imoveisList, setImoveisList] = useState(mockImoveis);

  const moveProperty = (ids: string[], targetStatus: string) => {
    setImoveisList(prev => prev.map(imovel => 
      ids.includes(imovel.id) ? { ...imovel, status: targetStatus } : imovel
    ));
    setSelectedProps([]);
    toast({ title: 'Ação realizada', description: `${ids.length} imóvel(is) movido(s) com sucesso.` });
  };

  const availableBrokers = [
    { id: '4', name: 'Roberto Almeida' },
    { id: '5', name: 'Ana Costa' },
    { id: '6', name: 'Paulo Santos' }
  ].filter(b => !corretoresList.find(c => c.name === b.name));

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`https://xml.microsistec.com.br/${portalAtual.id}/9f3c2a1b.xml`);
    toast({ title: 'Link copiado!', description: 'O link do XML foi copiado para sua área de transferência.' });
  };

  const handleRedistribute = () => {
    const totalSimples = 120;
    const totalDestaques = 30;
    const totalSDestaques = 10;
    const qty = corretoresList.length;
    
    setCorretoresList(corretoresList.map(c => ({
      ...c,
      simples: Math.floor(totalSimples / qty),
      destaque: Math.floor(totalDestaques / qty),
      sdestaque: Math.floor(totalSDestaques / qty)
    })));

    toast({ title: 'Cotas Redistribuídas', description: 'As cotas foram divididas igualmente entre os corretores.' });
  };

  const handleAddBroker = () => {
    const brokersToAdd = availableBrokers.filter(x => newBrokerIds.includes(x.id));
    if (brokersToAdd.length > 0) {
      const added = brokersToAdd.map((b, idx) => ({ id: Date.now() + idx, name: b.name, simples: 0, destaque: 0, sdestaque: 0 }));
      setCorretoresList([...corretoresList, ...added]);
      setAddBrokerOpen(false);
      setNewBrokerIds([]);
      toast({ title: 'Corretores adicionados', description: `${brokersToAdd.length} corretor(es) incluído(s) no rateio.` });
    }
  };

  const renderLogo = (item: any) => {
    const imageMap: Record<string, string> = {
      zap: 'zap.svg', imovelweb: 'imóvelweb.svg', vivareal: 'viva real.svg', 
      orulo: 'órulo.svg', ml: 'meli.svg', olx: 'olx.svg', chavesnamao: 'chavesnamao.svg'
    };
    if (imageMap[item.id]) {
      return <img src={`/images/portais/${imageMap[item.id]}`} alt={item.name} className="w-full h-full object-contain p-1" />;
    }
    return <item.icon className="h-6 w-6" />;
  };

  const isImage = portalAtual.id !== 'properati' && portalAtual.id !== 'trovit' && portalAtual.id !== 'mitula' && portalAtual.id !== 'imovelguide' && portalAtual.id !== 'dfimoveis';

  const FilterBar = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/20 p-3 rounded-2xl border border-border/50 mb-6">
      <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar imóveis..." className="pl-9 h-10 bg-background rounded-xl border-border/50" />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2 relative h-10 px-4 rounded-xl shadow-sm border-border whitespace-nowrap bg-background">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filtros</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
            <SheetHeader className="mb-6">
              <SheetTitle>Filtros Avançados</SheetTitle>
              <SheetDescription>Refine sua busca para localizar imóveis específicos.</SheetDescription>
            </SheetHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Código</Label><Input /></div>
              <div className="space-y-2"><Label>Cód Alternativo</Label><Input /></div>
              <div className="space-y-2"><Label>Valor Mínimo (Venda)</Label><Input placeholder="R$" /></div>
              <div className="space-y-2"><Label>Valor Máximo (Venda)</Label><Input placeholder="R$" /></div>
              <div className="col-span-2 space-y-2"><Label>Endereço</Label><Input /></div>
              <div className="col-span-2 space-y-2"><Label>Condomínio / Empreendimento</Label><Input /></div>
              <div className="space-y-2"><Label>Finalidade</Label><Select><SelectTrigger><SelectValue placeholder="Qualquer"/></SelectTrigger><SelectContent><SelectItem value="venda">Venda</SelectItem><SelectItem value="locacao">Locação</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label>Tipo</Label><Select><SelectTrigger><SelectValue placeholder="Qualquer"/></SelectTrigger><SelectContent><SelectItem value="ap">Apartamento</SelectItem><SelectItem value="ca">Casa</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label>Cidade</Label><Input /></div>
              <div className="space-y-2"><Label>Bairro</Label><Input /></div>
              <div className="space-y-2"><Label>Dormitórios</Label><Input type="number" /></div>
              
              <div className="col-span-2 pt-4 border-t border-border/50 space-y-3">
                <div className="flex items-center space-x-2"><Checkbox id="f1" /><Label htmlFor="f1">Aceita financiamento</Label></div>
                <div className="flex items-center space-x-2"><Checkbox id="f2" /><Label htmlFor="f2">Minha Casa Minha Vida</Label></div>
                <div className="flex items-center space-x-2"><Checkbox id="f3" /><Label htmlFor="f3">Aceita permuta</Label></div>
                <div className="flex items-center space-x-2"><Checkbox id="f4" /><Label htmlFor="f4">Possui chaves na imobiliária</Label></div>
                <div className="flex items-center space-x-2"><Checkbox id="f5" /><Label htmlFor="f5">Apenas com fotos</Label></div>
              </div>
            </div>
            <div className="mt-8 flex gap-3">
              <Button variant="outline" className="flex-1">Limpar</Button>
              <Button className="flex-1">Aplicar Filtros</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto">
        {activeTab === 'pre-selecionados' && (
          <Select>
            <SelectTrigger className="w-[160px] h-10 bg-background rounded-xl border-border/50 text-amber-600 font-semibold"><SelectValue placeholder="Problemas de Cad." /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="incompletos">Incompletos</SelectItem>
              <SelectItem value="sem_foto">Sem Foto</SelectItem>
              <SelectItem value="sem_video">Sem Vídeo</SelectItem>
              <SelectItem value="sem_tour">Sem Tour 360</SelectItem>
              <SelectItem value="sem_desc">Sem Descrição</SelectItem>
              <SelectItem value="cadastro_completo" className="text-emerald-600 font-bold">Cadastro Completo</SelectItem>
            </SelectContent>
          </Select>
        )}
        <Select>
          <SelectTrigger className="w-[140px] h-10 bg-background rounded-xl border-border/50"><SelectValue placeholder="Corretor" /></SelectTrigger>
          <SelectContent><SelectItem value="all">Todos</SelectItem><SelectItem value="1">João</SelectItem></SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[140px] h-10 bg-background rounded-xl border-border/50"><SelectValue placeholder="Anúncio" /></SelectTrigger>
          <SelectContent><SelectItem value="all">Todos</SelectItem><SelectItem value="simples">Simples</SelectItem><SelectItem value="destaque">Destaque</SelectItem></SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[140px] h-10 bg-background rounded-xl border-border/50"><SelectValue placeholder="Ordenar" /></SelectTrigger>
          <SelectContent><SelectItem value="recentes">Mais Recentes</SelectItem><SelectItem value="maior_valor">Maior Valor</SelectItem></SelectContent>
        </Select>

        <div className="flex items-center bg-background border border-border/50 rounded-xl overflow-hidden h-10 shadow-sm ml-auto sm:ml-2">
          <button onClick={() => setViewMode('list')} className={cn("px-3 h-full transition-colors", viewMode === 'list' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted')}><List className="w-4 h-4" /></button>
          <div className="w-[1px] h-full bg-border/50"></div>
          <button onClick={() => setViewMode('grid')} className={cn("px-3 h-full transition-colors", viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted')}><LayoutGrid className="w-4 h-4" /></button>
        </div>
        </div>
      </div>
  );
  const getValidationScore = (v: any) => {
    let score = 0;
    if (v.fotos) score += 20;
    if (v.video) score += 20;
    if (v.tour) score += 20;
    if (v.desc) score += 20;
    if (v.completo) score += 20;
    return score;
  };

  const PropertyListing = ({ status }: { status: string }) => {
    const data = imoveisList.filter(i => i.status === status);
    const allSelected = data.length > 0 && selectedProps.length === data.length;

    const toggleAll = () => {
      if (allSelected) setSelectedProps([]);
      else setSelectedProps(data.map(d => d.id));
    };

    const toggleOne = (id: string) => {
      if (selectedProps.includes(id)) setSelectedProps(selectedProps.filter(x => x !== id));
      else setSelectedProps([...selectedProps, id]);
    };

    if (viewMode === 'list') {
      return (
        <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden animate-in fade-in duration-300 relative">
          {selectedProps.length > 0 && (status === 'busca' || status === 'pre-selecionado') && (
            <div className="bg-primary/5 border-b border-primary/20 px-4 py-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-primary">{selectedProps.length} imóvel(is) selecionado(s)</span>
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-[160px] h-8 text-xs bg-background"><SelectValue placeholder="Tipo de Anúncio" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simples">Simples</SelectItem>
                    <SelectItem value="destaque">Destaque</SelectItem>
                    <SelectItem value="super_destaque">Super Destaque</SelectItem>
                  </SelectContent>
                </Select>
                {status === 'busca' && <Button size="sm" className="h-8">Enviar para Pré-seleção</Button>}
                {status === 'pre-selecionado' && <Button size="sm" className="h-8 bg-amber-600 hover:bg-amber-700 text-white">Enviar para Carga</Button>}
              </div>
            </div>
          )}
          <div className="pb-16 overflow-hidden">
            <Table className="text-[11px]">
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-8 text-center px-1"><Checkbox checked={allSelected} onCheckedChange={toggleAll}/></TableHead>
                  <TableHead className="px-1">Status</TableHead>
                  <TableHead className="px-1">Código</TableHead>
                  <TableHead className="px-1">Cód.alt.</TableHead>
                  <TableHead className="px-1">Tipo</TableHead>
                  <TableHead className="px-1">Endereço</TableHead>
                  <TableHead className="px-1">Bairro</TableHead>
                  <TableHead className="px-1">Cidade</TableHead>
                  <TableHead className="px-1">Venda</TableHead>
                  <TableHead className="text-center px-1" title="Dormitórios">Do.</TableHead>
                  <TableHead className="text-center px-1" title="Suítes">Su.</TableHead>
                  <TableHead className="text-center px-1" title="Vagas">Va.</TableHead>
                  <TableHead className="px-1">Área</TableHead>
                  <TableHead className="px-1">Corretor</TableHead>
                  {status === 'pre-selecionado' && <TableHead className="px-1 w-[120px]">Anúncio</TableHead>}
                  <TableHead className="w-[120px] px-1 text-center">Validação</TableHead>
                  <TableHead className="w-10 px-1"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map(imovel => {
                  const score = getValidationScore(imovel.validation);
                  return (
                    <TableRow key={imovel.id} className="cursor-pointer hover:bg-muted/30 group h-12" onClick={(e) => { if ((e.target as any).tagName !== 'BUTTON' && (e.target as any).tagName !== 'INPUT' && (e.target as any).tagName !== 'svg' && (e.target as any).tagName !== 'line' && (e.target as any).tagName !== 'path' && !(e.target as any).closest('button')) setSelectedPropDetails(imovel); }}>
                      <TableCell className="text-center align-middle px-1 py-1" onClick={(e) => e.stopPropagation()}>
                        <Checkbox checked={selectedProps.includes(imovel.id)} onCheckedChange={() => toggleOne(imovel.id)} />
                      </TableCell>
                      <TableCell className="px-1 py-1"><Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 font-semibold px-1 py-0 text-[9px] h-4">Ativo</Badge></TableCell>
                      <TableCell className="px-1 py-1 font-bold text-primary whitespace-nowrap">{imovel.cod}</TableCell>
                      <TableCell className="px-1 py-1 text-muted-foreground whitespace-nowrap">{imovel.codAlt || '-'}</TableCell>
                      <TableCell className="px-1 py-1 font-medium truncate max-w-[80px]" title={imovel.tipo}>{imovel.tipo}</TableCell>
                      <TableCell className="px-1 py-1 truncate max-w-[100px]" title={imovel.endereco}>{imovel.endereco}</TableCell>
                      <TableCell className="px-1 py-1 truncate max-w-[80px]" title={imovel.bairro}>{imovel.bairro}</TableCell>
                      <TableCell className="px-1 py-1 truncate max-w-[80px]" title={imovel.cidade}>{imovel.cidade}</TableCell>
                      <TableCell className="px-1 py-1 font-bold whitespace-nowrap">{imovel.valor}</TableCell>
                      <TableCell className="px-1 py-1 text-center font-medium">{imovel.dorms}</TableCell>
                      <TableCell className="px-1 py-1 text-center font-medium">{imovel.suites ?? '-'}</TableCell>
                      <TableCell className="px-1 py-1 text-center font-medium">{imovel.vagas}</TableCell>
                      <TableCell className="px-1 py-1 whitespace-nowrap font-medium">{imovel.area}</TableCell>
                      <TableCell className="px-1 py-1 whitespace-nowrap">
                        <div className="flex items-center gap-1"><User className="w-2.5 h-2.5 text-muted-foreground shrink-0"/> <span className="truncate max-w-[60px]" title={imovel.corretor}>{imovel.corretor.split(' ')[0]}</span></div>
                      </TableCell>
                      {status === 'pre-selecionado' && (
                        <TableCell className="px-1 py-1" onClick={(e) => e.stopPropagation()}>
                          <Select defaultValue="simples">
                            <SelectTrigger className="h-7 text-[10px] w-full bg-background"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="simples">Simples</SelectItem>
                              <SelectItem value="destaque">Destaque</SelectItem>
                              <SelectItem value="super_destaque">Super Dest.</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      )}
                      <TableCell className="px-1 py-1">
                        <div className="w-full flex flex-col gap-1 justify-center min-w-[100px]">
                          <div className="flex items-center justify-between text-[9px] leading-none">
                            <span className="font-semibold text-muted-foreground">Score</span>
                            <span className={score === 100 ? "text-emerald-500 font-bold" : "text-amber-500 font-bold"}>{score}%</span>
                          </div>
                          <Progress value={score} className="h-1" indicatorClassName={score === 100 ? "bg-emerald-500" : "bg-amber-500"} />
                          <div className="flex justify-between items-center px-0.5 mt-0.5">
                            <div className="flex flex-col items-center" title="Fotos">
                              {imovel.validation.fotos ? <div className="w-2.5 h-2.5 rounded-full bg-[#00C48C] flex items-center justify-center shrink-0"><Check className="w-1.5 h-1.5 text-white stroke-[3]"/></div> : <div className="w-2.5 h-2.5 rounded-full bg-red-100 shrink-0" />}
                            </div>
                            <div className="flex flex-col items-center" title="Vídeo">
                              {imovel.validation.video ? <div className="w-2.5 h-2.5 rounded-full bg-[#00C48C] flex items-center justify-center shrink-0"><Check className="w-1.5 h-1.5 text-white stroke-[3]"/></div> : <div className="w-2.5 h-2.5 rounded-full bg-red-100 shrink-0" />}
                            </div>
                            <div className="flex flex-col items-center" title="Tour 360">
                              {imovel.validation.tour ? <div className="w-2.5 h-2.5 rounded-full bg-[#00C48C] flex items-center justify-center shrink-0"><Check className="w-1.5 h-1.5 text-white stroke-[3]"/></div> : <div className="w-2.5 h-2.5 rounded-full bg-red-100 shrink-0" />}
                            </div>
                            <div className="flex flex-col items-center" title="Descrição">
                              {imovel.validation.desc ? <div className="w-2.5 h-2.5 rounded-full bg-[#00C48C] flex items-center justify-center shrink-0"><Check className="w-1.5 h-1.5 text-white stroke-[3]"/></div> : <div className="w-2.5 h-2.5 rounded-full bg-red-100 shrink-0" />}
                            </div>
                            <div className="flex flex-col items-center" title="Cadastro Completo">
                              {imovel.validation.completo ? <div className="w-2.5 h-2.5 rounded-full bg-[#00C48C] flex items-center justify-center shrink-0"><Check className="w-1.5 h-1.5 text-white stroke-[3]"/></div> : <div className="w-2.5 h-2.5 rounded-full bg-red-100 shrink-0" />}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-1 py-1 text-right" onClick={(e) => e.stopPropagation()}>
                        {status === 'carga' && (
                          <div className="flex items-center justify-end gap-0.5">
                            <Button size="icon" variant="ghost" className="h-6 w-6 p-0 text-slate-500 hover:bg-slate-100" onClick={(e) => { e.stopPropagation(); setSelectedPropDetails(imovel); }}><Eye className="w-3 h-3"/></Button>
                            <Button size="icon" variant="ghost" className="h-6 w-6 p-0 text-red-500 hover:bg-red-50" onClick={(e) => { e.stopPropagation(); moveProperty([imovel.id], 'busca'); }}><XCircle className="w-3 h-3"/></Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {data.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={15} className="text-center py-12 text-muted-foreground">Nenhum imóvel encontrado.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* BULK ACTIONS BAR */}
          {selectedProps.length > 0 && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-foreground text-background px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 z-50 animate-in slide-in-from-bottom-10 fade-in">
              <span className="font-bold text-sm bg-background/20 px-2 py-1 rounded-md">{selectedProps.length} selecionados</span>
              <div className="w-px h-6 bg-background/20" />
              
              {status === 'busca' && (
                <Button size="sm" onClick={() => moveProperty(selectedProps, 'pre-selecionado')} className="bg-primary hover:bg-primary/90 text-white rounded-full h-8">
                  Enviar para Pré-selecionados
                </Button>
              )}
              {status === 'pre-selecionado' && (
                <>
                  <Button size="sm" onClick={() => moveProperty(selectedProps, 'carga')} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full h-8">
                    Aprovar Carga
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => moveProperty(selectedProps, 'busca')} className="border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-full bg-transparent h-8">
                    Remover de Pré-selecionados
                  </Button>
                </>
              )}
              {status === 'carga' && (
                <>
                  <Button size="sm" onClick={() => moveProperty(selectedProps, 'pre-selecionado')} className="bg-primary hover:bg-primary/90 text-white rounded-full h-8">
                    Enviar para Pré-selecionados
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => moveProperty(selectedProps, 'busca')} className="border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-full bg-transparent h-8">
                    Remover da Carga
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      );
    }

    // GRID VIEW
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-300">
        {data.map(imovel => (
          <Card key={imovel.id} className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow group flex flex-col relative">
            <div className="absolute top-3 left-3 z-10">
              <Checkbox className="bg-white/90 border-slate-300" checked={selectedProps.includes(imovel.id)} onCheckedChange={() => toggleOne(imovel.id)} />
            </div>
            
            <div className="h-44 bg-muted flex items-center justify-center relative cursor-pointer" onClick={() => setSelectedPropDetails(imovel)}>
              {/* Photo */}
              {imovel.imagem ? (
                <img src={imovel.imagem} alt={imovel.titulo} className="w-full h-full object-cover z-0" />
              ) : (
                <ImageIcon className="w-10 h-10 text-muted-foreground/30 z-10" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-0" />
              
              <div className="absolute top-3 right-3 z-10">
                <Badge variant="secondary" className="bg-emerald-500 hover:bg-emerald-600 text-white border-none shadow-sm font-semibold">Ativo</Badge>
              </div>

              <div className="absolute bottom-3 left-3 right-3 z-10 text-white flex justify-between items-end">
                <div className="flex flex-col items-start">
                  <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md mb-1 px-2 py-0.5 text-xs">{imovel.cod}</Badge>
                  <div className="text-[10px] text-white/90 drop-shadow-sm ml-1">Alt: {imovel.codAlt || '-'}</div>
                </div>
                <div className="font-black text-lg leading-tight drop-shadow-md text-right">{imovel.valor}</div>
              </div>
            </div>

            <CardContent className="p-4 flex-1 flex flex-col">
              <h3 className="font-bold text-sm line-clamp-1 mb-1.5 cursor-pointer hover:text-primary transition-colors" onClick={() => setSelectedPropDetails(imovel)} title={imovel.tipo}>{imovel.tipo}</h3>
              <p className="text-[11px] text-muted-foreground mb-4 line-clamp-2 leading-relaxed" title={`${imovel.endereco}, ${imovel.bairro} - ${imovel.cidade}`}>
                <MapPin className="w-3 h-3 inline mr-1 text-primary/70"/> 
                {imovel.endereco}, {imovel.bairro} - {imovel.cidade}
              </p>
              
              <div className="grid grid-cols-4 gap-1 text-center bg-muted/30 p-2 rounded-lg mb-4 border border-border/50">
                <div className="flex flex-col"><span className="text-[9px] text-muted-foreground uppercase font-semibold">Dorm.</span><strong className="text-xs text-foreground mt-0.5">{imovel.dorms}</strong></div>
                <div className="flex flex-col border-l border-border/50"><span className="text-[9px] text-muted-foreground uppercase font-semibold">Suíte</span><strong className="text-xs text-foreground mt-0.5">{imovel.suites ?? '-'}</strong></div>
                <div className="flex flex-col border-l border-border/50"><span className="text-[9px] text-muted-foreground uppercase font-semibold">Vaga</span><strong className="text-xs text-foreground mt-0.5">{imovel.vagas}</strong></div>
                <div className="flex flex-col border-l border-border/50"><span className="text-[9px] text-muted-foreground uppercase font-semibold">Área</span><strong className="text-xs text-foreground mt-0.5 truncate px-1" title={imovel.area}>{imovel.area}</strong></div>
              </div>

              <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground bg-muted/20 p-2 rounded-lg border border-border/30">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0"><User className="w-3 h-3" /></div>
                <span className="truncate">Corretor: <strong className="text-foreground">{imovel.corretor}</strong></span>
              </div>

              <div className="mt-auto border-t border-border/40 pt-4">
                <div className="flex justify-between text-[11px] mb-2">
                  <span className="font-semibold text-slate-700">Qualidade do Anúncio</span>
                  <span className={getValidationScore(imovel.validation) === 100 ? "text-emerald-600 font-bold" : "text-amber-500 font-bold"}>
                    {getValidationScore(imovel.validation)}%
                  </span>
                </div>
                <Progress value={getValidationScore(imovel.validation)} className="h-1.5 mb-3" indicatorClassName={getValidationScore(imovel.validation) === 100 ? "bg-emerald-500" : "bg-amber-500"} />
                
                <div className="flex justify-between items-center px-1">
                  <div className="flex flex-col items-center gap-1.5" title="Fotos">
                    {imovel.validation.fotos ? <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 shadow-sm"><Check className="w-2.5 h-2.5 text-white stroke-[3]"/></div> : <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center shrink-0 border border-red-200"><span className="text-[8px] text-red-500 font-bold">X</span></div>}
                    <span className="text-[9px] font-medium text-muted-foreground">Fotos</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5" title="Vídeo">
                    {imovel.validation.video ? <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 shadow-sm"><Check className="w-2.5 h-2.5 text-white stroke-[3]"/></div> : <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center shrink-0 border border-red-200"><span className="text-[8px] text-red-500 font-bold">X</span></div>}
                    <span className="text-[9px] font-medium text-muted-foreground">Vídeo</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5" title="Tour 360">
                    {imovel.validation.tour ? <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 shadow-sm"><Check className="w-2.5 h-2.5 text-white stroke-[3]"/></div> : <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center shrink-0 border border-red-200"><span className="text-[8px] text-red-500 font-bold">X</span></div>}
                    <span className="text-[9px] font-medium text-muted-foreground">Tour</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5" title="Descrição">
                    {imovel.validation.desc ? <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 shadow-sm"><Check className="w-2.5 h-2.5 text-white stroke-[3]"/></div> : <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center shrink-0 border border-red-200"><span className="text-[8px] text-red-500 font-bold">X</span></div>}
                    <span className="text-[9px] font-medium text-muted-foreground">Desc.</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5" title="Cadastro Completo">
                    {imovel.validation.completo ? <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 shadow-sm"><Check className="w-2.5 h-2.5 text-white stroke-[3]"/></div> : <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center shrink-0 border border-red-200"><span className="text-[8px] text-red-500 font-bold">X</span></div>}
                    <span className="text-[9px] font-medium text-muted-foreground">Comp.</span>
                  </div>
                </div>
              </div>
            </CardContent>
            
            {status === 'carga' && (
              <CardFooter className="p-4 pt-0 border-t border-border/10 bg-muted/5 flex gap-2">
                <Badge variant="outline" className="flex-1 justify-center bg-background h-9 border-slate-200 text-slate-500">{imovel.adType.toUpperCase()}</Badge>
                <Button size="icon" variant="outline" className="h-9 w-9 text-slate-500 hover:bg-slate-100 border-slate-200" onClick={(e) => { e.stopPropagation(); setSelectedPropDetails(imovel); }}><Eye className="w-4 h-4"/></Button>
                <Button size="icon" variant="outline" className="h-9 w-9 border-red-200 text-red-500 hover:bg-red-50" onClick={(e) => { e.stopPropagation(); moveProperty([imovel.id], 'busca'); }}><XCircle className="w-4 h-4"/></Button>
              </CardFooter>
            )}
            {/* BULK ACTIONS BAR (GRID) */}
            {selectedProps.length > 0 && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-foreground text-background px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 z-50 animate-in slide-in-from-bottom-10 fade-in">
                <span className="font-bold text-sm bg-background/20 px-2 py-1 rounded-md">{selectedProps.length} selecionados</span>
                <div className="w-px h-6 bg-background/20" />
                
                {status === 'busca' && (
                  <Button size="sm" onClick={() => moveProperty(selectedProps, 'pre-selecionado')} className="bg-primary hover:bg-primary/90 text-white rounded-full h-8">
                    Enviar para Pré-selecionados
                  </Button>
                )}
                {status === 'pre-selecionado' && (
                  <>
                    <Button size="sm" onClick={() => moveProperty(selectedProps, 'carga')} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full h-8">
                      Aprovar Carga
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => moveProperty(selectedProps, 'busca')} className="border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-full bg-transparent h-8">
                      Remover de Pré-selecionados
                    </Button>
                  </>
                )}
                {status === 'carga' && (
                  <>
                    <Button size="sm" onClick={() => moveProperty(selectedProps, 'pre-selecionado')} className="bg-primary hover:bg-primary/90 text-white rounded-full h-8">
                      Enviar para Pré-selecionados
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => moveProperty(selectedProps, 'busca')} className="border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-full bg-transparent h-8">
                      Remover da Carga
                    </Button>
                  </>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-full pb-10">
      <div className="max-w-[1400px] w-full mx-auto px-6 pt-4">
        {/* Header & Logo Switcher */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/integracoes')} className="rounded-full shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer group hover:bg-muted/50 p-2 rounded-2xl transition-colors -ml-2">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-md border border-border/50 overflow-hidden select-none shrink-0 transition-transform group-hover:scale-105", isImage ? 'bg-white' : portalAtual.color, !isImage && 'text-white')}>
                    {renderLogo(portalAtual)}
                  </div>
                  <div className="hidden sm:block">
                    <div className="flex items-center gap-1">
                      <h1 className="text-2xl font-bold tracking-tight">{portalAtual.name}</h1>
                      <ChevronDown className="w-4 h-4 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-sm text-muted-foreground">Gestão de anúncios</p>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[240px] rounded-2xl p-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-2 py-1.5 mb-1">Alternar Portal</div>
                {portais.map(p => (
                  <DropdownMenuItem key={p.id} onClick={() => navigate(`/integracoes/portal/${p.id}`)} className="rounded-xl p-2 cursor-pointer">
                    <div className={cn("w-6 h-6 rounded-md mr-3 flex items-center justify-center text-[8px] font-bold overflow-hidden", p.id === 'vivareal' || p.id === 'orulo' ? 'bg-white' : p.color, p.color.includes('bg-[#') && !['vivareal','orulo'].includes(p.id) ? 'text-white' : '')}>
                       {p.id.substring(0,2).toUpperCase()}
                    </div>
                    <span className="font-medium">{p.name}</span>
                    {p.id === id && <CheckCircle2 className="w-4 h-4 ml-auto text-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] w-full mx-auto px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); setSelectedProps([]); }} className="w-full space-y-6">
          <TabsList className="bg-muted/50 p-1 border border-border/50 rounded-xl h-auto flex-wrap">
            <TabsTrigger value="busca" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">Busca de Imóveis</TabsTrigger>
            <TabsTrigger value="pre-selecionados" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">Pré Selecionados</TabsTrigger>
            <TabsTrigger value="carga" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">Carga (Publicados)</TabsTrigger>
            <TabsTrigger value="historico" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">Histórico</TabsTrigger>
            <TabsTrigger value="config" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="busca" className="space-y-4 outline-none">
            <FilterBar />
            <PropertyListing status="busca" />
          </TabsContent>

          <TabsContent value="pre-selecionados" className="space-y-4 outline-none">
            <Alert className="bg-primary/5 border-primary/20 mb-6 rounded-2xl">
              <AlertCircle className="h-4 w-4 text-primary" />
              <AlertTitle className="text-primary font-bold">Aviso Importante</AlertTitle>
              <AlertDescription className="text-muted-foreground">
                Imóveis marcados pelos corretores. O gestor valida o cadastro e a configuração de cada anúncio e, então, aprova o envio para a carga do portal.
              </AlertDescription>
            </Alert>
            <FilterBar />
            <PropertyListing status="pre-selecionado" />
          </TabsContent>

          <TabsContent value="carga" className="space-y-6 outline-none">
            {/* Top Quotas Summary */}
            <div className="flex flex-col gap-8 mb-8 mt-2">
              <div className="flex flex-col gap-1.5">
                <h3 className="font-normal text-2xl text-slate-800 dark:text-slate-200">Consumo de Cotas do Portal</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Acompanhe a utilização contratada por tipo de anúncio</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between text-slate-800 dark:text-slate-200">
                    <span className="text-base font-normal">Anúncio Simples</span>
                    <span className="text-base font-normal">40/100</span>
                  </div>
                  <Progress value={40} className="h-4 bg-blue-400/50 rounded-full" indicatorClassName="bg-blue-700 rounded-full" />
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between text-slate-800 dark:text-slate-200">
                    <span className="text-base font-normal">Destaque</span>
                    <span className="text-base font-normal">8/10</span>
                  </div>
                  <Progress value={80} className="h-4 bg-blue-400/50 rounded-full" indicatorClassName="bg-blue-700 rounded-full" />
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between text-slate-800 dark:text-slate-200">
                    <span className="text-base font-normal">Super Destaque</span>
                    <span className="text-base font-normal">4/6</span>
                  </div>
                  <Progress value={66.66} className="h-4 bg-blue-400/50 rounded-full" indicatorClassName="bg-blue-700 rounded-full" />
                </div>

              </div>
            </div>

            <FilterBar />
            <PropertyListing status="carga" />
          </TabsContent>

          <TabsContent value="historico" className="space-y-4 outline-none">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg">Histórico de Integração</h3>
                <p className="text-sm text-muted-foreground">Últimos envios de carga realizados para este portal.</p>
              </div>
              <div className="flex items-center gap-2">
                <Button className="bg-primary text-white">Gerar carga agora</Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-5 h-5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-[300px]">
                      A carga é gerada automaticamente de acordo com as configurações do portal. Utilize este botão apenas se precisar forçar uma atualização imediata.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>Data de Criação</TableHead>
                    <TableHead className="text-center">Anúncios Enviados</TableHead>
                    <TableHead className="text-center text-emerald-600">Sucessos</TableHead>
                    <TableHead className="text-center text-red-500">Erros</TableHead>
                    <TableHead className="text-right">Relatório</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">25/07/2026 08:30</TableCell>
                    <TableCell className="text-center font-bold">41</TableCell>
                    <TableCell className="text-center text-emerald-600 font-bold">41</TableCell>
                    <TableCell className="text-center text-red-500 font-bold">0</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="h-8"><FileText className="w-4 h-4 mr-2"/> Ver XML</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">24/07/2026 20:30</TableCell>
                    <TableCell className="text-center font-bold">40</TableCell>
                    <TableCell className="text-center text-emerald-600 font-bold">39</TableCell>
                    <TableCell className="text-center text-red-500 font-bold">1</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="h-8 border-red-200 text-red-600 hover:bg-red-50"><AlertCircle className="w-4 h-4 mr-2"/> Ver Erros</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="config" className="space-y-6 outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Map Config */}
              <Card className="border-border/50 shadow-sm">
                <CardHeader className="pb-3 border-b border-border/40">
                  <CardTitle className="text-base flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Exibição de Mapa no Anúncio</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <Label className="text-sm text-muted-foreground">Como a localização é enviada ao portal:</Label>
                  <Select value={mapOption} onValueChange={setMapOption}>
                    <SelectTrigger className="w-full bg-background h-14 text-left">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="exata" className="items-start">
                        <div className="flex flex-col py-1 text-left">
                          <span className="font-semibold">Localização exata</span>
                          <span className="text-[11px] text-muted-foreground">Pino no endereço real.</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="aproximada" className="items-start">
                        <div className="flex flex-col py-1 text-left">
                          <span className="font-semibold">Localização aproximada</span>
                          <span className="text-[11px] text-muted-foreground">Raio da região.</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="nenhum" className="items-start">
                        <div className="flex flex-col py-1 text-left">
                          <span className="font-semibold">Não exibir mapa</span>
                          <span className="text-[11px] text-muted-foreground">Nenhum mapa enviado.</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Quantidade Contratada */}
              <Card className="border-border/50 shadow-sm">
                <CardHeader className="pb-3 border-b border-border/40">
                  <CardTitle className="text-base">Quantidade de anúncios</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Simples</Label>
                      <Input type="number" defaultValue="280" className="h-12 font-bold text-lg bg-background text-center" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs uppercase tracking-wider text-blue-600 font-bold">Destaques</Label>
                      <Input type="number" defaultValue="40" className="h-12 font-bold text-lg bg-background text-center text-blue-600" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs uppercase tracking-wider text-amber-600 font-bold">Super Dest.</Label>
                      <Input type="number" defaultValue="12" className="h-12 font-bold text-lg bg-background text-center text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cotas por Corretor */}
              <Card className="border-border/50 shadow-sm md:col-span-2 overflow-hidden">
                <CardHeader className="pb-3 border-b border-border/40 bg-muted/5 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Cota individual por corretor</CardTitle>
                    <CardDescription className="mt-1">Cada corretor recebe a própria cota de anúncios.</CardDescription>
                  </div>
                  <Switch checked={cotaPorCorretor} onCheckedChange={setCotaPorCorretor} className="data-[state=checked]:bg-primary" />
                </CardHeader>
                
                {cotaPorCorretor && (
                  <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <span className="text-sm text-muted-foreground font-medium">{corretoresList.length} corretores no rodízio</span>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <Button variant="outline" size="sm" onClick={handleRedistribute} className="flex-1 sm:flex-none h-9 rounded-full border-primary/20 text-primary hover:bg-primary/5 font-semibold">Redistribuir por igual</Button>
                        <Dialog open={addBrokerOpen} onOpenChange={setAddBrokerOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm" className="flex-1 sm:flex-none h-9 rounded-full bg-primary text-white font-semibold"><UserPlus className="w-4 h-4 mr-2"/> Adicionar Corretor</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[400px] rounded-3xl">
                            <DialogHeader>
                              <DialogTitle>Adicionar Corretor</DialogTitle>
                              <DialogDescription>Selecione um corretor para incluir no rateio de cotas.</DialogDescription>
                            </DialogHeader>
                            <div className="py-4 space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                              {availableBrokers.map(b => (
                                <div key={b.id} className="flex items-center space-x-2">
                                  <Checkbox 
                                    id={`broker-${b.id}`} 
                                    checked={newBrokerIds.includes(b.id)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setNewBrokerIds([...newBrokerIds, b.id]);
                                      } else {
                                        setNewBrokerIds(newBrokerIds.filter(id => id !== b.id));
                                      }
                                    }}
                                  />
                                  <label htmlFor={`broker-${b.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1">
                                    {b.name}
                                  </label>
                                </div>
                              ))}
                              {availableBrokers.length === 0 && <div className="text-sm text-muted-foreground text-center py-4">Todos os corretores já adicionados.</div>}
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setAddBrokerOpen(false)}>Cancelar</Button>
                              <Button className="bg-primary text-white" disabled={newBrokerIds.length === 0} onClick={handleAddBroker}>Adicionar</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>

                    <div className="border border-border/50 rounded-xl overflow-hidden overflow-x-auto">
                      <Table>
                        <TableHeader className="bg-muted/30">
                          <TableRow>
                            <TableHead>Corretor</TableHead>
                            <TableHead className="w-[140px] text-center">Simples</TableHead>
                            <TableHead className="w-[140px] text-center text-blue-600">Destaque</TableHead>
                            <TableHead className="w-[140px] text-center text-amber-600">Super Destaque</TableHead>
                            <TableHead className="w-12"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {corretoresList.map((c, idx) => (
                            <TableRow key={c.id}>
                              <TableCell className="font-medium whitespace-nowrap flex items-center gap-2 h-14"><User className="w-4 h-4 text-muted-foreground"/> {c.name}</TableCell>
                              <TableCell><Input type="number" value={c.simples} onChange={(e) => { const n = [...corretoresList]; n[idx].simples = parseInt(e.target.value)||0; setCorretoresList(n); }} className="h-9 w-full bg-background text-center font-semibold" /></TableCell>
                              <TableCell><Input type="number" value={c.destaque} onChange={(e) => { const n = [...corretoresList]; n[idx].destaque = parseInt(e.target.value)||0; setCorretoresList(n); }} className="h-9 w-full bg-background text-center font-semibold text-blue-600" /></TableCell>
                              <TableCell><Input type="number" value={c.sdestaque} onChange={(e) => { const n = [...corretoresList]; n[idx].sdestaque = parseInt(e.target.value)||0; setCorretoresList(n); }} className="h-9 w-full bg-background text-center font-semibold text-amber-600" /></TableCell>
                              <TableCell className="text-right">
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => setBrokerToRemove(c.id)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                )}
              </Card>

            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Property Details Dialog (Quick View) via Component */}
      <PropertyQuickView 
        open={!!selectedPropDetails} 
        onClose={() => setSelectedPropDetails(null)} 
        imovel={selectedPropDetails} 
      />

      {/* Broker Removal Transfer Dialog */}
      <Dialog open={!!brokerToRemove} onOpenChange={(o) => {
        if (!o) {
          setBrokerToRemove(null);
          setBrokerToReceive('');
        }
      }}>
        <DialogContent className="sm:max-w-[400px] rounded-3xl">
          <DialogHeader>
            <DialogTitle>Transferir Imóveis e Remover</DialogTitle>
            <DialogDescription>
              Para quem vão os imóveis associados à cota deste corretor?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label className="mb-2 block">Selecione o corretor destino</Label>
            <Select value={String(brokerToReceive)} onValueChange={(v) => setBrokerToReceive(v)}>
              <SelectTrigger><SelectValue placeholder="Selecione um corretor" /></SelectTrigger>
              <SelectContent>
                {corretoresList.filter(c => c.id !== brokerToRemove).map(c => (
                  <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => { setBrokerToRemove(null); setBrokerToReceive(''); }}>Cancelar</Button>
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={brokerToReceive === ''}
              onClick={() => {
                setCorretoresList(corretoresList.filter(c => c.id !== brokerToRemove));
                setBrokerToRemove(null);
                setBrokerToReceive('');
              }}
            >
              Transferir e Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// trigger HMR
