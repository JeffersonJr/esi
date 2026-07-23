export interface Tenant {
  id: string
  slug: string
  name: string
  tagline: string
  logo: string
  favicon: string
  creci: string
  description: string
  status?: 'online' | 'offline'
  colors: {
    cream: string
    creamDark: string
    creamBorder: string
    charcoal: string
    charcoalLight: string
    warmGray: string
    gold: string
    goldLight: string
  }
  contacts: {
    phone: string
    phoneRaw: string
    whatsapp: string
    whatsappRaw: string
    email: string
    address: {
      street: string
      neighborhood: string
      city: string
      state: string
      fullAddress: string
    }
  }
  socials: {
    instagram: string
    facebook: string
    youtube: string
    linkedin?: string
  }
  aboutSignature?: {
    name: string
    role: string
    image: string
  }
  fonts?: {
    sans: string
    display: string
  }
  builderSettings: {
    headerStyle: 'transparent' | 'minimal' | 'classic'
    footerStyle: 'simple' | 'detailed' | 'minimal' | 'modern-newsletter' | 'column-grid' | 'brand-glow'
    heroStyle: 'search-centered' | 'search-left' | 'search-right' | 'minimalist' | 'split-screen' | 'video-ambient'
    heroTitle: string
    heroSubtitle: string
    heroImage: string
    cardVariant: 'default' | 'compact' | 'horizontal'
    cardHorizontalStyle?: string
    cardVerticalStyle?: string
    sobreTitle?: string
    sobreText?: string
    sobreTextFontSize?: string
    sobreImage?: string
    sobreStats?: string
    showCardBedrooms: boolean
    showCardBathrooms: boolean
    showCardArea: boolean
    showCardCondo: boolean
    showCardPetFriendly: boolean
    modules: {
      featured: boolean
      categories: boolean
      cities: boolean
      testimonials: boolean
      blog: boolean
      launches: boolean
    }
    pages?: {
      blog: boolean
      launches: boolean
      contact: boolean
      sobre: boolean
      anunciar: boolean
      avaliar: boolean
    }
    homeFilters: string[]
    searchFiltersLayout: 'sidebar' | 'topbar'
    detailGalleryStyle: 'mosaic' | 'slider' | 'grid'
    openingHours: string
    team: {
      name: string
      role: string
      phone: string
      email: string
      photo: string
      instagram: string
    }[]
    pageStructures?: {
      sobre: 'editorial' | 'centered' | 'magazine'
      anunciar: 'editorial' | 'centered' | 'magazine'
      contato: 'editorial' | 'centered' | 'magazine'
      blog: 'editorial' | 'centered' | 'magazine'
    }
    pageBlocks?: {
      sobre: string[]
      anunciar: string[]
      contato: string[]
    }
    pageBlocksLayout?: {
      sobre: 'stack' | 'grid'
      anunciar: 'stack' | 'grid'
      contato: 'stack' | 'grid'
    }
    citiesList?: {
      name: string
      state: string
      count: number
      image: string
    }[]
    homeBlocks?: string[]
    enabledPages?: {
      comprar: boolean
      alugar: boolean
      lancamentos: boolean
      anunciar: boolean
      blog: boolean
      sobre: boolean
      contato: boolean
    }
    teamStyle?: 'grid' | 'cards' | 'list' | 'minimal'
    formFields?: {
      [key: string]: { label: string; enabled: boolean; required: boolean }
    }
    logoLight?: string
    marcaDagua?: string
    cardTag?: string
    contatoTitle?: string
    contatoSubtitle?: string
    contatoAddress?: string
    anunciarTitle?: string
    anunciarSubtitle?: string
    seoKeywords?: string
    googleAnalyticsId?: string
    googleTagManagerId?: string
    googleSiteVerificationId?: string
    googleAdsConversionId?: string
    googleAdsConversionLabel?: string
    googleAdsRemarketingId?: string
    facebookPixelId?: string
    facebookConversionToken?: string
    pinterestTagId?: string
    rdStationToken?: string
    rdStationScript?: string
    linkedinInsightId?: string
    tiktokPixelId?: string
    customScriptsHead?: string
    customScriptsBody?: string
    customCss?: string
  }
}

export const tenants: Tenant[] = [
  {
    id: 'robles',
    slug: 'Robles',
    name: 'Robles Imobiliária',
    tagline: 'Imóveis que conquistam à primeiro vista.',
    logo: '/logo-robles.svg',
    favicon: '/favicon.ico',
    creci: 'CRECI-SP 28.741-J',
    description: 'Especialistas em imóveis de alto padrão há mais de 23 anos. Encontramos o imóvel ideal para cada momento da sua vida.',
    colors: {
      cream: '#F5F0E8',
      creamDark: '#EDE8DE',
      creamBorder: '#E0DAD0',
      charcoal: '#1C1916',
      charcoalLight: '#3D3731',
      warmGray: '#7C7269',
      gold: '#EDBF71',
      goldLight: '#F0D080',
    },
    contacts: {
      phone: '(11) 3568-2495',
      phoneRaw: '+551135682495',
      whatsapp: '(11) 95033-8488',
      whatsappRaw: '5511950338488',
      email: 'claudia@roblesimobiliariasp.com.br',
      address: {
        street: 'Avenida das Nações Unidas, nº 14171',
        neighborhood: 'Vila Gertrudes',
        city: 'São Paulo',
        state: 'SP',
        fullAddress: 'Marble Tower, Vila Gertrudes, São Paulo - SP',
      },
    },
    socials: {
      instagram: 'https://www.instagram.com/roblesimobiliaria/',
      facebook: 'https://www.facebook.com/roblesimobiliariasp/',
      youtube: 'https://www.youtube.com/channel/UCK65kTIZ4SxbnkskBPCfoEw',
    },
    aboutSignature: {
      name: 'Claudia Robles',
      role: 'Fundadora & Diretora Geral',
      image: '/assinatura.png',
    },
    fonts: {
      sans: 'DM Sans',
      display: 'Playfair Display',
    },
    builderSettings: {
      headerStyle: 'classic',
      footerStyle: 'detailed',
      heroStyle: 'search-centered',
      heroTitle: 'Encontre o imóvel dos seus sonhos',
      heroSubtitle: 'Casas, coberturas e apartamentos de alto padrão nas melhores localizações.',
      heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=85&fit=crop',
      cardVariant: 'default',
      showCardBedrooms: true,
      showCardBathrooms: true,
      showCardArea: true,
      showCardCondo: true,
      showCardPetFriendly: true,
      modules: {
        featured: true,
        categories: true,
        cities: true,
        testimonials: true,
        blog: true,
        launches: true,
      },
      pages: {
        blog: true,
        launches: true,
        contact: true,
        sobre: true,
        anunciar: true,
        avaliar: true,
      },
      homeFilters: ['finalidade', 'tipo', 'neighborhood', 'bedrooms'],
      searchFiltersLayout: 'sidebar',
      detailGalleryStyle: 'mosaic',
      openingHours: 'Segunda a Sexta das 9h às 18h · Sábados das 9h às 13h',
      team: [
        {
          name: 'Rafaela Monteiro',
          role: 'Diretora Comercial',
          phone: '(11) 99847-3821',
          email: 'rafaela@robles.com.br',
          photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80',
          instagram: 'https://instagram.com/rafaela',
        },
        {
          name: 'Thiago Cavalcante',
          role: 'Especialista em Coberturas',
          phone: '(21) 98834-5577',
          email: 'thiago@robles.com.br',
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
          instagram: 'https://instagram.com/thiago',
        }
      ]
    }
  },
  {
    id: 'lumina',
    slug: 'Lumina',
    name: 'Lumina Curadoria',
    tagline: 'Lançamentos imobiliários e design autoral em Curitiba.',
    logo: '/logo.png',
    favicon: '/favicon.ico',
    creci: 'CRECI-PR 45.892-F',
    description: 'Boutique imobiliária com foco exclusivo nos melhores lançamentos residenciais de Curitiba. Conectamos arquitetura de vanguarda, sustentabilidade e vivências urbanas exclusivas.',
    colors: {
      cream: '#FAFAFA',
      creamDark: '#F4F4F5',
      creamBorder: '#E4E4E7',
      charcoal: '#09090B',
      charcoalLight: '#27272A',
      warmGray: '#717178',
      gold: '#18181B',
      goldLight: '#3F3F46',
    },
    contacts: {
      phone: '(41) 3012-9876',
      phoneRaw: '+554130129876',
      whatsapp: '(41) 98877-6655',
      whatsappRaw: '5541988776655',
      email: 'curadoria@luminaimoveis.com.br',
      address: {
        street: 'Alameda Dom Pedro II, nº 321',
        neighborhood: 'Batel',
        city: 'Curitiba',
        state: 'PR',
        fullAddress: 'Edifício Batel Workspace, Batel, Curitiba - PR',
      },
    },
    socials: {
      instagram: 'https://www.instagram.com/',
      facebook: 'https://www.facebook.com/',
      youtube: 'https://www.youtube.com/',
    },
    aboutSignature: {
      name: 'Mathias Ribas',
      role: 'Fundador & Curador Chefe',
      image: '/assinatura.png',
    },
    fonts: {
      sans: 'Inter',
      display: 'Outfit',
    },
    builderSettings: {
      headerStyle: 'minimal',
      footerStyle: 'simple',
      heroStyle: 'minimalist',
      heroTitle: 'Coleção Lançamentos Curitiba',
      heroSubtitle: 'Curadoria especializada de apartamentos, coberturas e residências suspensas com design assinado.',
      heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=85&fit=crop',
      cardVariant: 'compact',
      showCardBedrooms: true,
      showCardBathrooms: false,
      showCardArea: true,
      showCardCondo: false,
      showCardPetFriendly: false,
      modules: {
        featured: true,
        categories: true,
        cities: true,
        testimonials: false,
        blog: true,
        launches: true,
      },
      pages: {
        blog: true,
        launches: true,
        contact: true,
        sobre: true,
        anunciar: true,
        avaliar: false,
      },
      homeFilters: ['tipo', 'neighborhood'],
      searchFiltersLayout: 'topbar',
      detailGalleryStyle: 'slider',
      openingHours: 'Segunda a Sexta das 10h às 19h · Sábados das 10h às 16h',
      team: [
        {
          name: 'Mathias Ribas',
          role: 'Fundador & Curador Chefe',
          phone: '(41) 98877-6655',
          email: 'mathias@lumina.com.br',
          photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
          instagram: 'https://instagram.com/mathias',
        },
        {
          name: 'Carolina Ferraz',
          role: 'Curadora Comercial',
          phone: '(41) 99102-6634',
          email: 'carolina@lumina.com.br',
          photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
          instagram: 'https://instagram.com/carolina',
        }
      ]
    }
  },
  {
    id: 'robles-new',
    slug: 'robles-new',
    name: 'Robles Imobiliária',
    tagline: 'Imóveis que conquistam à primeira vista.',
    logo: '/logo-robles.svg',
    favicon: '/favicon.ico',
    creci: 'CRECI-SP 28.741-J',
    description: 'Especialistas em imóveis de alto padrão há mais de 23 anos. Encontramos o imóvel ideal para cada momento da sua vida.',
    colors: {
      cream: '#FAF8F5',
      creamDark: '#F2ECE4',
      creamBorder: '#E5DCD0',
      charcoal: '#1A1715',
      charcoalLight: '#2D2825',
      warmGray: '#8C7C72',
      gold: '#C69C6D',
      goldLight: '#D9B890',
    },
    contacts: {
      phone: '(11) 3568-2495',
      phoneRaw: '+551135682495',
      whatsapp: '(11) 95033-8488',
      whatsappRaw: '5511950338488',
      email: 'claudia@roblesimobiliariasp.com.br',
      address: {
        street: 'Avenida das Nações Unidas, nº 14171',
        neighborhood: 'Vila Gertrudes',
        city: 'São Paulo',
        state: 'SP',
        fullAddress: 'Avenida das Nações Unidas, nº 14171, Vila Gertrudes, São Paulo - SP',
      },
    },
    socials: {
      instagram: 'https://www.instagram.com/roblesimobiliaria/',
      facebook: 'https://www.facebook.com/roblesimobiliariasp/',
      youtube: 'https://www.youtube.com/channel/UCK65kTIZ4SxbnkskBPCfoEw',
    },
    aboutSignature: {
      name: 'Claudia Robles',
      role: 'Fundadora & Diretora Geral',
      image: '/assinatura.png',
    },
    fonts: {
      sans: 'DM Sans',
      display: 'Playfair Display',
    },
    builderSettings: {
      headerStyle: 'transparent',
      footerStyle: 'simple',
      heroStyle: 'search-centered',
      heroTitle: 'Robles Imobiliária',
      heroSubtitle: 'Encontre os melhores imóveis de luxo de São Paulo com atendimento exclusivo e personalizado.',
      heroImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80',
      cardVariant: 'default',
      showCardBedrooms: true,
      showCardBathrooms: true,
      showCardArea: true,
      showCardCondo: true,
      showCardPetFriendly: true,
      modules: {
        featured: true,
        categories: true,
        cities: true,
        testimonials: true,
        blog: true,
        launches: true,
      },
      pages: {
        blog: true,
        launches: true,
        contact: true,
        sobre: true,
        anunciar: true,
        avaliar: true,
      },
      homeFilters: ['finalidade', 'tipo', 'neighborhood', 'bedrooms'],
      searchFiltersLayout: 'sidebar',
      detailGalleryStyle: 'mosaic',
      openingHours: 'Segunda a Sexta das 9h às 18h · Sábados das 9h às 13h',
      homeBlocks: ['stats', 'featured', 'categories', 'launches', 'cities', 'testimonials', 'cta', 'tags'],
      showHeaderTopBar: true,
      team: [
        {
          name: 'Rafaela Monteiro',
          role: 'Diretora Comercial',
          phone: '(11) 99847-3821',
          email: 'rafaela@robles.com.br',
          photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80',
          instagram: 'https://instagram.com/rafaela',
        },
        {
          name: 'Thiago Cavalcante',
          role: 'Especialista em Coberturas',
          phone: '(21) 98834-5577',
          email: 'thiago@robles.com.br',
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
          instagram: 'https://instagram.com/thiago',
        }
      ]
    }
  },
]

export function getCustomTenants(): Tenant[] {
  if (typeof window === 'undefined') return []
  const custom = window.localStorage.getItem('v8_custom_tenants')
  if (!custom) return []
  try {
    return JSON.parse(custom)
  } catch (e) {
    console.error('Error parsing custom tenants', e)
    return []
  }
}

export function getTenantBySlug(slug: string): Tenant | undefined {
  const allTenantsList = [...tenants, ...getCustomTenants()]
  const tenant = allTenantsList.find((t) => t.slug.toLowerCase() === slug.toLowerCase())
  if (!tenant) return undefined

  if (typeof window !== 'undefined') {
    const custom = window.localStorage.getItem(`${tenant.id}_builder_settings`)
    if (custom) {
      try {
        const settings = JSON.parse(custom)
        return {
          ...tenant,
          ...settings,
          name: settings.name || tenant.name,
          slug: settings.slug || tenant.slug,
          colors: { ...tenant.colors, ...(settings.colors || {}) },
          fonts: { ...tenant.fonts, ...(settings.fonts || {}) },
          contacts: {
            ...tenant.contacts,
            ...(settings.contacts || {}),
            address: { ...tenant.contacts.address, ...(settings.contacts?.address || {}) }
          },
          builderSettings: {
            ...tenant.builderSettings,
            ...settings,
            modules: { ...tenant.builderSettings.modules, ...(settings.modules || {}) },
            pages: { ...tenant.builderSettings.pages, ...(settings.pages || {}) },
            team: settings.team || tenant.builderSettings.team
          },
          aboutSignature: settings.team?.[0] ? {
            name: settings.team[0].name,
            role: settings.team[0].role,
            image: settings.team[0].photo || '/assinatura.png'
          } : tenant.aboutSignature
        }
      } catch (e) {
        console.error('Error parsing custom settings', e)
      }
    }
  }
  return tenant
}

export function getTenantById(id: string): Tenant | undefined {
  const allTenantsList = [...tenants, ...getCustomTenants()]
  const tenant = allTenantsList.find((t) => t.id === id)
  if (!tenant) return undefined

  if (typeof window !== 'undefined') {
    const custom = window.localStorage.getItem(`${tenant.id}_builder_settings`)
    if (custom) {
      try {
        const settings = JSON.parse(custom)
        return {
          ...tenant,
          ...settings,
          name: settings.name || tenant.name,
          slug: settings.slug || tenant.slug,
          colors: { ...tenant.colors, ...(settings.colors || {}) },
          fonts: { ...tenant.fonts, ...(settings.fonts || {}) },
          contacts: {
            ...tenant.contacts,
            ...(settings.contacts || {}),
            address: { ...tenant.contacts.address, ...(settings.contacts?.address || {}) }
          },
          builderSettings: {
            ...tenant.builderSettings,
            ...settings,
            modules: { ...tenant.builderSettings.modules, ...(settings.modules || {}) },
            pages: { ...tenant.builderSettings.pages, ...(settings.pages || {}) },
            team: settings.team || tenant.builderSettings.team
          },
          aboutSignature: settings.team?.[0] ? {
            name: settings.team[0].name,
            role: settings.team[0].role,
            image: settings.team[0].photo || '/assinatura.png'
          } : tenant.aboutSignature
        }
      } catch (e) {
        console.error('Error parsing custom settings', e)
      }
    }
  }
  return tenant
}
