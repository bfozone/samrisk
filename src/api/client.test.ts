import { describe, expect, it } from 'vitest'
import * as v from 'valibot'
import { AxiosError, AxiosHeaders } from 'axios'
import { parse, parseArray, classifyError } from './client'

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

function makeAxiosError(status?: number, headers?: Record<string, string>): AxiosError {
  const error = new AxiosError('test error')
  if (status !== undefined) {
    error.response = {
      status,
      statusText: 'Error',
      headers: headers ?? {},
      config: { headers: new AxiosHeaders() },
      data: null,
    }
  }
  return error
}

describe('classifyError', () => {
  it('classifies 401 as unauthorized', () => {
    expect(classifyError(makeAxiosError(401)).kind).toBe('unauthorized')
  })

  it('classifies 403 as forbidden', () => {
    expect(classifyError(makeAxiosError(403)).kind).toBe('forbidden')
  })

  it('classifies 404 as not_found', () => {
    expect(classifyError(makeAxiosError(404)).kind).toBe('not_found')
  })

  it('classifies 422 as validation', () => {
    expect(classifyError(makeAxiosError(422)).kind).toBe('validation')
  })

  it('classifies 429 as rate_limited', () => {
    const ctx = classifyError(makeAxiosError(429))
    expect(ctx.kind).toBe('rate_limited')
    expect(ctx.retryAfter).toBeUndefined()
  })

  it('parses retry-after header for 429', () => {
    const ctx = classifyError(makeAxiosError(429, { 'retry-after': '30' }))
    expect(ctx.kind).toBe('rate_limited')
    expect(ctx.retryAfter).toBe(30)
  })

  it('classifies 500 as server', () => {
    expect(classifyError(makeAxiosError(500)).kind).toBe('server')
  })

  it('classifies 503 as server', () => {
    expect(classifyError(makeAxiosError(503)).kind).toBe('server')
  })

  it('classifies no response as network', () => {
    expect(classifyError(makeAxiosError()).kind).toBe('network')
  })

  it('classifies unknown status as unknown', () => {
    expect(classifyError(makeAxiosError(418)).kind).toBe('unknown')
  })
})
