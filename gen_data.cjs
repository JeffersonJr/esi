const fs = require('fs');

const types = ['Apartamento', 'Casa', 'Cobertura', 'Terreno', 'Sobrado'];
const neighborhoods = ['Pinheiros', 'Barra da Tijuca', 'Vila Nova Conceição', 'Centro', 'Jardins', 'Moema'];
const cities = ['São Paulo', 'Rio de Janeiro', 'Curitiba', 'Belo Horizonte', 'Florianópolis'];
const brokers = ['João Silva', 'Maria Fernandes', 'Carlos Andrade', 'Ana Costa', 'Roberto Almeida'];

const adTypes = ['normal', 'destaque', 'super_destaque'];

const images = [
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop'
];

let items = [];

function getRand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function getRandBool() { return Math.random() > 0.3; }

let id = 1;

// 20 in busca
for(let i=0; i<20; i++) {
  items.push({
    id: String(id++), cod: `AP00${id}`, codAlt: `A${id}-ZAP`, titulo: `${getRand(types)} em ${getRand(neighborhoods)}`,
    tipo: getRand(types), endereco: `Rua Exemplo, ${id}0`, bairro: getRand(neighborhoods), cidade: getRand(cities),
    valor: `R$ ${(Math.random() * 2000000 + 300000).toFixed(0)}`, dorms: Math.floor(Math.random()*4)+1, suites: Math.floor(Math.random()*2),
    vagas: Math.floor(Math.random()*3), area: `${Math.floor(Math.random()*200)+40}m²`, corretor: getRand(brokers),
    status: 'busca', adType: getRand(adTypes), imagem: getRand(images),
    validation: { fotos: getRandBool(), video: getRandBool(), tour: getRandBool(), desc: getRandBool(), completo: getRandBool() }
  });
}

// 10 in pre-selecionados
for(let i=0; i<10; i++) {
  items.push({
    id: String(id++), cod: `AP00${id}`, codAlt: `A${id}-ZAP`, titulo: `${getRand(types)} em ${getRand(neighborhoods)}`,
    tipo: getRand(types), endereco: `Rua Exemplo, ${id}0`, bairro: getRand(neighborhoods), cidade: getRand(cities),
    valor: `R$ ${(Math.random() * 2000000 + 300000).toFixed(0)}`, dorms: Math.floor(Math.random()*4)+1, suites: Math.floor(Math.random()*2),
    vagas: Math.floor(Math.random()*3), area: `${Math.floor(Math.random()*200)+40}m²`, corretor: getRand(brokers),
    status: 'pre-selecionado', adType: getRand(adTypes), imagem: getRand(images),
    validation: { fotos: getRandBool(), video: getRandBool(), tour: getRandBool(), desc: getRandBool(), completo: getRandBool() }
  });
}

// 30 in carga
for(let i=0; i<30; i++) {
  items.push({
    id: String(id++), cod: `AP00${id}`, codAlt: `A${id}-ZAP`, titulo: `${getRand(types)} em ${getRand(neighborhoods)}`,
    tipo: getRand(types), endereco: `Rua Exemplo, ${id}0`, bairro: getRand(neighborhoods), cidade: getRand(cities),
    valor: `R$ ${(Math.random() * 2000000 + 300000).toFixed(0)}`, dorms: Math.floor(Math.random()*4)+1, suites: Math.floor(Math.random()*2),
    vagas: Math.floor(Math.random()*3), area: `${Math.floor(Math.random()*200)+40}m²`, corretor: getRand(brokers),
    status: 'carga', adType: getRand(adTypes), imagem: getRand(images),
    validation: { fotos: true, video: getRandBool(), tour: getRandBool(), desc: true, completo: true }
  });
}

const content = fs.readFileSync('src/pages/PortalDetalhes.tsx', 'utf-8');
const regex = /const mockImoveis = \[[\s\S]*?\];/m;
const newStr = `const mockImoveis = ${JSON.stringify(items, null, 2).replace(/"([^"]+)":/g, '$1:')};`;
fs.writeFileSync('src/pages/PortalDetalhes.tsx', content.replace(regex, newStr));
