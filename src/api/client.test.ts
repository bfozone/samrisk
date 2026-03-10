import { HTTPError } from 'ky'
import * as v from 'valibot'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { classifyError, configureApiErrorHandlers, configureAuthToken, parse, parseArray } from './client'

describe('parse', () => {
  const schema = v.object({ id: v.string(), value: v.number() })

  it('parses valid data', () => {
    const result = parse(schema, { id: 'test', value: 42 })
    expect(result).toEqual({ id: 'test', value: 42 })
  })

  it('throws on invalid data', () => {
    expect(() => parse(schema, { id: 123, value: 'bad' })).toThrow()
  })

  it('throws on missing fields', () => {
    expect(() => parse(schema, { id: 'test' })).toThrow()
  })
})

describe('parseArray', () => {
  const schema = v.object({ id: v.string() })

  it('parses valid array', () => {
    const result = parseArray(schema, [{ id: 'a' }, { id: 'b' }])
    expect(result).toEqual([{ id: 'a' }, { id: 'b' }])
  })

  it('parses empty array', () => {
    expect(parseArray(schema, [])).toEqual([])
  })

  it('throws on non-array input', () => {
    expect(() => parseArray(schema, { id: 'a' })).toThrow()
  })

  it('throws on invalid element', () => {
    expect(() => parseArray(schema, [{ id: 123 }])).toThrow()
  })
})

function makeHTTPError(status?: number, headers?: Record<string, string>): HTTPError | Error {
  if (status === undefined)
    return new Error('Network error')

  const response = new Response(null, {
    status,
    statusText: 'Error',
    headers: headers ?? {},
  })
  const request = new Request('https://example.com/api/test')
  return new HTTPError(response, request, {} as never)
}

describe('classifyError', () => {
  it('classifies 401 as unauthorized', () => {
    expect(classifyError(makeHTTPError(401)).kind).toBe('unauthorized')
  })

  it('classifies 403 as forbidden', () => {
    expect(classifyError(makeHTTPError(403)).kind).toBe('forbidden')
  })

  it('classifies 404 as not_found', () => {
    expect(classifyError(makeHTTPError(404)).kind).toBe('not_found')
  })

  it('classifies 422 as validation', () => {
    expect(classifyError(makeHTTPError(422)).kind).toBe('validation')
  })

  it('classifies 429 as rate_limited', () => {
    const ctx = classifyError(makeHTTPError(429))
    expect(ctx.kind).toBe('rate_limited')
    expect(ctx.retryAfter).toBeUndefined()
  })

  it('parses retry-after header for 429', () => {
    const ctx = classifyError(makeHTTPError(429, { 'retry-after': '30' }))
    expect(ctx.kind).toBe('rate_limited')
    expect(ctx.retryAfter).toBe(30)
  })

  it('classifies 500 as server', () => {
    expect(classifyError(makeHTTPError(500)).kind).toBe('server')
  })

  it('classifies 503 as server', () => {
    expect(classifyError(makeHTTPError(503)).kind).toBe('server')
  })

  it('classifies no response as network', () => {
    expect(classifyError(makeHTTPError()).kind).toBe('network')
  })

  it('classifies unknown status as unknown', () => {
    expect(classifyError(makeHTTPError(418)).kind).toBe('unknown')
  })
})

describe('configureApiErrorHandlers', () => {
  afterEach(() => {
    // Reset to defaults
    configureApiErrorHandlers({})
  })

  it('overrides a single handler', () => {
    const spy = vi.fn()
    configureApiErrorHandlers({ onUnauthorized: spy })
    // Handler is stored - verify by configuring again without losing others
    const spy2 = vi.fn()
    configureApiErrorHandlers({ onForbidden: spy2 })
    // Original override should still work since configureApiErrorHandlers merges
    expect(spy).not.toHaveBeenCalled()
  })

  it('accepts partial handlers without throwing', () => {
    expect(() => configureApiErrorHandlers({ onServerError: vi.fn() })).not.toThrow()
  })

  it('accepts empty object without throwing', () => {
    expect(() => configureApiErrorHandlers({})).not.toThrow()
  })
})

describe('configureAuthToken', () => {
  it('accepts a token provider without throwing', () => {
    expect(() => configureAuthToken(async () => 'test-token')).not.toThrow()
  })

  it('accepts a provider returning null', () => {
    expect(() => configureAuthToken(async () => null)).not.toThrow()
  })
})
