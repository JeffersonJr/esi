/**
 * Feature flags do sistema evolves
 * 
 * temIA: controla acesso às funcionalidades de Inteligência Artificial:
 *   - Cadastro de imóveis via análise de fotos (IA)
 *   - Albert — IA de atendimento, follow-up automático de leads
 *
 * Em produção, esse valor virá do perfil do usuário / plano contratado.
 * Para simular usuário SEM IA: false
 * Para simular usuário COM IA: true
 */
export const featureFlags = {
  temIA: false,
} as const
