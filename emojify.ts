import * as fs from 'fs'

function buildDictionaryFrom(data: Buffer): Record<string, Buffer> {
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
                dict[ctx.name] = context.sliceOf(data, ctx.index, i)
                delete ctx.name
              }
              else {
                const buf = context.sliceOf(data, ctx.index, i)
                ctx.name = buf.toString()
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

function createSlicedBuffer(data: Buffer, begin?: number, end?: number): Buffer {
  const offset = begin ?? 0
  const length = (end ?? data.byteLength) - offset
  const buf = context.allocBuffer(length)
  for (let i = 0; i < length; i++)
    buf[i] = data[offset + i]
  return buf
}

function emojify(data: Buffer, dict: Record<string, Buffer>): void {
  const ctx = {} as { index?: number, preserved?: true }
  const flush = (end?: number) => {
    if (ctx.preserved) {
      delete ctx.preserved
      process.stdout.write(context.sliceOf(data, ctx.index, end))
    }
    delete ctx.index
  }
  for (let i = 0; i < data.byteLength; i++)
    if (data[i] === COLON) {
      for (let j = i + 1; j < data.byteLength; j++) {
        const c = data[j]
        if (c === COLON) {
          const name = context.sliceOf(data, i + 1, j).toString()
          const code = dict[name]
          process.stdout.cork()
          flush(i)
          process.stdout.write(code ?? `:${name}:`)
          process.stdout.uncork()
          i = j
        }
        else if (isNumAlphaOr(c, [HYPHEN, UNDERSCORE]))
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

function isNumAlphaOr(c: number, or: number[]): boolean {
  if (0x30 <= c && c <= 0x39)
    return true
  if (0x41 <= c && c <= 0x5a)
    return true
  if (0x61 <= c && c <= 0x7a)
    return true
  return context.includes(or, c)
}

const CLOSE_BRACE = '}'.codePointAt(0)
const COLON = ':'.codePointAt(0)
const COMMA = ','.codePointAt(0)
const DOUBLE_QUOTE = '"'.codePointAt(0)
const HYPHEN = '-'.codePointAt(0)
const OPEN_BRACE = '{'.codePointAt(0)
const UNDERSCORE = '_'.codePointAt(0)

const context = {
  allocBuffer: (length: number) => Buffer.alloc(length),
  includes: <T> (array: T[], elem: T) => array.includes(elem),
  index: 0,
  operation: null as null | 'list',
  sliceOf: (data: Buffer, begin?: number, end?: number) =>
    data.subarray(begin, end),
}

for (; context.index < process.argv.length; context.index++) {
  const argv = process.argv[context.index]
  switch (argv) {
    case '--avoid-buffer-alloc':
      context.allocBuffer = (length: number) => new Buffer(length)
      break
    case '--avoid-includes':
      context.includes = <T> (array: T[], elem: T) =>
        array.some((value: T) => value === elem)
      break
    case '--avoid-subarray':
      context.sliceOf = createSlicedBuffer
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
}

const source = 'assets/emoji.json'
const assetPath = `${__dirname}/${source}`
fs.lstat(assetPath, (err: NodeJS.ErrnoException, stats: fs.Stats) => {
  const path = err ? `../${source}` : stats.isSymbolicLink()
    ? fs.readlinkSync(assetPath)
    : `../${source}`
  fs.readFile(`${__dirname}/${path}`, {},
    (err: NodeJS.ErrnoException, data: Buffer) => {
      if (err) {
        console.error(err.message)
        process.exit(1)
      }
      const dict = buildDictionaryFrom(data)
      if (context.operation === 'list') {
        for (const name in dict) {
          process.stdout.write(dict[name])
          process.stdout.write(`\t:${name}:\n`)
        }
        process.exit(0)
      }
      process.stdin.on('data', (data: Buffer) => emojify(data, dict))
      process.stdin.on('close', (hadError: boolean) =>
        process.exit(hadError ? 1 : 0)
      )
      process.stdin.on('end', () =>
        process.exit(0)
      )
      process.stdin.on('error', (err: Error) =>
        process.stderr.write(err?.message ?? '')
      )
    })
})
