import { Writable } from 'stream'
import { join as joinPath, sep } from 'path'
import { lstat, readFile, readlink } from 'fs/promises'

interface EmojifyContext {
  allocBuffer: (_length: number) => Buffer
  index: number
  operation?: 'list'
  sliceOf: (_data: Buffer, _begin?: number, _end?: number) => Buffer
}

interface EmojifyParameters {
  context: EmojifyContext
  data: Buffer
  destination: Writable
  dictionary: Record<string, Buffer>
}

export type LoadAssetsError = NodeJS.ErrnoException | null

interface LocalContext {
  context: EmojifyContext
  data: Buffer
  index?: number
  name?: string
  prev?: number
}

const CLOSE_BRACE = '}'.codePointAt(0)
const COLON = ':'.codePointAt(0)
const COMMA = ','.codePointAt(0)
const DOUBLE_QUOTE = '"'.codePointAt(0)
const HYPHEN = '-'.codePointAt(0)
const OPEN_BRACE = '{'.codePointAt(0)
const PLUS = '+'.codePointAt(0)
const UNDERSCORE = '_'.codePointAt(0)

export const buildDictionaryFrom = (context: EmojifyContext, data: Buffer): Record<string, Buffer> => {
  const ctx = { context, data } as LocalContext
  const dict = {} as Record<string, Buffer>
  try {
    for (let i = 0; i < data.byteLength; i++) {
      const c = data[i]
      const result = topLevelHandlers.get(c)?.(ctx, dict, i)
      if (result)
        return result
      ctx.prev = c
    }
    process.stderr.write('\u001b[31mNo close brace found\u001b[m\n')
  }
  catch (error: unknown) {
    process.stderr.write(`\u001b[31m${error}\u001b[m\n`)
  }
  return dict
}

export const createContext = (argv: string[]): EmojifyContext => {
  const context = {
    allocBuffer: (length: number) => Buffer.alloc(length),
    index: 0,
    sliceOf: (data: Buffer, begin?: number, end?: number) => data.subarray(begin, end),
  } as EmojifyContext
  for (; context.index < argv.length; context.index++)
    contextBuilders[argv[context.index]]?.(context)
  return context
}

const createSlicedBuffer = (context: EmojifyContext, data: Buffer, begin?: number, end?: number) => {
  const offset = begin ?? 0
  const length = (end ?? data.byteLength) - offset
  const buf = context.allocBuffer(length)
  for (let i = 0; i < length; i++)
    buf[i] = data[offset + i]
  return buf
}

export const emojify = (param: EmojifyParameters): void => {
  const ctx = {} as { index?: number, preserved?: true }
  try {
    for (let i = 0; i < param.data.byteLength; i++)
      if (param.data[i] === COLON)
        emojifyAfterColon(ctx, i, param)
      else if (!ctx.preserved) {
        ctx.index = i
        ctx.preserved = true
      }
    flush(ctx, param)
  }
  catch (error: unknown) {
    handleException(error)
  }
}

const emojifyAfterColon = (ctx: { index?: number, preserved?: true }, i: number, param: EmojifyParameters) => {
  for (let j = i + 1; j < param.data.byteLength; j++) {
    const c = param.data[j]
    if (c === COLON) {
      const name = param.context.sliceOf(param.data, i + 1, j).toString()
      const code = param.dictionary[name]
      param.destination.cork()
      flush(ctx, param, i)
      param.destination.write(code ?? `:${name}:`)
      param.destination.uncork()
      i = j
    }
    else if (isAppropriateCharAsNameOfEmoji(c))
      continue
    else
      break
  }
}

const flush = (ctx: { index?: number, preserved?: true }, param: EmojifyParameters, end?: number) => {
  if (ctx.preserved) {
    delete ctx.preserved
    param.destination.write(param.context.sliceOf(param.data, ctx.index, end))
  }
  delete ctx.index
}

const handleCloseBrace = (ctx: LocalContext, dict: Record<string, Buffer>, i: number) => {
  if (ctx.name || ctx.prev !== DOUBLE_QUOTE)
    throw `Invalid close brace at ${i}`
  return dict
}

const handleColon = (ctx: LocalContext, _dict: Record<string, Buffer>, i: number) => {
  if (ctx.index || !ctx.name || ctx.prev !== DOUBLE_QUOTE)
    throw `Invalid colon at ${i}`
}

const handleColonInDoubleQuote = (ctx: LocalContext, i: number) => {
  if (ctx.index || !ctx.name)
    throw `Invalid double quote at ${i}`
  ctx.index = i + 1
}

const handleComma = (ctx: LocalContext, _dict: Record<string, Buffer>, i: number) => {
  if (ctx.index || ctx.name || ctx.prev !== DOUBLE_QUOTE)
    throw `Invalid comma at ${i}`
}

const handleCommaOrOpenBraceInDoubleQuote = (ctx: LocalContext, i: number) => {
  if (ctx.index || ctx.name)
    throw `Invalid double quote at ${i}`
  ctx.index = i + 1
}

const handleDoubleQuote = (ctx: LocalContext, dict: Record<string, Buffer>, i: number) => {
  const handler = handlersInDoubleQuote.get(ctx.prev)
  if (handler)
    handler(ctx, i)
  else {
    if (!ctx.index)
      throw `Invalid double quote at ${i}`
    const { context, data } = ctx
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
  }
}

const handleException = (error: unknown) => {
  try {
    if (typeof error === 'string' || error instanceof Uint8Array)
      process.stderr.write(error)
  }
  catch (_err: unknown) {
    process.exit(1)
  }
}

const handleOpenBrace = (ctx: LocalContext, _dict: Record<string, Buffer>, i: number) => {
  if (ctx.index || ctx.name || ctx.prev)
    throw `Invalid open brace at ${i}`
}

const isAppropriateCharAsNameOfEmoji = (c: number) => {
  const score = +(0x30 <= c) * 8 + +(c <= 0x39) * 4 + +(0x61 <= c) * 2 + +(c <= 0x7a)
  return [3, 12].includes(score) || [HYPHEN, PLUS, UNDERSCORE].includes(c)
}

const isNodeJsErrnoException = (value: unknown, code?: string): value is NodeJS.ErrnoException => {
  const error = value as NodeJS.ErrnoException
  return value instanceof Error && typeof error.code === 'string' && (code ?? error.code) === error.code
}

export const loadAssets = async () => {
  const basePath = __dirname.split(sep).reverse().slice(2).reverse().join(sep)
  const path = joinPath('assets', 'emoji.json')
  const lpath = joinPath(basePath, path)
  const stats = await lstat(lpath).catch(passThrough)
  if (isNodeJsErrnoException(stats, 'ENOENT'))
    return await readFile(joinPath(__dirname, path), {}).catch(passThrough)
  else if (stats.isSymbolicLink()) {
    const path = await readlink(lpath, {}).catch(passThrough)
    return isNodeJsErrnoException(path) ? path : await readFile(joinPath(basePath, 'assets', path), {}).catch(passThrough)
  }
  else
    return stats
}

const passThrough = <T>(value: T) => value

const throwInvalidDoubleQuote = (_ctx: LocalContext, i: number) => {
  throw `Invalid double quote at ${i}`
}

const contextBuilders = {
  '--avoid-buffer-alloc': (context: EmojifyContext) => context.allocBuffer = (length: number) => new Buffer(length),
  '--avoid-subarray': (context: EmojifyContext) => context.sliceOf = (data: Buffer, begin?: number, end?: number) => createSlicedBuffer(context, data, begin, end),
  '--list': (context: EmojifyContext) => context.operation = 'list',
  '--verbose': (_context: EmojifyContext) => Object.entries(process.versions).forEach(
    (entry: [string, string]) => {
      const [name, value] = entry
      process.stdout.write(`${name}: ${value}\n`)
    }
  ),
} as Record<string, (_context: EmojifyContext) => void>
contextBuilders['-l'] = contextBuilders['--list']
contextBuilders['-v'] = contextBuilders['--verbose']
Object.freeze(contextBuilders)

const handlersInDoubleQuote = new Map<number, (_ctx: LocalContext, _i: number) => void>()
handlersInDoubleQuote.set(CLOSE_BRACE, throwInvalidDoubleQuote)
handlersInDoubleQuote.set(COLON, handleColonInDoubleQuote)
handlersInDoubleQuote.set(COMMA, handleCommaOrOpenBraceInDoubleQuote)
handlersInDoubleQuote.set(DOUBLE_QUOTE, throwInvalidDoubleQuote)
handlersInDoubleQuote.set(OPEN_BRACE, handleCommaOrOpenBraceInDoubleQuote)
Object.freeze(handlersInDoubleQuote)

const topLevelHandlers = new Map<number, (_ctx: LocalContext, _dict: Record<string, Buffer>, _i: number) => Record<string, Buffer> | void>()
topLevelHandlers.set(CLOSE_BRACE, handleCloseBrace)
topLevelHandlers.set(COLON, handleColon)
topLevelHandlers.set(COMMA, handleComma)
topLevelHandlers.set(DOUBLE_QUOTE, handleDoubleQuote)
topLevelHandlers.set(OPEN_BRACE, handleOpenBrace)
Object.freeze(topLevelHandlers)
