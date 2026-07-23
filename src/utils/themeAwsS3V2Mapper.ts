import type { ThemeAwsS3V2, ThemeName } from '../themeAwsS3V2'
import type { Tenant } from '../data/tenants'

/**
 * Maps the flat editor state (settings, colors, fonts, contacts)
 * into the structured ThemeAwsS3V2 JSON schema format.
 */
export function mapBuilderToThemeS3(
  settings: any,
  colors: any,
  fonts: any,
  contacts: any
): ThemeAwsS3V2 {
  // Translate homeBlocks to ThemeAwsS3V2 sections
  const sections = (settings.homeBlocks || []).map((blockId: string) => {
    let type: any = blockId
    // Map block IDs to section types from V2 spec where applicable
    if (blockId === 'stats') type = 'highlight1'
    if (blockId === 'launches') type = 'highlight2'
    if (blockId === 'featured') type = 'highlight3'
    if (blockId === 'testimonials') type = 'testimonials'
    if (blockId === 'cities') type = 'neighborhoodBlock'
    if (blockId === 'cta') type = 'bannerNewsletter'
    if (blockId === 'tags') type = 'blockWords'

    return {
      type,
      visible: true,
    }
  })

  // Map header and footer options
  const headerStyle = settings.headerStyle || 'classic'
  const footerStyle = settings.footerStyle || 'detailed'

  return {
    schemaVersion: 2,
    design: {
      theme: {
        name: (settings.slug || 'lumina') as ThemeName,
        tokens: {
          colors: {
            primary: colors.gold,
            primarySearch: colors.goldLight,
            border: colors.creamBorder,
            background: colors.cream,
            surface: colors.creamDark,
            backgroundSearch: colors.creamDark,
            surfaceSearch: colors.cream,
            surfaceDetails: colors.creamDark,
            accent: colors.goldLight,
            text: colors.charcoal,
            textMuted: colors.warmGray,
          },
          typography: {
            fontFamily: fonts.sans,
          },
        },
      },
      general: {
        layout: {
          withWhatsappButton: true,
          whatsappButtonSize: 'medium',
        },
      },
      header: {
        transparentHeaderOnScroll: headerStyle === 'transparent',
        attilaLayout: headerStyle === 'classic',
        backgroundColor: colors.cream,
        height: '80px',
        logo: {
          width: '120px',
          internalLogo: { fullWidth: true },
        },
      },
      footer: {
        design: footerStyle === 'detailed' ? 'default' : 'attila',
        backgroundColor: colors.charcoal,
        logo: {
          width: '100px',
          internalLogo: { fullWidth: true },
        },
      },
      home: {
        sections: sections,
        banner: {
          fontSizeTitle: '36px',
          colorTitle: colors.charcoal,
        },
      },
      cards: {
        propertyCards: {
          cardType: settings.cardVariant || 'default',
        },
      },
    },
    behavior: {
      contact: {
        whatsappNumber: contacts.whatsapp,
        phoneNumber: contacts.phone,
        address: contacts.address?.fullAddress || contacts.address || '',
      },
      features: {
        blogEnabled: settings.enabledPages?.blog || false,
      },
      advancedSearch: {},
      search: {},
      details: {},
      home: {},
      seo: {
        advancedSearchIndexable: true,
      },
      integrations: {
        // Storing tracking codes inside behavior.integrations or behavior.seo
        blogEndpoint: settings.rdStationToken || '',
        newsletterUrl: settings.rdStationScript || '',
      },
      condominium: {},
    },
    content: {
      'footer.slogan': settings.heroSubtitle || '',
      'footer.copyright': contacts.creci || '',
      'home.banner.title': settings.heroTitle || '',
      'home.banner.secondaryPhrase': settings.heroSubtitle || '',
      'home.aboutUs.title': settings.sobreTitle || '',
      'home.aboutUs.description': settings.sobreText || '',
      'pages.about.title': settings.sobreTitle || '',
      'pages.about.description': settings.sobreText || '',
      'pages.contactUs.title': settings.contatoTitle || '',
      'pages.contactUs.description': settings.contatoSubtitle || '',
    },
    assets: {
      'brand.logoUrl': settings.logo || '',
      'home.banner.imageUrl': settings.heroImage || '',
      'home.aboutUs.imageUrl': settings.sobreImage || '',
    },
  }
}

/**
 * Maps a structured ThemeAwsS3V2 configuration JSON payload
 * back to the editor flat settings, colors, fonts, and contacts structure.
 */
export function mapThemeS3ToBuilder(
  s3Config: ThemeAwsS3V2,
  defaultTenant: Tenant
): { settings: any; colors: any; fonts: any; contacts: any } {
  const design = s3Config.design || {}
  const themeColors = design.theme?.tokens?.colors || {}
  const behavior = s3Config.behavior || {}
  const contact = behavior.contact || {}
  const content = s3Config.content || {}
  const assets = s3Config.assets || {}

  // Parse colors
  const colors = {
    cream: themeColors.background || defaultTenant.colors.cream,
    creamDark: themeColors.surface || defaultTenant.colors.creamDark,
    creamBorder: themeColors.border || defaultTenant.colors.creamBorder,
    charcoal: themeColors.text || defaultTenant.colors.charcoal,
    charcoalLight: defaultTenant.colors.charcoalLight,
    warmGray: themeColors.textMuted || defaultTenant.colors.warmGray,
    gold: themeColors.primary || defaultTenant.colors.gold,
    goldLight: themeColors.accent || defaultTenant.colors.goldLight,
  }

  // Parse fonts
  const fonts = {
    sans: design.theme?.tokens?.typography?.fontFamily || defaultTenant.fonts?.sans || 'Inter',
    display: defaultTenant.fonts?.display || 'Playfair Display',
  }

  // Parse contacts
  const contacts = {
    phone: contact.phoneNumber || defaultTenant.contacts.phone,
    phoneRaw: contact.phoneNumber?.replace(/\D/g, '') || defaultTenant.contacts.phoneRaw,
    whatsapp: contact.whatsappNumber || defaultTenant.contacts.whatsapp,
    whatsappRaw: contact.whatsappNumber?.replace(/\D/g, '') || defaultTenant.contacts.whatsappRaw,
    email: defaultTenant.contacts.email,
    creci: content['footer.copyright'] || defaultTenant.creci || '',
    address: {
      street: defaultTenant.contacts.address.street,
      neighborhood: defaultTenant.contacts.address.neighborhood,
      city: defaultTenant.contacts.address.city,
      state: defaultTenant.contacts.address.state,
      fullAddress: contact.address || defaultTenant.contacts.address.fullAddress,
    },
  }

  // Parse home blocks from sections list
  let homeBlocks = defaultTenant.builderSettings.homeBlocks || [
    'stats',
    'featured',
    'categories',
    'launches',
    'cities',
    'testimonials',
    'cta',
    'tags',
  ]
  if (design.home?.sections) {
    homeBlocks = design.home.sections
      .filter((s: any) => s.visible)
      .map((s: any) => {
        if (s.type === 'highlight1') return 'stats'
        if (s.type === 'highlight2') return 'launches'
        if (s.type === 'highlight3') return 'featured'
        if (s.type === 'neighborhoodBlock') return 'cities'
        if (s.type === 'bannerNewsletter') return 'cta'
        if (s.type === 'blockWords') return 'tags'
        return s.type
      })
  }

  // Resolve header/footer styles
  let headerStyle = defaultTenant.builderSettings.headerStyle
  if (design.header?.transparentHeaderOnScroll) {
    headerStyle = 'transparent'
  } else if (design.header?.attilaLayout) {
    headerStyle = 'classic'
  } else if (design.header) {
    headerStyle = 'minimal'
  }

  let footerStyle = defaultTenant.builderSettings.footerStyle
  if (design.footer?.design === 'attila') {
    footerStyle = 'minimal'
  } else if (design.footer) {
    footerStyle = 'detailed'
  }

  // Assemble final settings flat payload
  const settings = {
    ...defaultTenant.builderSettings,
    name: defaultTenant.name,
    slug: defaultTenant.slug,
    status: defaultTenant.status || 'online',
    headerStyle: headerStyle,
    footerStyle: footerStyle,
    logo: assets['brand.logoUrl'] || defaultTenant.logo,
    heroImage: assets['home.banner.imageUrl'] || defaultTenant.builderSettings.heroImage,
    heroTitle: content['home.banner.title'] || defaultTenant.builderSettings.heroTitle,
    heroSubtitle: content['home.banner.secondaryPhrase'] || defaultTenant.builderSettings.heroSubtitle,
    cardVariant: (design.cards?.propertyCards?.cardType as any) || defaultTenant.builderSettings.cardVariant,
    sobreTitle: content['home.aboutUs.title'] || defaultTenant.builderSettings.sobreTitle,
    sobreText: content['home.aboutUs.description'] || defaultTenant.builderSettings.sobreText,
    sobreImage: assets['home.aboutUs.imageUrl'] || defaultTenant.builderSettings.sobreImage,
    contatoTitle: content['pages.contactUs.title'] || defaultTenant.builderSettings.contatoTitle,
    contatoSubtitle: content['pages.contactUs.description'] || defaultTenant.builderSettings.contatoSubtitle,
    homeBlocks: homeBlocks,
  }

  return {
    settings,
    colors,
    fonts,
    contacts,
  }
}
