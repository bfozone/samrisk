import { authHandlers } from './data/auth'
import { portfolioHandlers } from './data/portfolios'
import { riskHandlers } from './data/risk'

export const handlers = [
  ...authHandlers,
  ...portfolioHandlers,
  ...riskHandlers,
]
