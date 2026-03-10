import * as v from 'valibot'
import { describe, expect, it } from 'vitest'
import {
  AuMSnapshotSchema,
  ExposureBucketSchema,
  LiquidityBucketSchema,
  PnLResultSchema,
  PortfolioSchema,
  PositionSchema,
  TrackingErrorResultSchema,
  UserSchema,
  VaRResultSchema,
} from './schemas'

function expectValid<T>(schema: v.GenericSchema<T>, data: unknown) {
  expect(() => v.parse(schema, data)).not.toThrow()
}

function expectInvalid<T>(schema: v.GenericSchema<T>, data: unknown) {
  expect(() => v.parse(schema, data)).toThrow()
}

describe('userSchema', () => {
  it('accepts valid user', () => {
    expectValid(UserSchema, { id: '1', name: 'John', initials: 'JD', role: 'admin' })
  })

  it('rejects empty name', () => {
    expectInvalid(UserSchema, { id: '1', name: '', initials: 'JD', role: 'admin' })
  })

  it('rejects empty initials', () => {
    expectInvalid(UserSchema, { id: '1', name: 'John', initials: '', role: 'admin' })
  })

  it('rejects missing fields', () => {
    expectInvalid(UserSchema, { id: '1', name: 'John' })
  })
})

describe('portfolioSchema', () => {
  it('accepts valid portfolio', () => {
    expectValid(PortfolioSchema, { id: '1', name: 'Test', benchmarkName: 'MSCI World', currency: 'EUR', navTotal: 1_000_000, manager: 'Jane Doe', inceptionDate: '2020-01-15' })
  })

  it('rejects invalid currency', () => {
    expectInvalid(PortfolioSchema, { id: '1', name: 'Test', benchmarkName: 'MSCI World', currency: 'BTC', navTotal: 1_000_000, manager: 'Jane Doe', inceptionDate: '2020-01-15' })
  })

  it('rejects negative navTotal', () => {
    expectInvalid(PortfolioSchema, { id: '1', name: 'Test', benchmarkName: 'MSCI World', currency: 'EUR', navTotal: -100, manager: 'Jane Doe', inceptionDate: '2020-01-15' })
  })
})

describe('auMSnapshotSchema', () => {
  it('accepts valid snapshot', () => {
    expectValid(AuMSnapshotSchema, { portfolioId: '1', date: '2025-01-01', aum: 500_000_000 })
  })

  it('rejects bad date format', () => {
    expectInvalid(AuMSnapshotSchema, { portfolioId: '1', date: '01/01/2025', aum: 500_000_000 })
  })

  it('rejects negative aum', () => {
    expectInvalid(AuMSnapshotSchema, { portfolioId: '1', date: '2025-01-01', aum: -100 })
  })
})

describe('vaRResultSchema', () => {
  it('accepts valid VaR', () => {
    expectValid(VaRResultSchema, { portfolioId: '1', date: '2025-01-01', var95: 1.5, var99: 2.5, cvar95: 2.0 })
  })

  it('rejects bad date format', () => {
    expectInvalid(VaRResultSchema, { portfolioId: '1', date: '2025-1-1', var95: 1.5, var99: 2.5, cvar95: 2.0 })
  })
})

describe('pnLResultSchema', () => {
  it('accepts valid PnL with negative values', () => {
    expectValid(PnLResultSchema, { portfolioId: '1', date: '2025-01-01', daily: -50000, mtd: -30000, ytd: -30000, cumulative: -30000 })
  })

  it('rejects bad date', () => {
    expectInvalid(PnLResultSchema, { portfolioId: '1', date: 'invalid', daily: 0, mtd: 0, ytd: 0, cumulative: 0 })
  })
})

describe('trackingErrorResultSchema', () => {
  it('accepts valid TE', () => {
    expectValid(TrackingErrorResultSchema, { portfolioId: '1', date: '2025-01-01', te: 1.5, activeReturn: 0.3, infoRatio: 0.8 })
  })

  it('rejects negative TE', () => {
    expectInvalid(TrackingErrorResultSchema, { portfolioId: '1', date: '2025-01-01', te: -1, activeReturn: 0.3, infoRatio: 0.8 })
  })
})

describe('liquidityBucketSchema', () => {
  it('accepts valid bucket', () => {
    expectValid(LiquidityBucketSchema, { portfolioId: '1', horizon: '1 Day', value: 50_000_000, percentage: 10 })
  })

  it('rejects negative value', () => {
    expectInvalid(LiquidityBucketSchema, { portfolioId: '1', horizon: '1 Day', value: -100, percentage: 10 })
  })

  it('rejects missing fields', () => {
    expectInvalid(LiquidityBucketSchema, { portfolioId: '1', horizon: '1 Day' })
  })
})

describe('exposureBucketSchema', () => {
  it('accepts negative values for short exposure', () => {
    expectValid(ExposureBucketSchema, { category: 'Derivatives', value: -50_000, percentage: -5 })
  })

  it('rejects missing category', () => {
    expectInvalid(ExposureBucketSchema, { value: 100, percentage: 10 })
  })

  it('rejects missing percentage', () => {
    expectInvalid(ExposureBucketSchema, { category: 'Equities', value: 100 })
  })
})

describe('positionSchema', () => {
  it('accepts negative quantity for shorts', () => {
    expectValid(PositionSchema, { id: '1', portfolioId: '1', instrument: 'XYZ', assetClass: 'Equity', quantity: -100, marketValue: -5000, weight: -2 })
  })

  it('rejects missing instrument', () => {
    expectInvalid(PositionSchema, { id: '1', portfolioId: '1', assetClass: 'Equity', quantity: 100, marketValue: 5000, weight: 2 })
  })

  it('rejects missing fields', () => {
    expectInvalid(PositionSchema, { id: '1', portfolioId: '1' })
  })
})
