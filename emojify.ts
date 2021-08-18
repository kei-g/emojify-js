import * as fs from 'fs'
import { Writable } from 'stream'

export function buildDictionaryFrom(context: EmojifyContext, data: Buffer): Record<string, Buffer> {
  const ctx = {} as {
    index?: number,
    name?: string,
    prev?: number,
  }
  const dict = {} as Record<string, Buffer>
  try {
    for (let i = 0; i < data.byteLength; i++) {
      const c = data[i]
      switch (c) {
        case CLOSE_BRACE:
          if (ctx.name || ctx.prev !== DOUBLE_QUOTE)
            throw `Invalid close brace at ${i}`
          return dict
        case COLON:
          if (ctx.index || !ctx.name || ctx.prev !== DOUBLE_QUOTE)
            throw `Invalid colon at ${i}`
          break
        case COMMA:
          if (ctx.index || ctx.name || ctx.prev !== DOUBLE_QUOTE)
            throw `Invalid comma at ${i}`
          break
        case DOUBLE_QUOTE:
          switch (ctx.prev) {
            case CLOSE_BRACE:
            case DOUBLE_QUOTE:
              throw `Invalid double quote at ${i}`
            case COLON:
              if (ctx.index || !ctx.name)
                throw `Invalid double quote at ${i}`
              ctx.index = i + 1
              break
            case COMMA:
            case OPEN_BRACE:
              if (ctx.index || ctx.name)
                throw `Invalid double quote at ${i}`
              ctx.index = i + 1
              break
            default:
              if (!ctx.index)
                throw `Invalid double quote at ${i}`
              if (ctx.name) {
                const code = context.sliceOf(data, ctx.index, i)
                dict[ctx.name] = code
                delete ctx.name
              }
              else {
                const name = context.sliceOf(data, ctx.index, i)
                ctx.name = name.toString()
              }
              delete ctx.index
              break
          }
          break
        case OPEN_BRACE:
          if (ctx.index || ctx.name || ctx.prev)
            throw `Invalid open brace at ${i}`
          break
        default:
          break
      }
      ctx.prev = c
    }
    process.stderr.write('\u001b[31mNo close brace found\u001b[m\n')
  }
  catch (error) {
    process.stderr.write(`\u001b[31m${error}\u001b[m\n`)
  }
  return dict
}

type EmojifyContext = {
  allocBuffer: (length: number) => Buffer,
  includes: <T>(array: T[], elem: T) => boolean,
  index: number,
  operation: null | 'list',
  sliceOf: (data: Buffer, begin?: number, end?: number) => Buffer,
}

export function createContext(argv: string[]): EmojifyContext {
  const context = {
    allocBuffer: (length: number) => Buffer.alloc(length),
    includes: <T>(array: T[], elem: T) => array.includes(elem),
    index: 0,
    operation: null as null | 'list',
    sliceOf: (data: Buffer, begin?: number, end?: number) =>
      data.subarray(begin, end),
  }
  for (; context.index < argv.length; context.index++)
    switch (argv[context.index]) {
      case '--avoid-buffer-alloc':
        context.allocBuffer = (length: number) => new Buffer(length)
        break
      case '--avoid-includes':
        context.includes = <T>(array: T[], elem: T) =>
          array.some((value: T) => value === elem)
        break
      case '--avoid-subarray':
        context.sliceOf = (data: Buffer, begin?: number, end?: number) =>
          createSlicedBuffer(context, data, begin, end)
        break
      case '-l':
      case '--list':
        context.operation = 'list'
        break
      case '-V':
      case '--verbose':
        for (const name in process.versions)
          process.stdout.write(`${name}: ${process.versions[name]}\n`)
        break
    }
  return context
}

function createSlicedBuffer(context: EmojifyContext, data: Buffer, begin?: number, end?: number): Buffer {
  const offset = begin ?? 0
  const length = (end ?? data.byteLength) - offset
  const buf = context.allocBuffer(length)
  for (let i = 0; i < length; i++)
    buf[i] = data[offset + i]
  return buf
}

type EmojifyParameters = {
  context: EmojifyContext,
  data: Buffer,
  destination: Writable,
  dictionary: Record<string, Buffer>,
}

export function emojify(param: EmojifyParameters): void {
  const ctx = {} as { index?: number, preserved?: true }
  const flush = (end?: number) => {
    if (ctx.preserved) {
      delete ctx.preserved
      param.destination.write(param.context.sliceOf(param.data, ctx.index, end))
    }
    delete ctx.index
  }
  try {
    for (let i = 0; i < param.data.byteLength; i++)
      if (param.data[i] === COLON) {
        for (let j = i + 1; j < param.data.byteLength; j++) {
          const c = param.data[j]
          if (c === COLON) {
            const name = param.context.sliceOf(param.data, i + 1, j).toString()
            const code = param.dictionary[name]
            param.destination.cork()
            flush(i)
            param.destination.write(code ?? `:${name}:`)
            param.destination.uncork()
            i = j
          }
          else if (isNumAlphaOr(param.context, c, [HYPHEN, PLUS, UNDERSCORE]))
            continue
          else
            break
        }
      }
      else if (!ctx.preserved) {
        ctx.index = i
        ctx.preserved = true
      }
    flush()
  }
  catch (err: unknown) {
    try {
      if (typeof err === 'string' || err instanceof Uint8Array)
        process.stderr.write(err)
    }
    catch (err: unknown) {
      process.exit(1)
    }
  }
}

function isNumAlphaOr(context: EmojifyContext, c: number, or: number[]): boolean {
  if (0x30 <= c && c <= 0x39)
    return true
  if (0x61 <= c && c <= 0x7a)
    return true
  return context.includes(or, c)
}

type LoadAssetsCallback = (err: LoadAssetsError, data: Buffer) => void

export type LoadAssetsError = NodeJS.ErrnoException | null

export function loadAssets(cb: LoadAssetsCallback): void {
  const source = 'assets/emoji.json'
  const assetPath = `${__dirname}/${source}`
  fs.lstat(assetPath, (err: NodeJS.ErrnoException, stats: fs.Stats) => {
    const path = err ? `../${source}` : stats.isSymbolicLink()
      ? fs.readlinkSync(assetPath)
      : `../${source}`
    fs.readFile(`${__dirname}/${path}`, {}, cb)
  })
}

const CLOSE_BRACE = '}'.codePointAt(0)
const COLON = ':'.codePointAt(0)
const COMMA = ','.codePointAt(0)
const DOUBLE_QUOTE = '"'.codePointAt(0)
const HYPHEN = '-'.codePointAt(0)
const OPEN_BRACE = '{'.codePointAt(0)
const PLUS = '+'.codePointAt(0)
const UNDERSCORE = '_'.codePointAt(0)

const reportError = (err?: unknown) => {
  if (!err)
    return
  try {
    const msg = typeof err === 'string'
      ? err
      : err instanceof Buffer
        ? err.toString()
        : err instanceof Error && err.message
          ? err.message
          : err instanceof Uint8Array
            ? Buffer.from(err).toString()
            : null
    if (msg && typeof msg === 'string')
      process.stderr.write(`\u001b[31m${msg}\u001b[m\n`)
    else
      console.error(err)
  }
  catch (err: unknown) {
    process.exit(1)
  }
}

process.stderr.on('errpor', () => process.exit(1))
process.stdin.on('error', reportError)
process.stdout.on('error', reportError)

loadAssets((err?: NodeJS.ErrnoException, data?: Buffer) => {
  if (err) {
    reportError(err)
    process.exit(1)
  }
  const context = createContext(process.argv)
  const dict = buildDictionaryFrom(context, data)
  if (context.operation === 'list') {
    for (const name in dict) {
      process.stdout.write(dict[name], reportError)
      process.stdout.write(`\t:${name}:\n`, reportError)
    }
    process.exit(0)
  }
  process.stdin.on('data', (data: Buffer) =>
    emojify({ context, data, destination: process.stdout, dictionary: dict })
  )
  process.stdin.on('close', (hadError: boolean) =>
    process.exit(hadError ? 1 : 0)
  )
  process.stdin.on('end', () =>
    process.exit(0)
  )
})
