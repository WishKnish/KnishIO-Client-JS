/**
 * defaultRequestPolicy + context-forwarding (cross-SDK fresh-read parity).
 *
 * A long-lived KnishIOClient runs on urql's cache-first default, so any read
 * that omits an explicit requestPolicy can serve a stale cached result (e.g. a
 * meta queried before it existed). Two fixes restore freshness:
 *   1. UrqlClientWrapper.query/mutate forward the urql requestPolicy (previously
 *      the whole context was dropped, so QueryContinuId's network-only never
 *      reached urql).
 *   2. A client-level defaultRequestPolicy lets a server/sync client opt every
 *      read into 'network-only' without passing it on each call.
 *
 * CRITICAL: the wrapper forwards ONLY requestPolicy, never the whole context.
 * urql REPLACES (not merges) the client-level fetchOptions with a per-call
 * context.fetchOptions; forwarding context.fetchOptions would drop the
 * X-Auth-Token header set in createUrqlClient and break auth.
 */
import { describe, test, expect, jest } from '@jest/globals'
import KnishIOClient from '../src/KnishIOClient'
import UrqlClientWrapper from '../src/libraries/urql/UrqlClientWrapper'
import QueryContinuId from '../src/query/QueryContinuId'

const testUri = 'https://test.local/graphql'

// A stand-in Query whose execute() captures the variables/context that
// executeQuery forwards. Not a real query, so no network is touched.
function fakeQuery () {
  const captured = {}
  const obj = {
    $__query: 'fake',
    execute: async ({ variables, context } = {}) => {
      captured.variables = variables
      captured.context = context
      return null
    }
  }
  return { obj, captured }
}

describe('KnishIOClient defaultRequestPolicy', () => {
  test('applies defaultRequestPolicy to reads when the caller gives no per-call policy', async () => {
    const client = new KnishIOClient({ uri: testUri, defaultRequestPolicy: 'network-only' })
    const { obj, captured } = fakeQuery()
    await client.executeQuery(obj, { a: 1 })
    expect(captured.context.requestPolicy).toBe('network-only')
  })

  test('lets an explicit per-call requestPolicy override the client default', async () => {
    const client = new KnishIOClient({ uri: testUri, defaultRequestPolicy: 'network-only' })
    const { obj, captured } = fakeQuery()
    await client.executeQuery(obj, { a: 1 }, { requestPolicy: 'cache-first' })
    expect(captured.context.requestPolicy).toBe('cache-first')
  })

  test('leaves requestPolicy unset when no default is configured (urql default = cache-first)', async () => {
    const client = new KnishIOClient({ uri: testUri })
    const { obj, captured } = fakeQuery()
    await client.executeQuery(obj, { a: 1 })
    // fetchOptions.signal is always injected; requestPolicy must be absent.
    expect(captured.context.requestPolicy).toBeUndefined()
    expect(captured.context.fetchOptions).toBeDefined()
  })

  test('exposes get/setDefaultRequestPolicy', () => {
    const client = new KnishIOClient({ uri: testUri })
    expect(client.getDefaultRequestPolicy()).toBeNull()
    client.setDefaultRequestPolicy('network-only')
    expect(client.getDefaultRequestPolicy()).toBe('network-only')
  })
})

describe('UrqlClientWrapper context forwarding (auth-safety + abort wiring)', () => {
  function wrapperWithSpy () {
    const wrapper = new UrqlClientWrapper({ serverUri: testUri })
    wrapper.$__authToken = 'tok-123'
    const query = jest.fn(() => ({ toPromise: async () => ({ data: { ok: true }, error: null }) }))
    const mutation = jest.fn(() => ({ toPromise: async () => ({ data: { ok: true }, error: null }) }))
    wrapper.$__client = { query, mutation }
    return { wrapper, query, mutation }
  }

  test('with a per-query signal: forwards requestPolicy + RE-SUPPLIES X-Auth-Token + an AbortSignal', async () => {
    const { wrapper, query } = wrapperWithSpy()
    const ac = new AbortController()
    await wrapper.query({
      query: 'gqlA',
      variables: { x: 1 },
      context: { fetchOptions: { signal: ac.signal }, requestPolicy: 'network-only' }
    })
    const [, , opts] = query.mock.calls[0]
    expect(opts.requestPolicy).toBe('network-only')
    // auth-safety invariant: whenever fetchOptions IS forwarded, it MUST carry
    // the auth header (urql replaces, not merges — forwarding without it 401s).
    expect(opts.fetchOptions.headers['X-Auth-Token']).toBe('tok-123')
    expect(opts.fetchOptions.signal).toBeInstanceOf(AbortSignal)
  })

  test('the forwarded signal aborts when the per-query signal aborts', async () => {
    const { wrapper, query } = wrapperWithSpy()
    const ac = new AbortController()
    await wrapper.query({ query: 'gqlB', variables: {}, context: { fetchOptions: { signal: ac.signal } } })
    const [, , opts] = query.mock.calls[0]
    expect(opts.fetchOptions.signal.aborted).toBe(false)
    ac.abort()
    expect(opts.fetchOptions.signal.aborted).toBe(true)
  })

  test('no signal, requestPolicy set: forwards {requestPolicy} only (client-level fetchOptions used)', async () => {
    const { wrapper, query } = wrapperWithSpy()
    await wrapper.query({ query: 'gqlC', variables: { y: 2 }, context: { requestPolicy: 'network-only' } })
    expect(query).toHaveBeenCalledWith('gqlC', { y: 2 }, { requestPolicy: 'network-only' })
  })

  test('no context: forwards undefined opts', async () => {
    const { wrapper, query } = wrapperWithSpy()
    await wrapper.query({ query: 'gqlD', variables: {} })
    expect(query).toHaveBeenCalledWith('gqlD', {}, undefined)
  })

  test('mutate also re-supplies X-Auth-Token when a signal is present', async () => {
    const { wrapper, mutation } = wrapperWithSpy()
    const ac = new AbortController()
    await wrapper.mutate({ mutation: 'mutA', variables: {}, context: { fetchOptions: { signal: ac.signal }, requestPolicy: 'network-only' } })
    const [, , opts] = mutation.mock.calls[0]
    expect(opts.requestPolicy).toBe('network-only')
    expect(opts.fetchOptions.headers['X-Auth-Token']).toBe('tok-123')
  })
})

describe('KnishIOClient query cancellation (abort wiring)', () => {
  test('cancelQuery aborts the stored AbortController', () => {
    const client = new KnishIOClient({ uri: testUri })
    const query = { $__query: 'q1' }
    const variables = { a: 1 }
    const ac = new AbortController()
    const queryKey = JSON.stringify({ query: query.$__query, variables })
    client.abortControllers.set(queryKey, ac)
    expect(ac.signal.aborted).toBe(false)
    client.cancelQuery(query, variables)
    expect(ac.signal.aborted).toBe(true)
  })

  test('cancelAllQueries aborts every stored controller', () => {
    const client = new KnishIOClient({ uri: testUri })
    const a1 = new AbortController()
    const a2 = new AbortController()
    client.abortControllers.set('k1', a1)
    client.abortControllers.set('k2', a2)
    client.cancelAllQueries()
    expect(a1.signal.aborted).toBe(true)
    expect(a2.signal.aborted).toBe(true)
  })
})

describe('QueryContinuId fresh-read (end-to-end)', () => {
  test('QueryContinuId reaches the client with requestPolicy network-only', async () => {
    const captured = {}
    const mockClient = {
      getUri: () => testUri,
      // Capture the request the Query layer hands us, then bail before response
      // construction (Query.execute re-throws non-AbortErrors).
      query: async (req) => {
        captured.req = req
        throw new Error('__captured__')
      }
    }
    const q = new QueryContinuId(mockClient, { log: () => {} })
    await expect(q.execute({ variables: { bundle: 'abc' } })).rejects.toThrow('__captured__')
    expect(captured.req.context.requestPolicy).toBe('network-only')
  })

  test('createQueryContext pins network-only', () => {
    const q = new QueryContinuId({ getUri: () => testUri }, { log: () => {} })
    expect(q.createQueryContext()).toEqual({ requestPolicy: 'network-only' })
  })
})
